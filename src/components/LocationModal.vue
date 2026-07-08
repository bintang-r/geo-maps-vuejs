<template>
  <div class="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-emerald-500 to-teal-600">
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-map-location-dot"></i>
          {{ isEditing ? 'Edit Lokasi Wisata' : 'Tambah Lokasi Wisata' }}
        </h3>
        <button @click="$emit('close')" class="text-white/70 hover:text-white transition-colors">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
      
      <form @submit.prevent="saveData" class="p-6 flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Nama Tempat Wisata</label>
          <input v-model="form.name" required type="text" placeholder="mis. Danau Toba" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Latitude</label>
            <input v-model.number="form.lat" required type="number" step="any" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Longitude</label>
            <input v-model.number="form.lng" required type="number" step="any" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Kategori Wisata</label>
          <select v-model="form.category" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
            <option value="Kuliner">🍽️ Kuliner</option>
            <option value="Religi">🕌 Religi</option>
            <option value="Sejarah">🏛️ Sejarah</option>
            <option value="Pantai">🏖️ Pantai</option>
            <option value="Pusat Perbelanjaan">🛍️ Pusat Perbelanjaan</option>
            <option value="Hiburan">🎡 Hiburan</option>
            <option value="Alam">🌿 Alam</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Alamat</label>
          <input v-model="form.address" type="text" placeholder="Alamat lengkap" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Kecamatan</label>
            <input v-model="form.district" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Kab/Kota</label>
            <input v-model="form.city" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
          </div>
        </div>

        <div class="mt-2 flex justify-end gap-3">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Batal</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex items-center gap-2">
            <i class="fa-solid fa-floppy-disk"></i> Simpan
          </button>
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
    category: 'Alam',
    address: '',
    district: '',
    city: 'Medan',
    province: 'Sumatera Utara',
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
