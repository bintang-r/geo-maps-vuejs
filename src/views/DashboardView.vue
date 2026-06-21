<template>
  <div class="p-6 h-full flex flex-col gap-6 bg-slate-900 text-gray-100 overflow-y-auto">
    <!-- Top Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard title="Total Locations" :value="stats.totalPoints || 0" icon="map" />
      <StatsCard title="Active Categories" :value="stats.categories ? stats.categories.length : 0" icon="tag" />
      <StatsCard title="Top District" :value="topDistrict" icon="location" />
    </div>
    
    <!-- Main Content Area -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
      <!-- Map Column -->
      <div class="lg:col-span-2 glass-dark rounded-2xl overflow-hidden shadow-2xl relative border border-gray-700 flex flex-col">
        <div class="flex-1 w-full h-full min-h-[400px]">
            <MapViewer 
                :locations="locations" 
                @map-click="handleMapClick" 
                @edit-location="openModal" 
                @delete-location="deleteLocation" 
            />
        </div>
        
        <!-- Floating Add Button -->
        <button @click="openModal()" class="absolute bottom-6 right-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white p-4 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)] z-[400] transition-all hover:scale-105 active:scale-95 group">
          <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <!-- Analytics Column -->
      <div class="glass-dark rounded-2xl p-6 shadow-xl flex flex-col gap-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-teal-400 border-b border-gray-700 pb-2">Category Distribution</h3>
        <div class="flex-1 relative w-full h-64 flex justify-center items-center">
            <canvas id="categoryChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Modal -->
    <LocationModal 
      v-if="isModalOpen" 
      :location="selectedLocation" 
      :clicked-coords="clickedCoords"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import StatsCard from '../components/StatsCard.vue'
import MapViewer from '../components/MapViewer.vue'
import LocationModal from '../components/LocationModal.vue'

const locations = ref([])
const stats = ref({})
const isModalOpen = ref(false)
const selectedLocation = ref(null)
const clickedCoords = ref(null)
let chartInstance = null

const topDistrict = computed(() => {
    if (!stats.value.districts || stats.value.districts.length === 0) return 'N/A'
    const sorted = [...stats.value.districts].sort((a, b) => b.count - a.count)
    return sorted[0].district || 'N/A'
})

const fetchData = async () => {
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const [locRes, statsRes] = await Promise.all([
            fetch(`${baseUrl}/locations`),
            fetch(`${baseUrl}/stats`)
        ])
        locations.value = await locRes.json()
        stats.value = await statsRes.json()
        updateChart()
    } catch (e) {
        console.error("Error fetching data:", e)
    }
}

const updateChart = () => {
    if (!stats.value.categories) return
    
    nextTick(() => {
        const ctx = document.getElementById('categoryChart')
        if (!ctx) return

        if (chartInstance) {
            chartInstance.destroy()
        }

        const labels = stats.value.categories.map(c => c.category || 'Uncategorized')
        const data = stats.value.categories.map(c => c.count)

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#2dd4bf', // teal-400
                        '#3b82f6', // blue-500
                        '#8b5cf6', // violet-500
                        '#f59e0b', // amber-500
                        '#ec4899', // pink-500
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9ca3af', // gray-400
                            padding: 20,
                            font: { size: 12 }
                        }
                    }
                },
                cutout: '70%'
            }
        })
    })
}

const openModal = (location = null) => {
    selectedLocation.value = location
    clickedCoords.value = null
    isModalOpen.value = true
}

const handleMapClick = (coords) => {
    selectedLocation.value = null
    clickedCoords.value = coords
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    selectedLocation.value = null
    clickedCoords.value = null
}

const handleSave = () => {
    closeModal()
    fetchData()
}

const deleteLocation = async (id) => {
    if(!confirm("Are you sure you want to delete this location?")) return;
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        await fetch(`${baseUrl}/locations/${id}`, { method: 'DELETE' })
        fetchData()
    } catch (e) {
        console.error("Delete failed", e)
    }
}

onMounted(() => {
    fetchData()
})
</script>
