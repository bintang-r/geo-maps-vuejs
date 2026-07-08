<template>
  <!-- Floating Chatbot Widget -->
  <div class="fixed bottom-6 left-[440px] md:left-[500px] z-[9999] font-['Inter',sans-serif] select-none">
    
    <!-- Toggle Button with pulse animation when closed -->
    <button 
      @click="isOpen = !isOpen" 
      class="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-[0_8px_32px_rgba(20,184,166,0.5)] hover:scale-110 active:scale-95 transition-all duration-300"
    >
      <span v-if="!isOpen" class="absolute inset-0 rounded-full bg-teal-500 animate-ping opacity-30"></span>
      <i :class="isOpen ? 'fa-solid fa-xmark text-2xl' : 'fa-solid fa-robot text-2xl'" class="relative z-10 transition-all duration-300"></i>
      <!-- Notification badge -->
      <span v-if="!isOpen && unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">{{ unreadCount }}</span>
    </button>

    <!-- Chat Window -->
    <transition 
      enter-active-class="transition-all duration-300 ease-out" 
      enter-from-class="transform translate-y-8 opacity-0 scale-95" 
      enter-to-class="transform translate-y-0 opacity-100 scale-100" 
      leave-active-class="transition-all duration-200 ease-in" 
      leave-from-class="opacity-100 scale-100" 
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div 
        v-if="isOpen" 
        class="absolute bottom-20 left-0 w-[380px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
        style="height: 540px;"
      >
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <i class="fa-solid fa-robot text-white text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm leading-tight">Asisten Smart Wisata</h3>
              <p class="text-[10px] text-teal-100 flex items-center gap-1 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></span>
                AI Pariwisata Sumatera Utara
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <!-- Voice toggle -->
            <button 
              @click="toggleVoice" 
              class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              :class="isVoiceEnabled ? 'bg-white/20 text-white' : 'bg-black/10 text-white/50'"
              :title="isVoiceEnabled ? 'Matikan Suara' : 'Aktifkan Suara'"
            >
              <i :class="isVoiceEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'" class="text-xs"></i>
            </button>
            <!-- Clear chat -->
            <button @click="clearChat" class="w-8 h-8 rounded-xl bg-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 transition-all" title="Bersihkan Chat">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Suggestion chips (only when chat is empty) -->
        <div v-if="messages.length <= 1" class="px-3 pt-3 flex flex-wrap gap-1.5 shrink-0">
          <button 
            v-for="chip in suggestionChips" 
            :key="chip"
            @click="sendMessage(chip)"
            class="px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-800/30 transition-colors"
          >
            {{ chip }}
          </button>
        </div>

        <!-- Chat messages -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar" ref="chatContainer">
          <div 
            v-for="(msg, idx) in messages" 
            :key="idx" 
            class="flex"
            :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Bot avatar -->
            <div v-if="msg.sender === 'bot'" class="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-md">
              <i class="fa-solid fa-robot text-white text-[10px]"></i>
            </div>
            
            <div class="flex flex-col gap-1" :class="msg.sender === 'user' ? 'items-end' : 'items-start'">
              <div 
                class="max-w-[260px] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                :class="msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700'"
              >
                {{ msg.text }}
              </div>
              <!-- Speak button for bot messages -->
              <button 
                v-if="msg.sender === 'bot'" 
                @click="speak(msg.text)"
                class="flex items-center gap-1 text-[10px] text-gray-400 hover:text-teal-500 transition-colors px-1"
              >
                <i class="fa-solid fa-volume-low"></i> Dengarkan
              </button>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="flex justify-start">
            <div class="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mr-2 mt-1 shrink-0">
              <i class="fa-solid fa-robot text-white text-[10px]"></i>
            </div>
            <div class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <form @submit.prevent="handleSubmit" class="flex gap-2 items-center">
            <!-- Microphone button -->
            <button 
              type="button"
              @click="toggleSpeechInput"
              class="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
              :class="isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-gray-400 hover:text-teal-500'"
              title="Bicara ke asisten"
            >
              <i :class="isListening ? 'fa-solid fa-microphone-slash' : 'fa-solid fa-microphone'" class="text-sm"></i>
            </button>
            
            <input 
              v-model="inputText" 
              type="text" 
              :placeholder="isListening ? 'Sedang mendengarkan...' : 'Tanya tentang wisata Sumut...'" 
              class="flex-1 bg-slate-100 dark:bg-slate-800 text-sm border border-transparent focus:border-teal-400 dark:focus:border-teal-600 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:text-white placeholder-gray-400 transition-all"
              :disabled="isLoading"
            >
            <button 
              type="submit"
              class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 shrink-0"
              :disabled="isLoading || !inputText.trim()"
            >
              <i class="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </form>
          <p class="text-center text-[10px] text-gray-400 mt-2">Smart Wisata AI — Pariwisata Sumatera Utara</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const isOpen = ref(false);
const isVoiceEnabled = ref(true);
const isListening = ref(false);
const inputText = ref('');
const isLoading = ref(false);
const unreadCount = ref(0);
const chatContainer = ref(null);

const messages = ref([
  { 
    sender: 'bot', 
    text: 'Halo! Saya Asisten Smart Wisata Sumut. Saya siap membantu Anda menemukan destinasi wisata terbaik di Sumatera Utara. Apa yang ingin Anda ketahui?' 
  }
]);

const suggestionChips = [
  '🏔️ Danau Toba', '🍽️ Kuliner Medan', '🏖️ Pantai', '🌿 Wisata Alam',
  '🏛️ Wisata Sejarah', '⭐ Rekomendasi', '🚌 Transportasi'
];

// Speech Synthesis (TTS)
let synth = null;
let voices = [];

onMounted(() => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    synth = window.speechSynthesis;
    const loadVoices = () => {
      voices = synth.getVoices();
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }
});

onBeforeUnmount(() => {
  if (synth) synth.cancel();
  if (recognition) { try { recognition.stop(); } catch(e) {} }
});

const speak = (text) => {
  if (!synth) return;
  synth.cancel();
  
  // Clean markdown-like formatting from text for speech
  const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '').replace(/\n/g, '. ').replace(/[#🏔️🍽️🏖️🌿🏛️⭐🚌🕌🎡🛍️🏙️🏝️🏄💡📍📝⏰✈️🚗🚢🥦🛒🌡️]/g, '');
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  
  // Find best Indonesian voice
  const idVoice = voices.find(v => v.lang === 'id-ID') 
    || voices.find(v => v.lang.startsWith('id'))
    || voices.find(v => v.lang.startsWith('ms'));
  if (idVoice) utterance.voice = idVoice;
  
  if (isVoiceEnabled.value) {
    synth.speak(utterance);
  }
};

const toggleVoice = () => {
  isVoiceEnabled.value = !isVoiceEnabled.value;
  if (!isVoiceEnabled.value && synth) synth.cancel();
};

// Speech Recognition (STT)
let recognition = null;
const SpeechRecognition = typeof window !== 'undefined' 
  ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
  : null;

const toggleSpeechInput = () => {
  if (!SpeechRecognition) {
    alert('Browser Anda tidak mendukung pengenalan suara. Coba gunakan Google Chrome.');
    return;
  }
  
  if (isListening.value) {
    recognition?.stop();
    isListening.value = false;
    return;
  }
  
  recognition = new SpeechRecognition();
  recognition.lang = 'id-ID';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onstart = () => { isListening.value = true; };
  recognition.onend = () => { isListening.value = false; };
  recognition.onerror = () => { isListening.value = false; };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    handleSubmit();
  };
  
  recognition.start();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const handleSubmit = () => {
  const text = typeof inputText.value === 'string' ? inputText.value.trim() : (inputText.value || '').trim();
  if (!text || isLoading.value) return;
  sendMessage(text);
};

const sendMessage = async (text) => {
  const msgText = (text || '').replace(/^[🏔️🍽️🏖️🌿🏛️⭐🚌🕌🎡🛍️🏙️🏝️]\s*/u, '').trim();
  if (!msgText) return;
  
  messages.value.push({ sender: 'user', text: msgText });
  inputText.value = '';
  await scrollToBottom();
  isLoading.value = true;
  
  try {
    const response = await fetch(`${BASE_URL}/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msgText })
    });
    
    const data = await response.json();
    
    // Typing delay for realism
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
    
    const botReply = data.reply || 'Maaf, ada gangguan. Coba lagi ya!';
    messages.value.push({ sender: 'bot', text: botReply });
    isLoading.value = false;
    
    await scrollToBottom();
    
    // Auto-speak if voice is enabled
    if (isVoiceEnabled.value) speak(botReply);
    
    // Badge if chat is closed
    if (!isOpen.value) unreadCount.value++;
    
  } catch (err) {
    await new Promise(resolve => setTimeout(resolve, 500));
    messages.value.push({ sender: 'bot', text: 'Maaf, saya sedang mengalami gangguan koneksi. Pastikan server berjalan dan coba lagi.' });
    isLoading.value = false;
    await scrollToBottom();
  }
};

const clearChat = () => {
  if (synth) synth.cancel();
  messages.value = [{ sender: 'bot', text: 'Chat telah dibersihkan. Ada yang bisa saya bantu?' }];
};

// Reset unread when opening
const originalIsOpen = isOpen;
import { watch } from 'vue';
watch(isOpen, (val) => { if (val) unreadCount.value = 0; });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.6); }
</style>
