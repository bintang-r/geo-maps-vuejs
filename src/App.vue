<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Top header -->
      <header class="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 sm:px-6 glass-dark border-b border-gray-700">
        <div class="flex items-center">
          <button class="text-gray-400 hover:text-white md:hidden" @click="sidebarOpen = !sidebarOpen">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="ml-4 text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 hidden md:block">
            GeoMapping Pro
          </h1>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg">
            AD
          </div>
        </div>
      </header>

      <!-- Main view -->
      <main class="w-full h-full flex-grow">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'

const sidebarOpen = ref(false)
</script>
