<template>
  <div class="h-screen w-full bg-slate-100 flex overflow-hidden font-['Inter',sans-serif] text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors">
    
    <!-- Left Icon Rail -->
    <div class="w-20 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center py-6 shadow-2xl z-20 shrink-0 border-r border-white/10">
      <div class="mb-8 p-3 bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-2xl shadow-lg">
        <i class="fa-solid fa-map-location-dot text-2xl"></i>
      </div>
      
      <div class="flex flex-col gap-6 flex-1 w-full items-center">
        <button class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-inner relative group" title="Dashboard">
          <i class="fa-solid fa-house text-lg"></i>
          <div class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-teal-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button @click="selectedLocation ? router.push(`/location/add?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`) : router.push('/location/add')" class="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 group" title="Tambah Titik">
          <i class="fa-solid fa-plus text-lg"></i>
        </button>

        <button @click="router.push('/admin')" class="w-12 h-12 rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors group" title="Dasbor Admin">
          <i class="fa-solid fa-layer-group text-lg"></i>
        </button>

        <button @click="router.push('/categories')" class="w-12 h-12 rounded-2xl hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors group" title="Kategori">
          <i class="fa-solid fa-tags text-lg"></i>
        </button>
      </div>

      <div class="mt-auto">
        <button @click="toggleTheme" class="w-12 h-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-gray-700 text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors">
          <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>
      </div>
    </div>

    <!-- Secondary Sidebar (Location List) -->
    <div class="w-full max-w-[340px] md:max-w-[400px] bg-slate-900/80 backdrop-blur-xl flex flex-col h-full shadow-2xl z-10 shrink-0 border-r border-white/10 transition-transform duration-300" :class="{'translate-x-0': true}">
      <div class="p-6 pb-2">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold tracking-tight text-white">Smart Wisata</h1>
          <button class="w-8 h-8 rounded-full border border-white/20 flex justify-center items-center text-gray-400 hover:bg-white/10 transition-colors">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="relative mb-6">
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input v-model="searchQuery" type="text" placeholder="Cari lokasi..." class="w-full bg-slate-800/80 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner">
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto px-4 pb-6 space-y-4 custom-scrollbar py-5 relative">
        <div v-for="loc in filteredLocations" :key="loc.id" 
             @click="focusLocation(loc)"
             class="bg-slate-800/60 p-4 rounded-3xl cursor-pointer hover:bg-slate-700/80 hover:shadow-lg border border-white/5 transition-all duration-200 group"
             :class="selectedLocation?.id === loc.id ? 'ring-2 ring-teal-500 shadow-lg' : 'shadow-sm'">
          
          <div class="flex flex-col gap-2 mb-3 min-w-0">
            <div class="flex items-center justify-between">
                <!-- Category Tag (Pill) -->
                <span class="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider whitespace-normal leading-tight" 
                      :style="{ backgroundColor: getCategoryDetails(loc.category).color + '20', color: getCategoryDetails(loc.category).color }">
                  {{ loc.category }}
                </span>
                
                <!-- Rating -->
                <div class="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20" v-if="loc.rating > 0">
                   <i class="fa-solid fa-star text-amber-500 text-[8px]"></i>
                   <span class="text-[10px] font-bold text-amber-500">{{ Number(loc.rating).toFixed(1) }}</span>
                </div>
            </div>
            <h3 class="font-bold text-base leading-snug text-white group-hover:text-teal-400 transition-colors break-words">{{ loc.name }}</h3>
          </div>
          
          <div class="flex flex-col text-xs text-gray-400 font-medium bg-slate-900/60 p-3 rounded-xl gap-2 mt-1">
             <div class="flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-gray-500 w-3 text-center"></i>
                <span class="text-gray-300 truncate">{{ loc.address || loc.district || 'Alamat tidak tersedia' }}</span>
             </div>
             <div class="flex items-center gap-2">
                <i class="fa-solid fa-clock text-gray-500 w-3 text-center"></i>
                <span class="text-gray-400 truncate">{{ loc.operating_hours || 'Jam operasional tidak tersedia' }}</span>
             </div>
             <div v-if="loc.description" class="flex items-start gap-2 mt-1 border-t border-white/5 pt-2">
                <i class="fa-solid fa-align-left text-gray-500 w-3 text-center mt-0.5"></i>
                <span class="text-gray-400 line-clamp-2 text-[10px] leading-relaxed">{{ loc.description }}</span>
             </div>
          </div>
        </div>
        <div v-if="filteredLocations.length === 0" class="text-center text-gray-500 text-sm mt-10">
          Lokasi tidak ditemukan.
        </div>
      </div>

      <!-- Chatbot Widget Wrapper (Below Location List) -->
      <div class="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-xl shrink-0">
         <div class="flex items-center justify-between">
            <div class="pl-2">
              <h4 class="text-sm font-bold text-white mb-0.5">Asisten AI</h4>
              <p class="text-[10px] text-gray-400">Tanya seputar wisata</p>
            </div>
            <Chatbot />
         </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 relative h-full">
      
      <!-- Current Region Indicator over Map -->
      <div @click="isRegionModalOpen = true" class="absolute top-4 left-4 z-[400] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 group max-w-[240px]">
         <i class="fa-solid fa-map-location-dot text-teal-500 group-hover:scale-110 transition-transform shrink-0"></i>
         <span class="text-sm font-bold text-slate-700 dark:text-gray-200 truncate">
             {{ selectedProvince ? selectedProvince.name : 'Pilih Provinsi' }}{{ selectedRegency ? ' › ' + selectedRegency.name : '' }}
         </span>
         <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 ml-1 shrink-0"></i>
      </div>

      <MapViewer 
        :locations="filteredLocations" 
        :categories="categories"
        :focusedLocation="focusedLocation"
        :geoJsonData="regencyGeoJson"
        :geoJsonLevel="currentGeoJsonLevel"
        :showRegionButton="true"
        :showBuffer="isBufferModeActive && !!selectedLocation"
        :bufferCenter="selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : null"
        :bufferRadius="bufferRadius"
        :nearbyCampuses="nearbyCampuses"
        @open-region-modal="isRegionModalOpen = true"
        @map-click="handleMapClick"
        @edit-location="editLocation"
        @delete-location="deleteLocation"
        @area-selected="onDistrictSelected"
        @location-selected="onLocationSelected"
        @route-info="handleRouteInfo"
      />

      <!-- Floating Bottom Card (District Stats) -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-20 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform translate-y-20 opacity-0">
        <div v-if="selectedDistrict && districtStats" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 flex flex-col overflow-hidden border border-white/20 p-6">
            <div class="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
               <div>
                  <h2 class="text-2xl font-black text-white tracking-tight mb-1">Kec. {{ districtStats.name }}</h2>
                  <p class="text-sm font-medium text-teal-400 uppercase tracking-widest">Statistik Lokasi</p>
               </div>
               <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                  <span class="text-3xl font-black text-white">{{ districtStats.total }}</span>
               </div>
            </div>
            
            <div v-if="districtStats.total > 0" class="mb-2">
               <DistrictChart :stats="districtStats.categories" />
            </div>
            <div v-else class="text-center py-8 text-gray-400 font-medium border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
               <i class="fa-solid fa-map-location-dot text-3xl mb-3 opacity-50 block"></i>
               Belum ada data lokasi yang terdaftar di kecamatan ini.
            </div>

            <div class="flex gap-3 mt-6 pt-5 border-t border-white/10">
               <button @click="navigateToAddLocation()" class="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-[0_4px_20px_rgba(20,184,166,0.3)] hover:-translate-y-0.5">
                 <i class="fa-solid fa-plus mr-2"></i> Tambah Titik di Sini
               </button>
               <button @click="selectedDistrict = null" class="px-8 py-3.5 bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-600 transition-colors shadow-lg">
                 Tutup
               </button>
            </div>
        </div>
      </transition>

      <!-- Floating Right Panel (Details) -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-x-0 opacity-100" leave-to-class="transform translate-x-full opacity-0">
        <div v-if="selectedLocation && !selectedDistrict" class="absolute top-4 right-4 bottom-24 md:bottom-4 w-[360px] max-w-[90vw] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl z-20 flex flex-col overflow-hidden border border-white/50 dark:border-white/10">
          
          <!-- Image Section (Carousel) -->
          <div class="h-48 shrink-0 bg-white/40 dark:bg-slate-800/40 relative overflow-hidden group">
             <!-- Close Button -->
             <button @click="selectedLocation = null" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors">
                 <i class="fa-solid fa-xmark"></i>
             </button>
             <template v-if="selectedLocationImages.length > 0">
                 <img :src="selectedLocationImages[currentImageIndex]" class="w-full h-full object-cover transition-opacity duration-300" :key="currentImageIndex" />
                 
                 <!-- Carousel Controls -->
                 <div v-if="selectedLocationImages.length > 1" class="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button @click.stop="prevImage" class="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-colors">
                         <i class="fa-solid fa-chevron-left text-xs"></i>
                     </button>
                     <button @click.stop="nextImage" class="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-colors">
                         <i class="fa-solid fa-chevron-right text-xs"></i>
                     </button>
                 </div>
                 
                 <!-- Dots -->
                 <div v-if="selectedLocationImages.length > 1" class="absolute bottom-3 left-0 w-full flex justify-center gap-1.5">
                     <div v-for="(_, index) in selectedLocationImages" :key="index" 
                          class="w-1.5 h-1.5 rounded-full transition-all"
                          :class="index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'">
                     </div>
                 </div>
             </template>
             <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <i class="fa-solid fa-image text-4xl"></i>
             </div>
          </div>

          <!-- Content Section -->
          <div class="flex-1 p-5 flex flex-col overflow-y-auto custom-scrollbar">
            <div v-if="!isBufferModeActive" class="flex flex-col gap-4">
              <div>
                <div class="flex justify-between items-start mb-2 gap-2">
                  <h2 class="text-xl font-bold tracking-tight leading-tight">{{ selectedLocation.name }}</h2>
                </div>
                <div class="mb-3 flex items-center gap-3">
                  <span class="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider inline-block" 
                        :style="{ backgroundColor: getCategoryDetails(selectedLocation.category).color + '20', color: getCategoryDetails(selectedLocation.category).color }">
                    {{ selectedLocation.category }}
                  </span>
                  
                  <div class="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20" v-if="selectedLocation.rating">
                     <i class="fa-solid fa-star text-amber-500 text-[10px]"></i>
                     <span class="text-xs font-bold text-amber-600 dark:text-amber-400">{{ Number(selectedLocation.rating).toFixed(1) }}</span>
                  </div>
                  <div class="flex items-center gap-1 bg-slate-500/10 px-2 py-1 rounded-lg border border-slate-500/20" v-else>
                     <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Belum ada rating</span>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mb-4 line-clamp-3">{{ selectedLocation.description || 'Tidak ada deskripsi.' }}</p>
                
                <div class="space-y-3 mb-4 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-2xl border border-white/40 dark:border-white/5">
                  <div class="flex items-start gap-2">
                    <i class="fa-solid fa-map-location-dot text-gray-400 mt-0.5 w-4 text-center text-xs"></i>
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Alamat</p>
                      <p class="text-xs font-medium text-slate-700 dark:text-gray-200" :title="selectedLocation.address">{{ selectedLocation.address || '-' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <i class="fa-solid fa-building text-gray-400 mt-0.5 w-4 text-center text-xs"></i>
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Kecamatan</p>
                      <p class="text-xs font-medium text-slate-700 dark:text-gray-200">{{ selectedLocation.district || '-' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2">
                    <i class="fa-solid fa-clock text-gray-400 mt-0.5 w-4 text-center text-xs"></i>
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Jam Operasional</p>
                      <p class="text-xs font-medium text-slate-700 dark:text-gray-200">{{ selectedLocation.operating_hours || '-' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Route Info Block -->
                <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
                    <div v-if="routeInfo" class="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 mb-4 shadow-inner">
                        <div class="flex-1 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <i class="fa-solid fa-route"></i>
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Jarak</p>
                                <p class="text-sm font-black text-slate-800 dark:text-gray-100">{{ routeInfo.distance }}</p>
                            </div>
                        </div>
                        <div class="w-px bg-blue-200 dark:bg-slate-700"></div>
                        <div class="flex-1 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <i class="fa-solid fa-clock"></i>
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Estimasi Waktu</p>
                                <p class="text-sm font-black text-slate-800 dark:text-gray-100">{{ routeInfo.duration }}</p>
                            </div>
                        </div>
                    </div>
                </transition>
              </div>
              
              <!-- Ulasan & Komentar -->
              <div class="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10">
                 <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
                     <i class="fa-solid fa-comments text-teal-500"></i> Ulasan Pengunjung
                 </h3>
                 
                 <!-- Komentar Form -->
                 <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
                     <div class="flex items-center gap-1 mb-2">
                         <span class="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Beri Nilai:</span>
                         <button v-for="star in 5" :key="star" @click="newComment.rating = star" class="text-lg focus:outline-none hover:scale-110 transition-transform">
                             <i class="fa-solid fa-star" :class="star <= newComment.rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'"></i>
                         </button>
                     </div>
                     <input v-model="newComment.user_name" type="text" placeholder="Nama Anda" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs mb-2 focus:ring-1 focus:ring-teal-500 focus:outline-none">
                     <textarea v-model="newComment.text" placeholder="Tulis pengalaman Anda..." rows="2" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs mb-2 custom-scrollbar focus:ring-1 focus:ring-teal-500 focus:outline-none"></textarea>
                     <button @click="submitComment" :disabled="isSubmittingComment || !newComment.user_name || !newComment.text" class="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors">
                         {{ isSubmittingComment ? 'Mengirim...' : 'Kirim Ulasan' }}
                     </button>
                 </div>

                 <!-- List Komentar -->
                 <div class="space-y-3">
                     <div v-for="comment in locationComments" :key="comment.id" class="bg-white/50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                         <div class="flex justify-between items-start mb-1">
                             <div class="font-bold text-xs text-slate-700 dark:text-slate-200">{{ comment.user_name }}</div>
                             <div class="flex gap-0.5">
                                 <i v-for="s in 5" :key="s" class="fa-solid fa-star text-[8px]" :class="s <= comment.rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'"></i>
                             </div>
                         </div>
                         <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ comment.text }}</p>
                     </div>
                     <div v-if="locationComments.length === 0" class="text-center text-xs text-gray-500 py-2">
                         Jadilah yang pertama memberikan ulasan!
                     </div>
                 </div>
              </div>

              <div class="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 shrink-0 pb-1">
                 <button @click="router.push(`/location/edit/${selectedLocation.id}`)" class="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-gray-100 transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap">
                   <i class="fa-solid fa-pen-to-square text-xs"></i> Edit
                 </button>
                 <button @click="deleteLocation(selectedLocation.id)" class="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap border border-red-200 dark:border-red-900/50">
                   <i class="fa-solid fa-trash text-xs"></i> Hapus
                 </button>
                 <button @click="isBufferModeActive = true" class="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-xl shadow-md shadow-sky-500/20 animate-pulse hover:animate-none">
                   <i class="fa-solid fa-circle-dot text-xs"></i>
                 </button>
              </div>
            </div>

            <!-- Buffer Analysis View -->
            <div v-else class="flex-1 flex flex-col justify-between min-h-[300px]">
              <div>
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <i class="fa-solid fa-circle-dot text-sky-500 animate-pulse"></i>
                      Wisata Terdekat
                    </h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Menampilkan destinasi wisata terdekat dari <span class="font-semibold text-slate-700 dark:text-gray-200">{{ selectedLocation.name }}</span>
                    </p>
                  </div>
                  <span class="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    Mode Buffer
                  </span>
                </div>

                <!-- Radius Slider Control -->
                <div class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 shadow-sm">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Radius Jangkauan</span>
                    <span class="text-sm font-black text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg">
                      {{ (bufferRadius / 1000).toFixed(1) }} km ({{ bufferRadius }} meter)
                    </span>
                  </div>
                  <input 
                    v-model.number="bufferRadius" 
                    type="range" 
                    min="500" 
                    max="10000" 
                    step="500" 
                    class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none"
                  >
                  <div class="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 px-0.5">
                    <span>500 m</span>
                    <span>2.5 km</span>
                    <span>5 km</span>
                    <span>7.5 km</span>
                    <span>10 km</span>
                  </div>
                </div>

                <!-- Nearest Campuses List -->
                <div>
                  <div class="flex justify-between items-center mb-2 px-1">
                    <span class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Wisata Terdekat ({{ nearbyLocations.length }})</span>
                  </div>
                  
                  <div class="max-h-[140px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    <div 
                      v-for="wisata in nearbyLocations" 
                      :key="wisata.id"
                      @click="focusLocation(wisata)"
                      class="flex items-center justify-between p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-sm transition-all group"
                    >
                      <div class="flex items-center gap-3 min-w-0 flex-1">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                             :style="{ backgroundColor: getCategoryDetails(wisata.category).color }">
                          <i :class="getCategoryDetails(wisata.category).icon_name || 'fa-solid fa-map-location-dot'" class="text-xs"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                          <h4 class="font-bold text-sm text-slate-800 dark:text-gray-200 truncate group-hover:text-sky-500 transition-colors">
                            {{ wisata.name }}
                          </h4>
                          <p class="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                            {{ wisata.address || wisata.district || 'Alamat tidak tersedia' }}
                          </p>
                        </div>
                      </div>
                      <div class="text-right shrink-0 pl-3">
                        <span class="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg">
                          {{ wisata.distance > 1000 ? (wisata.distance / 1000).toFixed(2) + ' km' : Math.round(wisata.distance) + ' m' }}
                        </span>
                      </div>
                    </div>

                    <div v-if="nearbyLocations.length === 0" class="text-center py-6 text-xs text-gray-400 dark:text-gray-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                      <i class="fa-solid fa-map-location-dot text-lg mb-1.5 opacity-50 block"></i>
                      Tidak ada destinasi wisata lain dalam radius ini.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Bar (Buffer Mode) -->
              <div class="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10">
                <button @click="isBufferModeActive = false" class="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-gray-100 transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <i class="fa-solid fa-arrow-left text-xs"></i> Kembali
                </button>
                <button @click="selectedLocation = null" class="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap ml-auto">
                  Tutup
                </button>
              </div>
            </div>
          </div>

        </div>
      </transition>
    </div>

    <!-- Region Selection Modal -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isRegionModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <div class="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-slate-800 dark:text-white">Pilih Wilayah</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Provinsi dipilih → tampil batas Kab/Kota. Kab/Kota dipilih → tampil detail kecamatan.
              </p>
            </div>
            <button @click="isRegionModalOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          <div class="p-6 space-y-5">
            <!-- Province (read-only display, ganti via button) -->
            <div class="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
              <div class="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-map text-white text-sm"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] text-teal-500 font-bold uppercase tracking-wider">Provinsi</p>
                <p class="text-sm font-bold text-slate-800 dark:text-white truncate">{{ selectedProvince?.name || '-' }}</p>
              </div>
              <button @click="isRegionModalOpen = false; showProvincePicker = true; selectedProvince = null; selectedRegency = null; regencyGeoJson = null; regenciesList = []" 
                      class="px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors whitespace-nowrap">
                Ganti
              </button>
            </div>

            <!-- Regency -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kabupaten / Kota
                <span class="text-xs font-normal text-gray-400 ml-1">(opsional — untuk detail kecamatan)</span>
              </label>
              <div class="relative">
                 <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                 <input type="text" v-model="regencySearch" placeholder="Cari Kabupaten/Kota..." :disabled="!selectedProvince" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2 disabled:opacity-50 text-slate-800 dark:text-white">
              </div>
              <div class="max-h-48 overflow-y-auto rounded-xl border border-gray-100 dark:border-slate-700 custom-scrollbar bg-slate-50 dark:bg-slate-900/30" :class="{'opacity-50 pointer-events-none': !selectedProvince}">
                 <div @click="selectRegency(null)" class="px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center justify-between" :class="!selectedRegency ? 'bg-teal-500 text-white font-bold dark:bg-teal-600' : 'text-slate-700 dark:text-gray-300 italic'">
                     <span>Semua Kab/Kota (batas provinsi)</span>
                     <i v-if="!selectedRegency" class="fa-solid fa-check"></i>
                 </div>
                 <div v-for="reg in filteredRegenciesList" :key="reg.id" 
                      @click="selectRegency(reg)"
                      class="px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center justify-between"
                      :class="selectedRegency?.id === reg.id ? 'bg-teal-500 text-white font-bold dark:bg-teal-600' : 'text-slate-700 dark:text-gray-300'">
                   <span>{{ reg.name }}</span>
                   <i v-if="selectedRegency?.id === reg.id" class="fa-solid fa-check"></i>
                 </div>
              </div>
            </div>
          </div>
          <div class="p-5 border-t border-gray-100 dark:border-slate-700 flex justify-end">
             <button @click="isRegionModalOpen = false" class="px-6 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg">
               Selesai
             </button>
          </div>
        </div>
      </div>
    </transition>


      <!-- Province Picker Splash Screen -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showProvincePicker" class="absolute inset-0 z-[600] flex items-center justify-center bg-gradient-to-br from-slate-900/95 to-teal-900/80 backdrop-blur-xl">
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-slate-700">
            <div class="p-8 text-center bg-gradient-to-br from-emerald-500 to-teal-600">
              <div class="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i class="fa-solid fa-map-location-dot text-4xl text-white"></i>
              </div>
              <h2 class="text-2xl font-black text-white mb-1">Smart Wisata Sumut</h2>
              <p class="text-teal-100 text-sm">Pilih provinsi untuk mulai menjelajah destinasi wisata</p>
            </div>
            <div class="p-6">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pilih Provinsi</label>
              <div class="relative mb-3">
                <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" v-model="provinceSearch" placeholder="Cari provinsi..." class="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-white" />
              </div>
              <div class="max-h-56 overflow-y-auto rounded-xl border border-gray-100 dark:border-slate-700 custom-scrollbar">
                <div v-if="filteredProvincesList.length === 0" class="text-center py-6 text-sm text-gray-400">Provinsi tidak ditemukan</div>
                <div v-for="prov in filteredProvincesList" :key="prov.id"
                     @click="selectProvinceFromPicker(prov)"
                     class="px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors flex items-center gap-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
                  <div class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-map text-teal-600 dark:text-teal-400 text-xs"></i>
                  </div>
                  <span class="font-medium text-slate-700 dark:text-gray-200">{{ prov.name }}</span>
                  <i class="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import MapViewer from '../components/MapViewer.vue'
import DistrictChart from '../components/DistrictChart.vue'
import Chatbot from '../components/Chatbot.vue'

const router = useRouter()
const toast = useToast()
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const hostUrl = baseUrl.replace('/api', '')

const locations = ref([])
const categories = ref([])
const selectedLocation = ref(null)
const focusedLocation = ref(null)
const selectedDistrict = ref(null)
const districtStats = ref(null)
const routeInfo = ref(null)
const searchQuery = ref('')
const isDark = ref(false)
const currentImageIndex = ref(0)

const locationComments = ref([])
const newComment = ref({ user_name: '', text: '', rating: 5 })
const isSubmittingComment = ref(false)

const provincesList = ref([])
const regenciesList = ref([])
const selectedProvince = ref(null)
const selectedRegency = ref(null)
const regencyGeoJson = ref(null)

const isRegionModalOpen = ref(false)
const provinceSearch = ref('')
const regencySearch = ref('')
const showProvincePicker = ref(true) // Show on first load

const isBufferModeActive = ref(false)
const bufferRadius = ref(2000) // Default 2 km (2000m)

const currentGeoJsonLevel = computed(() => {
    return selectedRegency.value ? 'regency' : 'province';
});

const filteredProvincesList = computed(() => {
    if (!provinceSearch.value) return provincesList.value;
    const q = provinceSearch.value.toLowerCase();
    return provincesList.value.filter(p => p.name.toLowerCase().includes(q));
});

const filteredRegenciesList = computed(() => {
    if (!regencySearch.value) return regenciesList.value;
    const q = regencySearch.value.toLowerCase();
    return regenciesList.value.filter(r => r.name.toLowerCase().includes(q));
});

const selectProvince = (prov) => {
    selectedProvince.value = prov;
    onProvinceChange();
}

// Called from the splash screen picker
const selectProvinceFromPicker = async (prov) => {
    selectedProvince.value = prov;
    showProvincePicker.value = false;
    localStorage.setItem('savedProvince', prov.name);
    await onProvinceChange();
}

const selectRegency = (reg) => {
    selectedRegency.value = reg;
    onRegencyChange();
}

const getCategoryDetails = (categoryName) => {
    if (categories.value.length > 0) {
        const cat = categories.value.find(c => c.name === categoryName);
        if (cat) return cat;
    }
    return { color: '#64748b', icon_name: 'fa-solid fa-location-dot' };
}

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

const fetchData = async () => {
    try {
        const [locRes, catRes, provRes] = await Promise.all([
            fetch(`${baseUrl}/locations`),
            fetch(`${baseUrl}/categories`),
            fetch(`${baseUrl}/provinces`)
        ])
        
        if(locRes.ok) locations.value = await locRes.json()
        if(catRes.ok) categories.value = await catRes.json()
        if(provRes.ok) provincesList.value = await provRes.json()
    } catch (e) {
        console.error("Failed to fetch data", e)
    }
}

// Lightweight: hanya muat batas Kab/Kota (tidak load kecamatan)
// Cukup request 1 endpoint province boundary atau gabung batas kab
const loadRegencyBoundariesOnly = async (province) => {
    if (!province) return null;
    try {
        // Try dedicated province-level boundary (semua kab outline dalam 1 file)
        const res = await fetch(`${baseUrl}/provinces/${province.id}/geojson`);
        if (res.ok) {
            const geo = await res.json();
            if (geo && geo.features && geo.features.length > 0) return geo;
        }
    } catch (e) { /* ignore */ }

    try {
        // Fallback: gabung dari individual regencies tapi hanya ambil outline (simplified)
        const regRes = await fetch(`${baseUrl}/regencies?province_id=${province.id}`);
        if (!regRes.ok) return null;
        const regencies = await regRes.json();
        if (regencies.length === 0) return null;

        // Load max 5 sekaligus untuk tidak terlalu berat
        const allFeatures = [];
        const BATCH = 5;
        for (let i = 0; i < regencies.length; i += BATCH) {
            const batch = regencies.slice(i, i + BATCH);
            const results = await Promise.all(batch.map(async (reg) => {
                try {
                    const r = await fetch(`${baseUrl}/regencies/${reg.id}/geojson`);
                    if (r.ok) return await r.json();
                } catch(e) {}
                return null;
            }));
            results.forEach(geo => {
                if (geo && geo.features) allFeatures.push(...geo.features);
            });
        }
        if (allFeatures.length > 0) return { type: 'FeatureCollection', features: allFeatures };
    } catch (e) {
        console.error('Failed to load regency boundaries', e);
    }
    return null;
}

const onProvinceChange = async (isUserAction = true) => {
    selectedRegency.value = null;
    regencyGeoJson.value = null;
    regenciesList.value = [];
    selectedDistrict.value = null;
    
    if (!selectedProvince.value) return;
    
    // Save to localStorage
    localStorage.setItem('savedProvince', selectedProvince.value.name);
    if (isUserAction) localStorage.removeItem('savedRegency');
    
    try {
        const res = await fetch(`${baseUrl}/regencies?province_id=${selectedProvince.value.id}`);
        if (res.ok) regenciesList.value = await res.json();
    } catch(e) { console.error('Failed to fetch regencies', e); }

    // Province level: hanya muat batas Kab/Kota (ringan)
    regencyGeoJson.value = await loadRegencyBoundariesOnly(selectedProvince.value);
}

const onRegencyChange = async () => {
    selectedDistrict.value = null;
    if (!selectedRegency.value) {
        localStorage.removeItem('savedRegency');
        // Kembali ke batas Kab/Kota saja
        if (selectedProvince.value) {
            regencyGeoJson.value = await loadRegencyBoundariesOnly(selectedProvince.value);
        } else {
            regencyGeoJson.value = null;
        }
        return;
    }
    
    localStorage.setItem('savedRegency', selectedRegency.value.name);
    regencyGeoJson.value = null;
    try {
        // Kab/Kota dipilih → baru load detail GeoJSON kecamatan
        const res = await fetch(`${baseUrl}/regencies/${selectedRegency.value.id}/geojson`);
        if (res.ok) regencyGeoJson.value = await res.json();
    } catch (e) { console.error('Failed to fetch regency detail geojson', e); }
}

const filteredLocations = computed(() => {
    let result = locations.value;
    
    if (selectedProvince.value) {
        result = result.filter(loc => loc.province === selectedProvince.value.name);
    }
    
    if (selectedRegency.value) {
        result = result.filter(loc => loc.city === selectedRegency.value.name);
    }

    if (!searchQuery.value) return result;
    const query = searchQuery.value.toLowerCase();
    return result.filter(loc => 
        loc.name.toLowerCase().includes(query) || 
        loc.category.toLowerCase().includes(query) ||
        (loc.address && loc.address.toLowerCase().includes(query))
    );
})

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // distance in meters
}

const isWisata = (category) => {
    if (!category) return false;
    const cats = ['kuliner', 'pantai', 'alam', 'sejarah', 'religi', 'hiburan', 'pusat perbelanjaan'];
    return cats.some(c => category.toLowerCase().includes(c));
}

const nearbyLocations = computed(() => {
    if (!selectedLocation.value) return [];
    const centerLat = selectedLocation.value.lat;
    const centerLng = selectedLocation.value.lng;
    
    return locations.value
        .filter(loc => loc.id !== selectedLocation.value.id)
        .map(loc => {
            const dist = calculateDistance(centerLat, centerLng, loc.lat, loc.lng);
            return { ...loc, distance: dist };
        })
        .filter(loc => loc.distance <= bufferRadius.value)
        .sort((a, b) => a.distance - b.distance);
})

// Keep nearbyCampuses as alias so MapViewer prop still works
const nearbyCampuses = nearbyLocations;

const fetchComments = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/locations/${id}/comments`);
        if (res.ok) {
            locationComments.value = await res.json();
        }
    } catch(e) {
        console.error("Failed to fetch comments", e);
    }
}

const submitComment = async () => {
    if (!newComment.value.user_name || !newComment.value.text || !selectedLocation.value) return;
    isSubmittingComment.value = true;
    try {
        const res = await fetch(`${baseUrl}/locations/${selectedLocation.value.id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment.value)
        });
        if (res.ok) {
            const added = await res.json();
            locationComments.value.unshift(added);
            newComment.value = { user_name: '', text: '', rating: 5 };
            // Update location list to get new average rating
            fetchData();
        }
    } catch(e) { console.error(e); }
    isSubmittingComment.value = false;
}

const onLocationSelected = (loc) => {
    selectedLocation.value = loc;
    focusedLocation.value = loc;
    currentImageIndex.value = 0; // reset carousel
    selectedDistrict.value = null; // hide district card if open
    routeInfo.value = null; // Clear previous route info
    isBufferModeActive.value = false; // Reset buffer mode
    fetchComments(loc.id);
};

const handleRouteInfo = (info) => {
    routeInfo.value = info;
};

const onDistrictSelected = (district) => {
    // Support both old string format and new {name, lat, lng} object format
    const districtName = typeof district === 'string' ? district : district.name;
    const districtLat = typeof district === 'object' ? district.lat : null;
    const districtLng = typeof district === 'object' ? district.lng : null;

    selectedLocation.value = null; // hide location card
    selectedDistrict.value = districtName;
    
    // Calculate stats
    const locsInDistrict = locations.value.filter(loc => 
       loc.district && loc.district.toLowerCase() === districtName.toLowerCase()
    );
    
    const total = locsInDistrict.length;
    
    // Group by category
    const categoryCounts = {};
    locsInDistrict.forEach(loc => {
        categoryCounts[loc.category] = (categoryCounts[loc.category] || 0) + 1;
    });
    
    districtStats.value = {
        name: districtName,
        lat: districtLat,
        lng: districtLng,
        total: total,
        categories: Object.keys(categoryCounts).map(cat => ({
            name: cat,
            count: categoryCounts[cat],
            color: getCategoryDetails(cat).color,
            icon: getCategoryDetails(cat).icon_name
        }))
    };
};

const focusLocation = (loc) => {
    focusedLocation.value = { ...loc, _timestamp: Date.now() };
    onLocationSelected(loc);
}

const buildAddQuery = (extras = {}) => {
    const params = new URLSearchParams();
    if (selectedProvince.value) params.set('province', selectedProvince.value.name);
    if (selectedRegency.value) params.set('regency', selectedRegency.value.name);
    Object.entries(extras).forEach(([k, v]) => { if (v !== null && v !== undefined) params.set(k, v); });
    return params.toString();
};

const navigateToAddLocation = () => {
    const query = buildAddQuery({
        district: districtStats.value?.name || null,
        lat: districtStats.value?.lat || null,
        lng: districtStats.value?.lng || null,
    });
    router.push('/location/add?' + query);
};

const handleMapClick = (coords) => {
    selectedLocation.value = null;
    selectedDistrict.value = null;
    routeInfo.value = null;
    isBufferModeActive.value = false; // Reset buffer mode
    if (confirm('Tambahkan titik baru di koordinat ini?')) {
        const query = buildAddQuery({ lat: coords.lat, lng: coords.lng });
        router.push('/location/add?' + query);
    }
}

const deleteLocation = async (id) => {
    if(confirm('Apakah Anda yakin ingin menghapus lokasi ini? Data tidak dapat dikembalikan.')) {
        try {
            const res = await fetch(`${baseUrl}/locations/${id}`, {
                method: 'DELETE'
            });
            if(res.ok) {
                toast.success('Lokasi berhasil dihapus!');
                selectedLocation.value = null;
                fetchData();
            } else {
                toast.error('Gagal menghapus lokasi dari server.');
            }
        } catch(err) {
            toast.error('Terjadi kesalahan jaringan.');
        }
    }
}

const selectedLocationImages = computed(() => {
    const rawImages = selectedLocation.value?.image || selectedLocation.value?.images;
    if (!selectedLocation.value || !rawImages) return [];
    try {
        let images = typeof rawImages === 'string' 
            ? JSON.parse(rawImages) 
            : rawImages;
        if (images && images.length > 0) {
            return images.map(img => img.startsWith('http') ? img : `${hostUrl}${img}`);
        }
    } catch(e) {}
    return [];
})

const prevImage = () => {
    if(selectedLocationImages.value.length === 0) return;
    currentImageIndex.value = currentImageIndex.value === 0 
        ? selectedLocationImages.value.length - 1 
        : currentImageIndex.value - 1;
}

const nextImage = () => {
    if(selectedLocationImages.value.length === 0) return;
    currentImageIndex.value = currentImageIndex.value === selectedLocationImages.value.length - 1 
        ? 0 
        : currentImageIndex.value + 1;
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
    }
    fetchData().then(() => {
        // Cek apakah ada provinsi tersimpan dari sesi sebelumnya
        const savedProvName = localStorage.getItem('savedProvince');
        if (savedProvName && provincesList.value.length > 0) {
            const savedProv = provincesList.value.find(p => p.name.toLowerCase() === savedProvName.toLowerCase());
            if (savedProv) {
                // Pulihkan sesi sebelumnya — tidak tampilkan picker
                showProvincePicker.value = false;
                selectedProvince.value = savedProv;
                onProvinceChange(false).then(() => {
                    const savedRegName = localStorage.getItem('savedRegency');
                    if (savedRegName) {
                        const savedReg = regenciesList.value.find(r => r.name.toLowerCase() === savedRegName.toLowerCase());
                        if (savedReg) {
                            selectedRegency.value = savedReg;
                            onRegencyChange();
                        }
                    }
                });
            } else {
                // Provinsi tersimpan tidak ditemukan, tampilkan picker
                showProvincePicker.value = true;
            }
        } else {
            // Belum pernah pilih provinsi, tampilkan picker
            showProvincePicker.value = true;
        }
    })
})
</script>

<style>
/* Custom Scrollbar for sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}
</style>
