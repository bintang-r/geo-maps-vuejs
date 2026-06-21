<template>
  <div class="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 p-8 lg:p-12 transition-colors duration-300">
    <div class="w-full">
      
      <div class="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 class="text-3xl font-bold text-teal-600 dark:text-teal-400">Admin Dashboard</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Sistem Informasi Geografis Pemetaan</p>
        </div>
        <button @click="router.push('/')" class="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
          Kembali ke Peta Utama
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center text-2xl shadow-inner">
                <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold">Total Titik Lokasi</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats.locations }}</p>
            </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 flex items-center justify-center text-2xl shadow-inner">
                <i class="fa-solid fa-tags"></i>
            </div>
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold">Total Kategori</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats.categories }}</p>
            </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center text-2xl shadow-inner">
                <i class="fa-solid fa-map"></i>
            </div>
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold">Kecamatan</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats.districts }}</p>
            </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center text-2xl shadow-inner">
                <i class="fa-solid fa-earth-asia"></i>
            </div>
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold">Provinsi</p>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats.provinces }}</p>
            </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 class="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">Manajemen Data</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Manage Locations -->
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between group hover:scale-105 transition-transform cursor-pointer" @click="router.push('/location/add')">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-white/20 rounded-xl"><i class="fa-solid fa-map-location-dot text-2xl"></i></div>
                <i class="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
            <div>
                <h3 class="text-xl font-bold">Tambah Titik Lokasi</h3>
                <p class="text-blue-100 text-sm mt-1">Tambahkan marker lokasi baru ke dalam peta</p>
            </div>
        </div>

        <!-- Manage Categories -->
        <div class="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between group hover:scale-105 transition-transform cursor-pointer" @click="router.push('/categories')">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-white/20 rounded-xl"><i class="fa-solid fa-list-ul text-2xl"></i></div>
                <i class="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
            <div>
                <h3 class="text-xl font-bold">Manajemen Kategori</h3>
                <p class="text-teal-100 text-sm mt-1">Atur kategori, warna pin, dan icon</p>
            </div>
        </div>

        <!-- Manage Regions -->
        <div class="bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between group hover:scale-105 transition-transform cursor-pointer" @click="toast.info('Fitur Kelola Provinsi & Kecamatan sedang dikembangkan!')">
            <div class="flex justify-between items-start mb-4">
                <div class="p-3 bg-white/20 rounded-xl"><i class="fa-solid fa-layer-group text-2xl"></i></div>
                <i class="fa-solid fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
            <div>
                <h3 class="text-xl font-bold">Kelola Wilayah</h3>
                <p class="text-slate-300 text-sm mt-1">Tambah Provinsi & Kecamatan baru</p>
            </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const router = useRouter()
const toast = useToast()
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const stats = ref({
    locations: 0,
    categories: 0,
    districts: 0,
    provinces: 0
})

const fetchStats = async () => {
    try {
        const [locRes, catRes, distRes, provRes] = await Promise.all([
            fetch(`${baseUrl}/locations`),
            fetch(`${baseUrl}/categories`),
            fetch(`${baseUrl}/districts`),
            fetch(`${baseUrl}/provinces`)
        ])
        
        if (locRes.ok) stats.value.locations = (await locRes.json()).length
        if (catRes.ok) stats.value.categories = (await catRes.json()).length
        if (distRes.ok) stats.value.districts = (await distRes.json()).length
        if (provRes.ok) stats.value.provinces = (await provRes.json()).length
    } catch (e) {
        console.error("Failed to fetch stats", e)
    }
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
    fetchStats()
})
</script>
