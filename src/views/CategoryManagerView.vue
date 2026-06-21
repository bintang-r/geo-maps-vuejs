<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-900 dark:text-gray-100 p-8 lg:p-12 transition-colors duration-300">
    <div class="w-full">
      
      <div class="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 class="text-3xl font-bold text-teal-600 dark:text-teal-400">Manajemen Kategori</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Tambah, edit, atau hapus kategori penanda peta.</p>
        </div>
        <button @click="goBack" class="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
          Kembali ke Dasbor Admin
        </button>
      </div>

      <div class="grid md:grid-cols-4 gap-8">
        
        <!-- Category Form -->
        <div class="md:col-span-1 bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6">
          <h2 class="text-xl font-bold mb-4 border-b border-white/10 pb-3 text-white">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h2>
          <form @submit.prevent="saveCategory" class="flex flex-col gap-5">
            
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nama</label>
              <input v-model="form.name" type="text" required class="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner" placeholder="mis. Tempat Ibadah">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Warna (Hex)</label>
              <div class="flex gap-3">
                <input v-model="form.color" type="color" class="w-12 h-12 rounded-xl cursor-pointer border-2 border-white/10 bg-transparent p-1">
                <input v-model="form.color" type="text" required class="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 shadow-inner font-mono">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Pilih Ikon</label>
              <div class="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-2 border border-white/10 rounded-xl bg-slate-950/50 shadow-inner">
                <button 
                  type="button" 
                  v-for="icon in popularIcons" 
                  :key="icon"
                  @click="form.icon_name = icon"
                  :class="['w-10 h-10 flex items-center justify-center rounded-lg transition-all', form.icon_name === icon ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)] scale-110' : 'text-gray-400 hover:bg-white/10 hover:text-white']"
                >
                  <i :class="icon + ' text-lg'"></i>
                </button>
              </div>
              <p class="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Atau masukkan kelas manual:</p>
              <input v-model="form.icon_name" type="text" required class="w-full mt-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm font-mono shadow-inner" placeholder="fa-solid fa-hospital">
            </div>

            <div class="mt-2 pt-4 border-t border-white/10 flex gap-3">
              <button v-if="isEditing" type="button" @click="resetForm" class="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" class="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold py-3 rounded-xl shadow-[0_4px_20px_rgba(20,184,166,0.4)] transition-all transform hover:-translate-y-0.5">
                {{ isEditing ? 'Simpan Perubahan' : 'Simpan' }}
              </button>
            </div>
          </form>

          <!-- Marker Preview -->
          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Pratinjau Pin Peta Langsung</h3>
            <div class="flex justify-center items-center h-28 bg-gray-100 dark:bg-gray-900 rounded-xl relative overflow-hidden">
                <!-- A faint map grid background to make it look like it's on a map -->
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#9ca3af 1px, transparent 1px); background-size: 16px 16px;"></div>
                
                <!-- The Pin -->
                <div class="relative w-8 h-10 flex justify-center drop-shadow-md transition-all z-10" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                    <svg class="absolute w-8 h-10" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24c0-8.837-7.163-16-16-16z" :fill="form.color"/>
                    </svg>
                    <div class="absolute top-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center p-1">
                        <div class="bg-white w-full h-full rounded-full flex items-center justify-center">
                             <i v-if="form.icon_name" :class="form.icon_name" :style="{ color: form.color }" class="text-[10px]"></i>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <!-- Categories List -->
        <div class="md:col-span-3">
          <div class="bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-gray-400">
                  <th class="p-5 font-bold w-24 text-center">Ikon</th>
                  <th class="p-5 font-bold">Nama</th>
                  <th class="p-5 font-bold">Warna</th>
                  <th class="p-5 font-bold w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in categories" :key="cat.id" class="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td class="p-5 flex justify-center items-center">
                    <div class="w-12 h-12 rounded-2xl flex justify-center items-center text-white shadow-lg transform group-hover:scale-110 transition-transform" :style="{ backgroundColor: cat.color, boxShadow: `0 4px 15px ${cat.color}60` }">
                        <i :class="cat.icon_name" class="text-xl text-white"></i>
                    </div>
                  </td>
                  <td class="p-5 font-bold text-lg text-white">{{ cat.name }}</td>
                  <td class="p-5">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full border-2 border-white/20 shadow-inner" :style="{ backgroundColor: cat.color }"></div>
                        <span class="font-mono text-sm text-gray-300 bg-black/30 px-2 py-1 rounded-lg">{{ cat.color.toUpperCase() }}</span>
                    </div>
                  </td>
                  <td class="p-5 text-center whitespace-nowrap">
                    <button @click="editCategory(cat)" class="p-2 text-teal-500 dark:text-teal-400 hover:text-white hover:bg-teal-500 rounded-xl transition-all shadow-sm" title="Edit">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button @click="deleteCategory(cat.id)" class="p-2 text-red-500 dark:text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all ml-2 shadow-sm" title="Delete">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="categories.length === 0">
                    <td colspan="4" class="p-8 text-center text-gray-500">No categories found.</td>
                </tr>
              </tbody>
            </table>
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

const categories = ref([])
const isEditing = ref(false)
const form = ref({
    id: null,
    name: '',
    color: '#3b82f6',
    icon_name: 'fa-solid fa-location-dot'
})

const popularIcons = [
    'fa-solid fa-location-dot', 'fa-solid fa-mosque', 'fa-solid fa-church', 'fa-solid fa-school', 
    'fa-solid fa-graduation-cap', 'fa-solid fa-hospital', 'fa-solid fa-stethoscope', 'fa-solid fa-store',
    'fa-solid fa-cart-shopping', 'fa-solid fa-utensils', 'fa-solid fa-mug-hot', 'fa-solid fa-tree',
    'fa-solid fa-mountain', 'fa-solid fa-water', 'fa-solid fa-monument', 'fa-solid fa-gas-pump',
    'fa-solid fa-car', 'fa-solid fa-bus', 'fa-solid fa-plane', 'fa-solid fa-bed',
    'fa-solid fa-building', 'fa-solid fa-house', 'fa-solid fa-landmark', 'fa-solid fa-camera'
]

const goBack = () => router.push('/admin')

const fetchCategories = async () => {
    try {
        const res = await fetch(`${baseUrl}/categories`)
        categories.value = await res.json()
    } catch (e) {
        console.error("Failed to fetch categories", e)
    }
}

const saveCategory = async () => {
    try {
        const method = isEditing.value ? 'PUT' : 'POST'
        const url = isEditing.value ? `${baseUrl}/categories/${form.value.id}` : `${baseUrl}/categories`
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        })

        if (res.ok) {
            toast.success(isEditing.value ? "Kategori berhasil diperbarui!" : "Kategori baru berhasil ditambahkan!")
            resetForm()
            fetchCategories()
        } else {
            toast.error("Gagal menyimpan kategori")
        }
    } catch(e) {
        toast.error("Terjadi kesalahan jaringan")
    }
}

const editCategory = (cat) => {
    isEditing.value = true
    form.value = { ...cat }
    // Migrate old SVG data if needed by replacing it
    if(form.value.icon_name && form.value.icon_name.includes('<path')) {
        form.value.icon_name = 'fa-solid fa-location-dot'
    }
}

const deleteCategory = async (id) => {
    if(!confirm("Yakin ingin menghapus kategori ini? Semua lokasi dengan kategori ini mungkin kehilangan ikonnya.")) return;
    
    try {
        const res = await fetch(`${baseUrl}/categories/${id}`, { method: 'DELETE' })
        if (res.ok) {
            toast.success("Kategori berhasil dihapus")
            fetchCategories()
        } else {
            toast.error("Gagal menghapus kategori")
        }
    } catch(e) {
        toast.error("Terjadi kesalahan jaringan")
    }
}

const resetForm = () => {
    isEditing.value = false
    form.value = { id: null, name: '', color: '#3b82f6', icon_name: 'fa-solid fa-location-dot' }
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
    fetchCategories()
})
</script>
