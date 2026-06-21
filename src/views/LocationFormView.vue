<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 transition-colors duration-300">
    
    <!-- Left Side Form -->
    <div class="w-96 md:w-1/3 h-full bg-white dark:bg-gray-900 z-20 flex flex-col shadow-2xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto custom-scrollbar">
      
      <div class="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 mb-6 pb-4 z-10">
        <button @click="router.back()" class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 p-2.5 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 class="text-2xl font-bold text-teal-600 dark:text-teal-400">{{ isEdit ? 'Edit Lokasi' : 'Tambah Lokasi Baru' }}</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Geser penanda di peta untuk mengatur koordinat.</p>
        </div>
      </div>
      
      <form @submit.prevent="saveLocation" class="p-6 flex flex-col gap-5">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Lokasi</label>
          <input v-model="form.name" type="text" required class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors" placeholder="mis. Pantai Losari">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
          <select v-model="form.category" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors">
            <option v-for="cat in categoriesList" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Unggah Foto</label>
          <div class="w-full relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center cursor-pointer">
              <input type="file" multiple accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <svg class="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Klik atau seret gambar ke sini</p>
          </div>
          
          <!-- Image Previews -->
          <div v-if="previewImages.length > 0" class="mt-3 grid grid-cols-3 gap-2">
              <div v-for="(img, index) in previewImages" :key="index" class="relative group rounded-lg overflow-hidden h-20 border border-gray-200 dark:border-gray-700">
                  <img :src="img.url" class="w-full h-full object-cover" />
                  <button type="button" @click.stop="removeImage(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Jam Operasional</label>
          <input v-model="form.operating_hours" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="mis. 08:00 - 17:00">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
          <textarea v-model="form.description" rows="3" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="Deskripsi singkat tentang tempat ini..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
          <textarea v-model="form.address" rows="2" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="Alamat fisik lengkap"></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Provinsi</label>
          <select v-model="form.province" @change="onProvinceChange" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors">
            <option value="" disabled>Pilih Provinsi</option>
            <option v-for="prov in provincesList" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kabupaten/Kota</label>
          <select v-model="form.city" @change="onRegencyChange" :disabled="!form.province" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50">
            <option value="" disabled>Pilih Kabupaten/Kota</option>
            <option v-for="reg in regenciesList" :key="reg.id" :value="reg.name">{{ reg.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 mt-4">Kecamatan</label>
          <input v-model="form.district" @change="onDistrictManualChange" type="text" class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="mis. Tamalate">
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2"><i class="fa-solid fa-circle-info mr-1"></i>Otomatis terisi jika Anda menggeser pin ke dalam wilayah di peta.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Garis Lintang (Latitude)</label>
            <input :value="form.lat" type="text" readonly class="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 cursor-not-allowed">
            </div>
            <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Garis Bujur (Longitude)</label>
            <input :value="form.lng" type="text" readonly class="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 cursor-not-allowed">
            </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 mt-2">
            <button type="button" @click="goBack" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-slate-800 dark:text-white font-bold py-3 px-4 rounded-xl transition-colors">
                Batal
            </button>
            <button type="submit" :disabled="isUploading" class="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 flex justify-center items-center">
                <span v-if="isUploading">Mengunggah...</span>
                <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Simpan Lokasi' }}</span>
            </button>
        </div>
      </form>
    </div>

    <!-- Right Side Map -->
    <div class="flex-1 h-full relative z-0">
        <div id="form-map" class="w-full h-full"></div>
        
        <!-- Search Box over Map -->
        <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-md">
           <form @submit.prevent="searchLocation" class="relative">
              <input v-model="searchQueryMap" @input="handleSearchInput" type="text" placeholder="Cari jalan atau tempat (mis. Jl Goaria)..." class="w-full pl-12 pr-12 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium placeholder-gray-400">
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <button type="submit" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white w-8 h-8 rounded-xl transition-colors flex items-center justify-center shadow-md">
                 <i class="fa-solid fa-arrow-right text-sm"></i>
              </button>
           </form>
           
           <!-- Autocomplete Dropdown -->
           <div v-if="searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-[1001]">
              <ul>
                 <li v-for="(result, index) in searchResults" :key="index" @click="selectSearchResult(result)" class="px-4 py-3 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors last:border-b-0 flex items-start gap-3">
                     <i class="fa-solid fa-location-dot text-teal-500 mt-1"></i>
                     <div>
                         <p class="text-sm font-semibold text-slate-800 dark:text-gray-200 line-clamp-1">{{ result.name || result.display_name.split(',')[0] }}</p>
                         <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{{ result.display_name }}</p>
                     </div>
                 </li>
              </ul>
           </div>
           <div v-else-if="isSearching" class="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-4 text-center z-[1001]">
               <div class="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
           </div>
        </div>

        <!-- Current Region Indicator over Map -->
        <div @click="isRegionModalOpen = true" class="absolute bottom-8 right-4 z-[400] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 group">
           <i class="fa-solid fa-map-location-dot text-teal-500 group-hover:scale-110 transition-transform"></i>
           <span class="text-sm font-bold text-slate-700 dark:text-gray-200">
               {{ form.province || 'Pilih Provinsi' }}{{ form.city ? ' - ' + form.city : '' }}
           </span>
           <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 ml-1"></i>
        </div>

    </div>

    <!-- Region Selection Modal -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isRegionModalOpen" class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <div class="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Pilih Wilayah</h2>
            <button @click="isRegionModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Province -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Provinsi</label>
              <div class="relative">
                 <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                 <input type="text" v-model="provinceSearch" placeholder="Cari Provinsi..." class="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2 text-slate-800 dark:text-white">
              </div>
              <div class="max-h-40 overflow-y-auto rounded-xl border border-gray-100 dark:border-slate-700 custom-scrollbar bg-slate-50 dark:bg-slate-900/30">
                 <div v-for="prov in filteredProvincesList" :key="prov.id" 
                      @click="selectProvince(prov)"
                      class="px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center justify-between"
                      :class="form.province === prov.name ? 'bg-teal-500 text-white font-bold dark:bg-teal-600' : 'text-slate-700 dark:text-gray-300'">
                   <span>{{ prov.name }}</span>
                   <i v-if="form.province === prov.name" class="fa-solid fa-check"></i>
                 </div>
              </div>
            </div>

            <!-- Regency -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kabupaten / Kota</label>
              <div class="relative">
                 <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                 <input type="text" v-model="regencySearch" placeholder="Cari Kabupaten/Kota..." :disabled="!form.province" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2 disabled:opacity-50 text-slate-800 dark:text-white">
              </div>
              <div class="max-h-40 overflow-y-auto rounded-xl border border-gray-100 dark:border-slate-700 custom-scrollbar bg-slate-50 dark:bg-slate-900/30" :class="{'opacity-50 pointer-events-none': !form.province}">
                 <div v-for="reg in filteredRegenciesList" :key="reg.id" 
                      @click="selectRegency(reg)"
                      class="px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center justify-between"
                      :class="form.city === reg.name ? 'bg-teal-500 text-white font-bold dark:bg-teal-600' : 'text-slate-700 dark:text-gray-300'">
                   <span>{{ reg.name }}</span>
                   <i v-if="form.city === reg.name" class="fa-solid fa-check"></i>
                 </div>
              </div>
            </div>
          </div>
          <div class="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
             <button @click="isRegionModalOpen = false" class="px-6 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg">
               Selesai
             </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import L from 'leaflet'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = route.name === 'EditLocation'
const locationId = route.params.id

const form = ref({
    name: '',
    category: 'Wisata',
    images: [],
    operating_hours: '',
    description: '',
    address: '',
    lat: route.query.lat ? parseFloat(route.query.lat) : -0.7893,
    lng: route.query.lng ? parseFloat(route.query.lng) : 113.9213,
    district: route.query.district || '',
    city: '',
    province: '',
    country: 'Indonesia'
})

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const hostUrl = baseUrl.replace('/api', '');

const selectedFiles = ref([])
const previewImages = ref([])
const isUploading = ref(false)
const categoriesList = ref([])
const provincesList = ref([])
const regenciesList = ref([])

const searchQueryMap = ref('')
const searchResults = ref([])
const isSearching = ref(false)
let searchTimeout = null

// Region Modal State
const isRegionModalOpen = ref(false)
const provinceSearch = ref('')
const regencySearch = ref('')

const filteredProvincesList = computed(() => {
    if (!provinceSearch.value) return provincesList.value;
    return provincesList.value.filter(p => p.name.toLowerCase().includes(provinceSearch.value.toLowerCase()));
});

const filteredRegenciesList = computed(() => {
    if (!regencySearch.value) return regenciesList.value;
    return regenciesList.value.filter(r => r.name.toLowerCase().includes(regencySearch.value.toLowerCase()));
});

const selectProvince = (prov) => {
    form.value.province = prov.name;
    onProvinceChange();
}

const selectRegency = (reg) => {
    form.value.city = reg.name;
    onRegencyChange();
    isRegionModalOpen.value = false;
}

let map = null;
let marker = null;
let updateLocationAndDistrict = null;

const handleSearchInput = () => {
    if (!searchQueryMap.value.trim()) {
        searchResults.value = [];
        return;
    }
    
    clearTimeout(searchTimeout);
    isSearching.value = true;
    
    searchTimeout = setTimeout(async () => {
        try {
            // Remove hardcoded ", Makassar" as it often breaks OSM street-level searches if the region mapping differs
            const query = encodeURIComponent(searchQueryMap.value);
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=id`);
            const data = await res.json();
            searchResults.value = data || [];
        } catch(err) {
            console.error("Geocoding error", err);
        } finally {
            isSearching.value = false;
        }
    }, 500); // 500ms debounce
}

const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    map.setView([lat, lng], 17);
    marker.setLatLng([lat, lng]);
    updateLocationAndDistrict(lat, lng);
    
    // Clear search and results
    searchQueryMap.value = result.name || result.display_name.split(',')[0];
    searchResults.value = [];
    toast.success("Lokasi dipilih!");
}

const searchLocation = async () => {
    // If they hit enter, select the first result if available
    if (searchResults.value.length > 0) {
        selectSearchResult(searchResults.value[0]);
        return;
    }
    
    if(!searchQueryMap.value.trim()) return;
    try {
        isSearching.value = true;
        const query = encodeURIComponent(searchQueryMap.value);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=id`);
        const data = await res.json();
        
        if(data && data.length > 0) {
            selectSearchResult(data[0]);
        } else {
            toast.error("Lokasi tidak ditemukan. Coba kata kunci yang lebih spesifik.");
        }
    } catch(err) {
        toast.error("Terjadi kesalahan saat mencari lokasi.");
    } finally {
        isSearching.value = false;
    }
}

onMounted(async () => {
    // Determine Theme
    const savedTheme = localStorage.getItem('theme')
    let isDark = false;
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark = true;
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Fetch Categories and Provinces
    try {
        const [catRes, provRes] = await Promise.all([
            fetch(`${baseUrl}/categories`),
            fetch(`${baseUrl}/provinces`)
        ]);
        if (catRes.ok) {
            categoriesList.value = await catRes.json()
            if(!isEdit && categoriesList.value.length > 0) {
                form.value.category = categoriesList.value[0].name
            }
        }
        if (provRes.ok) {
            provincesList.value = await provRes.json();
            
            if (!isEdit) {
                const savedProv = localStorage.getItem('savedProvince');
                if (savedProv) {
                    form.value.province = savedProv;
                }
            }
            
            if (form.value.province && !route.query.lat) {
                // Only auto-load province/regency GeoJSON if NO explicit lat/lng is provided
                // (explicit lat/lng means user came from clicking a district on the map)
                await onProvinceChange(false);
                
                if (!isEdit) {
                    const savedRegency = localStorage.getItem('savedRegency');
                    if (savedRegency) {
                        form.value.city = savedRegency;
                        await onRegencyChange(false);
                    } else if (regenciesList.value.length > 0) {
                        // If current city is not in the province, pick the first one
                        const cityExists = regenciesList.value.find(r => r.name === form.value.city);
                        if (!cityExists) {
                            if (!route.query.district) {
                                form.value.city = regenciesList.value[0].name;
                                await onRegencyChange(false);
                            }
                        } else {
                            await onRegencyChange(false);
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.error("Failed to load initial data", e);
    }

    setTimeout(() => {
        initMap(isDark);
    }, 100);

    // Load data if editing
    if (isEdit && locationId) {
        try {
            const res = await fetch(`${baseUrl}/locations/${locationId}`)
            if (res.ok) {
                const data = await res.json()
                // Parse images JSON if present
                let rawImages = data.image || data.images;
                if (rawImages) {
                    try {
                        data.images = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
                    } catch(e) {
                        data.images = []
                    }
                } else {
                    data.images = []
                }
                
                form.value = { ...form.value, ...data }

                // Generate previews for existing images
                previewImages.value = form.value.images.map(img => ({
                    url: img.startsWith('http') ? img : `${hostUrl}${img}`,
                    isExisting: true,
                    path: img
                }))

                // Update map
                if(marker && map) {
                    marker.setLatLng([data.lat, data.lng])
                    map.setView([data.lat, data.lng], 15)
                }

                if (data.province) {
                    await onProvinceChange(false);
                    if (data.city) {
                        await onRegencyChange(false);
                    }
                }
            }
        } catch (e) {
            toast.error("Failed to load location data")
            console.error("Failed to load location", e)
        }
    }
})

const onProvinceChange = async (resetChild = true) => {
    if (resetChild === true || resetChild instanceof Event) {
        form.value.city = '';
        form.value.district = '';
        regenciesList.value = [];
        if (choroplethLayer) choroplethLayer.clearLayers();
    }
    
    const prov = provincesList.value.find(p => p.name === form.value.province);
    if (!prov) return;
    
    try {
        const res = await fetch(`${baseUrl}/regencies?province_id=${prov.id}`);
        if (res.ok) {
            regenciesList.value = await res.json();
        }
    } catch(e) {
        console.error("Failed to load regencies", e);
    }

    // Fetch province geojson and zoom to it
    try {
        const resGeo = await fetch(`${baseUrl}/provinces/${prov.id}/geojson`);
        if (resGeo.ok) {
            const provGeoData = await resGeo.json();
            const attemptDrawProv = () => {
                if (map && choroplethLayer) {
                    if (resetChild === true || resetChild instanceof Event || Object.keys(choroplethLayer._layers).length === 0) {
                        choroplethLayer.clearLayers();
                        choroplethLayer.addData(provGeoData);
                        geoJsonData = provGeoData;
                        if (Object.keys(choroplethLayer._layers).length > 0) {
                            let targetBounds = choroplethLayer.getBounds();
                            let maxZoom = 10;
                            if (form.value.district) {
                                choroplethLayer.eachLayer(layer => {
                                    const dName = layer.feature.properties.district || layer.feature.properties.kecamatan || layer.feature.properties.name || '';
                                    if (dName.toLowerCase() === form.value.district.toLowerCase()) {
                                        targetBounds = layer.getBounds();
                                        maxZoom = 14;
                                    }
                                });
                            }
                            map.fitBounds(targetBounds, { padding: [20, 20], maxZoom: maxZoom });
                            if (!isEdit && marker && !route.query.lat) {
                                const center = targetBounds.getCenter();
                                marker.setLatLng(center);
                                marker.setOpacity(1);
                                form.value.lat = center.lat;
                                form.value.lng = center.lng;
                                updateLocationAndDistrict(center.lat, center.lng);
                            }
                        }
                    }
                } else {
                    setTimeout(attemptDrawProv, 100);
                }
            };
            attemptDrawProv();
        }
    } catch(e) {
        console.error("Failed to load province geojson", e);
    }
}

const onRegencyChange = async (clearFields = true) => {
    if (typeof clearFields !== 'boolean') clearFields = true;
    if(clearFields) {
        form.value.district = '';
    }
    const reg = regenciesList.value.find(r => r.name === form.value.city);
    if (!reg) return;
    
    localStorage.setItem('savedProvince', form.value.province);
    localStorage.setItem('savedRegency', form.value.city);
    
    loadRegencyGeoJson(reg.id);
}

const onDistrictManualChange = () => {
    if (!geoJsonData || !map || !choroplethLayer || !form.value.district) return;
    
    let foundDistrictLayer = null;
    choroplethLayer.eachLayer(layer => {
        const dName = layer.feature.properties.district || layer.feature.properties.kecamatan || layer.feature.properties.name || '';
        if (dName.toLowerCase() === form.value.district.toLowerCase()) {
            foundDistrictLayer = layer;
        }
    });
    
    if (foundDistrictLayer) {
        const targetBounds = foundDistrictLayer.getBounds();
        map.fitBounds(targetBounds, { padding: [20, 20], maxZoom: 14 });
        if (!isEdit && marker) {
            const center = targetBounds.getCenter();
            marker.setLatLng(center);
            form.value.lat = center.lat;
            form.value.lng = center.lng;
        }
        updateChoroplethStyle();
    }
}

let initialLoadFinished = false;

const loadRegencyGeoJson = async (regencyId) => {
    try {
        console.log("Loading GeoJSON for regency:", regencyId);
        const res = await fetch(`${baseUrl}/regencies/${regencyId}/geojson`);
        if (res.ok) {
            const data = await res.json();
            geoJsonData = data;
            
            const attemptDraw = () => {
                console.log("attemptDraw called. map ready:", !!map, "choroplethLayer ready:", !!choroplethLayer);
                if (map && choroplethLayer) {
                    choroplethLayer.clearLayers();
                    choroplethLayer.addData(geoJsonData);
                    
                    const numLayers = Object.keys(choroplethLayer._layers).length;
                    console.log("Layers added:", numLayers);
                    
                    if (numLayers > 0) {
                        const regencyBounds = choroplethLayer.getBounds();
                        let targetBounds = regencyBounds;
                        let foundDistrictLayer = null;

                        // If a district is pre-filled, try to find its layer
                        if (form.value.district) {
                            console.log("Looking for district:", form.value.district);
                            choroplethLayer.eachLayer(layer => {
                                const dName = layer.feature.properties.district || layer.feature.properties.kecamatan || layer.feature.properties.name || '';
                                if (dName.toLowerCase() === form.value.district.toLowerCase()) {
                                    console.log("Found matching district layer:", dName);
                                    foundDistrictLayer = layer;
                                }
                            });
                            if (!foundDistrictLayer) {
                                console.log("Warning: District layer not found for", form.value.district);
                            }
                        }

                        if (foundDistrictLayer) {
                            targetBounds = foundDistrictLayer.getBounds();
                        }

                        console.log("Bounds:", targetBounds);
                        
                        if (!isEdit && route.query.lat && route.query.lng && !initialLoadFinished) {
                            console.log("Using route.query coordinates");
                            map.setView([form.value.lat, form.value.lng], 13);
                            initialLoadFinished = true;
                            if (marker) marker.setOpacity(1);
                        } else {
                            console.log("Fitting bounds to target");
                            map.fitBounds(targetBounds, { padding: [20, 20], maxZoom: 14 });
                            if (!isEdit && marker) {
                                const center = targetBounds.getCenter();
                                console.log("Moving marker to center:", center);
                                marker.setLatLng(center);
                                marker.setOpacity(1);
                                form.value.lat = center.lat;
                                form.value.lng = center.lng;
                            }
                        }
                        updateLocationAndDistrict(form.value.lat, form.value.lng);
                    } else {
                        console.error("GeoJSON data loaded but 0 layers created!");
                    }
                } else {
                    // map or choroplethLayer not ready yet, wait and try again
                    setTimeout(attemptDraw, 100);
                }
            };
            attemptDraw();
        } else {
            console.error("Failed to load GeoJSON:", res.status);
        }
    } catch (err) {
        console.error("Error loading GeoJSON", err);
    }
}

const initMap = async (isDark) => {
    map = L.map('form-map', {
        center: [form.value.lat, form.value.lng],
        zoom: 13,
        minZoom: 5,
        maxBounds: [
            [-11.0, 95.0],
            [6.0, 141.0]
        ]
    });
    
    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB', maxZoom: 19
    });

    const lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB', maxZoom: 19
    });

    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors', maxZoom: 19
    });

    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3']
    });

    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    const topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
        maxZoom: 17
    });

    const baseMaps = {
        "Light Theme": lightMap,
        "Dark Theme": darkMap,
        "Street Map (OSM)": streetMap,
        "Google Maps": googleStreets,
        "Google Satellite": googleHybrid,
        "Esri Satellite": satelliteMap,
        "Topo Map": topoMap
    };

    const savedLayer = localStorage.getItem('mapLayer');
    if (savedLayer && baseMaps[savedLayer]) {
        baseMaps[savedLayer].addTo(map);
    } else {
        // Set default map based on theme
        if (isDark) {
            darkMap.addTo(map);
        } else {
            lightMap.addTo(map);
        }
    }

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    map.on('baselayerchange', (e) => {
        localStorage.setItem('mapLayer', e.name);
    });

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#14b8a6; width:24px; height:24px; border-radius:50%; border:3px solid white; box-shadow: 0 0 15px rgba(20,184,166,0.6);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    marker = L.marker([form.value.lat, form.value.lng], { 
        icon: customIcon,
        draggable: true,
        opacity: 1
    }).addTo(map);

    updateMarkerIcon(); // Set initial icon based on category

    // PIP Algorithm
    const booleanPointInPolygon = (point, polygon) => {
        let x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i][0], yi = polygon[i][1];
            let xj = polygon[j][0], yj = polygon[j][1];
            let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    const getDistrictFromPoint = (lat, lng, geoData) => {
        if (!geoData || !geoData.features) return null;
        for (const feature of geoData.features) {
            if (feature.geometry.type === 'Polygon') {
                if (booleanPointInPolygon([lng, lat], feature.geometry.coordinates[0])) {
                    return feature.properties.district || feature.properties.kecamatan;
                }
            } else if (feature.geometry.type === 'MultiPolygon') {
                for (const polygon of feature.geometry.coordinates) {
                    if (booleanPointInPolygon([lng, lat], polygon[0])) {
                        return feature.properties.district || feature.properties.kecamatan;
                    }
                }
            }
        }
        return null;
    };

    let geoJsonData = null;

    // Add District Boundaries
    let choroplethLayer = null;
    
    const updateChoroplethStyle = () => {
        if(!choroplethLayer) return;
        choroplethLayer.eachLayer(layer => {
            const districtName = layer.feature.properties.district || layer.feature.properties.kecamatan || layer.feature.properties.name || '';
            const hasFocusedDistrict = !!form.value.district;
            const isSelected = hasFocusedDistrict && districtName.toLowerCase() === form.value.district.toLowerCase();
            const shouldShow = !hasFocusedDistrict || isSelected;

            layer.setStyle({
                fillColor: isSelected ? '#14b8a6' : (shouldShow ? '#64748b' : 'transparent'),
                weight: isSelected ? 3 : (shouldShow ? 1 : 0),
                opacity: shouldShow ? 1 : 0,
                color: isSelected ? '#0f766e' : (shouldShow ? '#94a3b8' : 'transparent'),
                dashArray: isSelected ? '' : '3',
                fillOpacity: isSelected ? 0.4 : (shouldShow ? 0.15 : 0)
            });
            if (isSelected && !L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
                if(marker) marker.bringToFront();
            }
        });
    };

    updateLocationAndDistrict = (lat, lng) => {
        form.value.lat = lat;
        form.value.lng = lng;
        const foundDistrict = getDistrictFromPoint(lat, lng, geoJsonData);
        if(foundDistrict) {
            form.value.district = foundDistrict;
        }
        updateChoroplethStyle();
    };

    // Create choropleth layer empty initially
    choroplethLayer = L.geoJSON(null, {
        style: {
            fillColor: '#64748b',
            weight: 1,
            opacity: 1,
            color: '#94a3b8',
            dashArray: '3',
            fillOpacity: 0.15
        },
        onEachFeature: (feature, layer) => {
            layer.bindTooltip(() => {
                const districtName = feature.properties.district || feature.properties.kecamatan || feature.properties.name || '-';
                const villageName = feature.properties.village || '-';
                return `<div class="text-sm font-bold">Kecamatan ${districtName}</div><div class="text-xs font-medium text-slate-600 dark:text-gray-300">Kelurahan ${villageName}</div>`;
            }, { sticky: true, className: 'glass-tooltip bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl px-3 py-2' });
            
            layer.on({
                mouseover: (e) => {
                    const targetLayer = e.target;
                    const targetCode = feature.properties.district_code || feature.properties.district;
                    
                    choroplethLayer.eachLayer((l) => {
                        if ((l.feature.properties.district_code || l.feature.properties.district) === targetCode) {
                            if (l === targetLayer) {
                                l.setStyle({ weight: 4, color: '#0ea5e9', dashArray: '', fillOpacity: 0.8 });
                            } else {
                                l.setStyle({ weight: 2, color: '#0f766e', dashArray: '', fillOpacity: 0.5 });
                            }
                        }
                    });
                    
                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        targetLayer.bringToFront();
                        if(marker) marker.bringToFront();
                    }
                },
                mouseout: (e) => {
                    updateChoroplethStyle();
                }
            });
        }
    }).addTo(map);
    
    // Auto load current regency if set (and no explicit lat/lng from route)
    if (form.value.city && regenciesList.value.length > 0 && !route.query.lat) {
        const reg = regenciesList.value.find(r => r.name === form.value.city);
        if (reg) {
            // attemptDraw is handled inside loadRegencyGeoJson
            loadRegencyGeoJson(reg.id);
        }
    }

    // If explicit lat/lng passed from dashboard (clicking district on map),
    // zoom directly to that location — this is the REAL fix so marker goes to Manado, not Kalimantan
    if (route.query.lat && route.query.lng) {
        const lat = parseFloat(route.query.lat);
        const lng = parseFloat(route.query.lng);
        map.setView([lat, lng], 14, { animate: false });
        marker.setLatLng([lat, lng]);
        marker.setOpacity(1);
        form.value.lat = lat;
        form.value.lng = lng;
    }
    
    marker.on('drag', (e) => {
        const position = marker.getLatLng();
        updateLocationAndDistrict(position.lat, position.lng);
    });

    map.on('click', (e) => {
        marker.setOpacity(1);
        marker.setLatLng(e.latlng);
        updateLocationAndDistrict(e.latlng.lat, e.latlng.lng);
    });

    watch(() => form.value.district, () => {
        updateChoroplethStyle();
    });

    map.invalidateSize();
}

const getCategoryDetails = (categoryName) => {
    if (!categoryName) return { color: '#64748b', icon_name: 'fa-solid fa-location-dot' };
    if (categoriesList.value && categoriesList.value.length > 0) {
        const cat = categoriesList.value.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (cat) return cat;
    }
    return { color: '#14b8a6', icon_name: 'fa-solid fa-location-dot' };
}

const updateMarkerIcon = () => {
    if(!marker) return;
    const details = getCategoryDetails(form.value.category);
    const color = details.color;
    const iconName = details.icon_name;

    const pinHtml = `
        <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: ${color};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            "></div>
            <i class="${iconName}" style="
                position: relative;
                color: white;
                font-size: 14px;
                z-index: 10;
                transform: translateY(-2px);
            "></i>
        </div>
    `;

    const icon = L.divIcon({
        className: 'custom-pin-marker',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    marker.setIcon(icon);
}

watch(() => form.value.category, () => {
    updateMarkerIcon();
});

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    files.forEach(file => {
        selectedFiles.value.push(file)
        
        // Create local preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImages.value.push({
                url: e.target.result,
                isExisting: false,
                file: file
            })
        }
        reader.readAsDataURL(file)
    })
    
    // Reset file input so same file can be selected again if needed
    event.target.value = ''
}

const removeImage = (index) => {
    const removed = previewImages.value.splice(index, 1)[0];
    
    if (removed.isExisting) {
        // Remove from form images
        form.value.images = form.value.images.filter(img => img !== removed.path)
    } else {
        // Remove from selected files
        const fileIndex = selectedFiles.value.findIndex(f => f === removed.file);
        if (fileIndex !== -1) {
            selectedFiles.value.splice(fileIndex, 1);
        }
    }
}

const goBack = () => {
    router.push('/')
}

const saveLocation = async () => {
    isUploading.value = true;

    try {
        // 1. Upload new files if any
        let newImageUrls = [];
        if (selectedFiles.value.length > 0) {
            const formData = new FormData();
            selectedFiles.value.forEach(file => {
                formData.append('images', file);
            });

            const uploadRes = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                newImageUrls = uploadData.urls;
            } else {
                throw new Error("File upload failed");
            }
        }

        // 2. Combine old images with new uploaded images
        const finalImages = [...form.value.images, ...newImageUrls];
        const payload = { ...form.value, images: finalImages };

        // 3. Save Location Data
        const url = isEdit ? `${baseUrl}/locations/${locationId}` : `${baseUrl}/locations`;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.success(isEdit ? "Location updated successfully!" : "Location added successfully!")
            router.push('/')
        } else {
            toast.error("Failed to save location data")
        }
    } catch (e) {
        toast.error("An error occurred while saving")
        console.error("Error saving", e)
    } finally {
        isUploading.value = false;
    }
}
</script>
