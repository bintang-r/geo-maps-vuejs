<template>
  <div class="fixed bottom-6 right-6 z-50 font-sans">
    <!-- Chat Toggle Button -->
    <button @click="isOpen = !isOpen" class="w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
      <i :class="isOpen ? 'fa-solid fa-xmark text-2xl' : 'fa-solid fa-comment-dots text-2xl'"></i>
    </button>

    <!-- Chat Window -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-10 opacity-0">
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden" style="height: 500px;">
        
        <!-- Header -->
        <div class="bg-teal-500 p-4 text-white flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 class="font-bold">Asisten Wisata</h3>
              <p class="text-[10px] text-teal-100 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-400"></span> Online</p>
            </div>
          </div>
          <button @click="toggleVoice" :class="isVoiceEnabled ? 'text-white' : 'text-teal-200'" class="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Toggle Voice">
             <i :class="isVoiceEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"></i>
          </button>
        </div>

        <!-- Chat History -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-slate-50 dark:bg-slate-950" ref="chatContainer">
          <div v-for="(msg, index) in messages" :key="index" class="flex" :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                 :class="msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm'">
              {{ msg.text }}
            </div>
          </div>
          <div v-if="isLoading" class="flex justify-start">
             <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
             </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input v-model="inputText" type="text" placeholder="Tanya tentang wisata..." class="flex-1 bg-slate-100 dark:bg-slate-800 text-sm border-none rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500 dark:text-white" :disabled="isLoading">
            <button type="submit" class="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50" :disabled="isLoading || !inputText.trim()">
              <i class="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const isOpen = ref(false);
const isVoiceEnabled = ref(true);
const inputText = ref('');
const messages = ref([
  { sender: 'bot', text: 'Halo! Saya asisten wisata Anda. Ada yang bisa saya bantu?' }
]);
const isLoading = ref(false);
const chatContainer = ref(null);

const synth = window.speechSynthesis;
let voices = [];

onMounted(() => {
    // Load voices
    if(synth) {
        synth.onvoiceschanged = () => {
            voices = synth.getVoices();
        };
    }
});

const scrollToBottom = async () => {
    await nextTick();
    if(chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const speak = (text) => {
    if (!isVoiceEnabled.value || !synth) return;
    
    // Stop any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Indonesian
    
    // Try to find Indonesian female voice
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if(idVoice) utterance.voice = idVoice;
    
    utterance.rate = 1.0;
    synth.speak(utterance);
};

const toggleVoice = () => {
    isVoiceEnabled.value = !isVoiceEnabled.value;
    if(!isVoiceEnabled.value && synth) {
        synth.cancel();
    }
};

const sendMessage = async () => {
    const text = inputText.value.trim();
    if (!text) return;
    
    messages.value.push({ sender: 'user', text });
    inputText.value = '';
    scrollToBottom();
    isLoading.value = true;
    
    try {
        const response = await fetch('http://localhost:3000/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        
        // Simulate thinking delay
        setTimeout(() => {
            messages.value.push({ sender: 'bot', text: data.reply });
            isLoading.value = false;
            scrollToBottom();
            speak(data.reply);
        }, 600);
        
    } catch(err) {
        setTimeout(() => {
            messages.value.push({ sender: 'bot', text: 'Maaf, saya sedang mengalami gangguan koneksi.' });
            isLoading.value = false;
            scrollToBottom();
        }, 600);
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}
</style>
