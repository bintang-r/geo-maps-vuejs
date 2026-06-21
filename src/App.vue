<template>
  <div class="min-h-screen bg-slate-900 text-slate-900 dark:text-gray-100 transition-colors duration-300">
    <ToastNotification />
    <router-view></router-view>
  </div>
</template>

<script setup>
import ToastNotification from './components/ToastNotification.vue'
</script>

<style>
/* Global resets if needed */
</style>
