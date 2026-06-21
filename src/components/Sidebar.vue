<template>
  <div class="flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 border-r border-gray-800 hidden md:flex z-40">
    <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-8">
      GeoGis
    </h2>
    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav>
        <router-link to="/" class="flex items-center px-4 py-3 text-gray-100 bg-gray-800 rounded-lg shadow-inner">
          <svg class="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="mx-4 font-medium">Dashboard</span>
        </router-link>
        
        <a href="#" class="flex items-center px-4 py-3 mt-4 text-gray-400 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span class="mx-4 font-medium">Map Layers</span>
        </a>

        <a href="#" class="flex items-center px-4 py-3 mt-4 text-gray-400 hover:bg-gray-800 hover:text-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span class="mx-4 font-medium">Settings</span>
        </a>
      </nav>
      
      <div class="mt-8">
        <div class="p-4 bg-gray-800 rounded-xl">
          <h3 class="text-sm font-semibold text-gray-300">Data Source</h3>
          <p class="mt-1 text-xs text-gray-500">Live API Connection Active</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
