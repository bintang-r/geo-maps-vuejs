<template>
  <div class="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="glass-dark rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700 overflow-hidden transform transition-all">
      <div class="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
        <h3 class="text-xl font-bold text-teal-400">{{ isEditing ? 'Edit Location' : 'Add New Location' }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="saveData" class="p-6 flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input v-model="form.name" required type="text" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
            <input v-model.number="form.lat" required type="number" step="any" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
            <input v-model.number="form.lng" required type="number" step="any" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select v-model="form.category" required class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
            <option value="Perguruan Tinggi Negeri">Perguruan Tinggi Negeri</option>
            <option value="Perguruan Tinggi Swasta">Perguruan Tinggi Swasta</option>
            <option value="Rumah Sakit">Rumah Sakit</option>
            <option value="Wisata">Wisata</option>
            <option value="Pusat Perbelanjaan">Pusat Perbelanjaan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Address</label>
          <input v-model="form.address" type="text" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">District</label>
            <input v-model="form.district" type="text" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">City</label>
            <input v-model="form.city" type="text" class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-3">
          <button type="button" @click="$emit('close')" class="px-5 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-400 hover:to-blue-400 shadow-lg shadow-teal-500/30 transition-all active:scale-95">Save Location</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['location', 'clickedCoords'])
const emit = defineEmits(['close', 'save'])

const isEditing = ref(false)
const form = ref({
    name: '',
    lat: '',
    lng: '',
    category: 'Perguruan Tinggi Swasta',
    address: '',
    district: '',
    city: 'Makassar',
    province: 'Sulawesi Selatan',
    country: 'Indonesia'
})

onMounted(() => {
    if (props.location) {
        isEditing.value = true
        form.value = { ...props.location }
    } else if (props.clickedCoords) {
        form.value.lat = props.clickedCoords.lat
        form.value.lng = props.clickedCoords.lng
    }
})

const saveData = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const url = isEditing.value 
        ? `${baseUrl}/locations/${form.value.id}`
        : `${baseUrl}/locations`
    
    const method = isEditing.value ? 'PUT' : 'POST'

    try {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        })
        emit('save')
    } catch (e) {
        console.error("Error saving data", e)
    }
}
</script>
