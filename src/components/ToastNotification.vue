<template>
  <div class="fixed top-0 left-0 w-full z-[9999] pointer-events-none flex flex-col items-center pt-6 px-4 gap-3">
    <transition-group 
      name="toast" 
      tag="div" 
      class="flex flex-col gap-3 w-full max-w-md items-center"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 w-full max-w-sm px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl border transition-all duration-300"
        :class="{
          'bg-teal-500/90 text-white border-teal-400/50 shadow-teal-500/20': toast.type === 'success',
          'bg-red-500/90 text-white border-red-400/50 shadow-red-500/20': toast.type === 'error',
          'bg-blue-500/90 text-white border-blue-400/50 shadow-blue-500/20': toast.type === 'info'
        }"
      >
        <!-- Icons -->
        <div class="shrink-0 flex items-center justify-center">
          <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check text-2xl"></i>
          <i v-if="toast.type === 'error'" class="fa-solid fa-circle-exclamation text-2xl"></i>
          <i v-if="toast.type === 'info'" class="fa-solid fa-circle-info text-2xl"></i>
        </div>
        
        <!-- Message -->
        <div class="flex-1 text-sm font-semibold leading-snug">
          {{ toast.message }}
        </div>
        
        <!-- Close Button -->
        <button 
          @click="removeToast(toast.id)"
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
/* Slide down from top and slide up to exit */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-50px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.9);
}
</style>
