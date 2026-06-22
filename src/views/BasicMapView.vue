<template>
  <div class="h-screen w-full relative font-sans overflow-hidden">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[2000] flex flex-col items-center justify-center text-white">
      <i class="fa-solid fa-spinner animate-spin text-4xl text-sky-400 mb-4"></i>
      <p class="text-sm font-bold tracking-wide uppercase">Memuat Universitas di Jakarta...</p>
      <p class="text-xs text-slate-400 mt-1">Mengambil data spasial dari OpenStreetMap Overpass API...</p>
    </div>

    <!-- Map Container -->
    <div id="basic-map" class="w-full h-full z-0"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const isLoading = ref(true)
const campuses = ref([])

// Fallback list of 20 campuses if the API fails or times out
const fallbackCampuses = [
  { name: 'Universitas Indonesia (Salemba)', lat: -6.1949, lng: 106.8489 },
  { name: 'Universitas Negeri Jakarta (UNJ)', lat: -6.1947, lng: 106.8833 },
  { name: 'Universitas Trisakti', lat: -6.1672, lng: 106.7901 },
  { name: 'Universitas Tarumanagara (UNTAR)', lat: -6.1685, lng: 106.7876 },
  { name: 'Universitas Bina Nusantara (BINUS)', lat: -6.2241, lng: 106.7826 },
  { name: 'Universitas Katolik Atma Jaya', lat: -6.2189, lng: 106.8153 },
  { name: 'Universitas Mercu Buana', lat: -6.2081, lng: 106.7351 },
  { name: 'Universitas Muhammadiyah UHAMKA', lat: -6.2374, lng: 106.8587 },
  { name: 'Universitas Pancasila', lat: -6.3402, lng: 106.8327 },
  { name: 'Universitas Gunadarma', lat: -6.1774, lng: 106.8184 },
  { name: 'Universitas Nasional (UNAS)', lat: -6.2829, lng: 106.8378 },
  { name: 'Universitas Esa Unggul', lat: -6.1904, lng: 106.7762 },
  { name: 'Universitas Kristen Indonesia (UKI)', lat: -6.2572, lng: 106.8689 },
  { name: 'Universitas Jayabaya', lat: -6.1856, lng: 106.8791 },
  { name: 'Universitas Budi Luhur', lat: -6.2346, lng: 106.7458 },
  { name: 'Universitas Borobudur', lat: -6.2427, lng: 106.9038 },
  { name: 'Universitas Indraprasta PGRI', lat: -6.3031, lng: 106.8703 },
  { name: 'Universitas Pertamina', lat: -6.2238, lng: 106.7972 },
  { name: 'Universitas Bakrie', lat: -6.2198, lng: 106.8322 },
  { name: 'Universitas Paramadina', lat: -6.2435, lng: 106.8325 }
]

let map = null

const fetchJakartaUniversities = async () => {
  try {
    const query = `
      [out:json][timeout:20];
      area["ISO3166-2"="ID-JK"]->.searchArea;
      (
        node["amenity"="university"](area.searchArea);
        way["amenity"="university"](area.searchArea);
        relation["amenity"="university"](area.searchArea);
      );
      out center;
    `;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (!data.elements || data.elements.length === 0) {
      throw new Error('No elements found');
    }
    
    // Map response elements
    const list = data.elements
      .map(el => {
        const name = el.tags.name || el.tags['name:en'] || '';
        const lat = el.lat || (el.center && el.center.lat);
        const lng = el.lon || (el.center && el.center.lon);
        return { name, lat, lng };
      })
      .filter(c => c.lat && c.lng && c.name.trim().length > 3);
      
    // Deduplicate by name
    const uniqueMap = new Map();
    list.forEach(c => uniqueMap.set(c.name.toLowerCase(), c));
    return Array.from(uniqueMap.values());
  } catch (e) {
    console.warn("Overpass API error, using fallback data:", e);
    return fallbackCampuses;
  }
}

onMounted(async () => {
  // Initialize map centered in Jakarta
  map = L.map('basic-map', {
    center: [-6.2088, 106.8456],
    zoom: 12,
    zoomControl: false
  })

  L.control.zoom({ position: 'bottomleft' }).addTo(map)

  // Standard Street Map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)

  // Fetch campus data
  campuses.value = await fetchJakartaUniversities()
  isLoading.value = false

  // Render markers and permanent tooltips
  if (campuses.value.length > 0) {
    campuses.value.forEach(campus => {
      const marker = L.marker([campus.lat, campus.lng]).addTo(map)
      
      // Bind permanent tooltip representing the label
      marker.bindTooltip(campus.name, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'custom-permanent-label'
      })
    })

    // Fit bounds to show all universities
    const bounds = L.latLngBounds(campuses.value.map(c => [c.lat, c.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }
})
</script>

<style>
/* Custom styled permanent tooltip for campus labels */
.custom-permanent-label {
  background-color: rgba(15, 23, 42, 0.9) !important; /* Slate 900 */
  border: 1px solid rgba(56, 189, 248, 0.7) !important; /* Sky 400 */
  color: #f8fafc !important; /* Slate 50 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 700 !important;
  font-size: 9px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  padding: 3px 6px !important;
  white-space: nowrap;
}

/* Remove Leaflet tooltip arrows */
.custom-permanent-label::before {
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
}
</style>
