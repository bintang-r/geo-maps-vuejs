<template>
  <div id="map" class="w-full h-full z-10"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'

const props = defineProps(['locations'])
const emit = defineEmits(['map-click', 'edit-location', 'delete-location'])

let map = null;
let markersLayer = null;

onMounted(() => {
    map = L.map('map').setView([-5.1476, 119.4327], 12); // Default center Makassar

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    map.on('click', (e) => {
        emit('map-click', { lat: e.latlng.lat, lng: e.latlng.lng })
    })

    renderMarkers()
})

watch(() => props.locations, () => {
    renderMarkers()
}, { deep: true })

const getCategoryColor = (category) => {
    switch(category) {
        case 'Perguruan Tinggi Negeri': return '#2dd4bf'; // teal
        case 'Perguruan Tinggi Swasta': return '#3b82f6'; // blue
        case 'Rumah Sakit': return '#f43f5e'; // rose
        case 'Wisata': return '#10b981'; // emerald
        case 'Pusat Perbelanjaan': return '#a855f7'; // purple
        default: return '#f59e0b'; // amber
    }
}

const renderMarkers = () => {
    if(!markersLayer) return;
    markersLayer.clearLayers();

    props.locations.forEach(loc => {
        const color = getCategoryColor(loc.category);
        
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(markersLayer);
        
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <div class="p-2 min-w-[200px]">
                <h3 class="font-bold text-lg text-gray-800 mb-1">${loc.name}</h3>
                <p class="text-sm text-gray-600 mb-1"><span class="font-semibold text-teal-600">${loc.category}</span></p>
                <p class="text-xs text-gray-500 mb-3">${loc.address || ''}</p>
                <div class="flex gap-2">
                    <button class="edit-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded">Edit</button>
                    <button class="del-btn bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded">Delete</button>
                </div>
            </div>
        `;

        popupContent.querySelector('.edit-btn').addEventListener('click', () => {
            emit('edit-location', loc);
        });
        popupContent.querySelector('.del-btn').addEventListener('click', () => {
            emit('delete-location', loc.id);
        });

        marker.bindPopup(popupContent);
    });
}
</script>

<style>
.leaflet-popup-content-wrapper {
    border-radius: 0.75rem;
    overflow: hidden;
    padding: 0;
}
.leaflet-popup-content {
    margin: 0;
}
.leaflet-container {
    background-color: #0f172a;
}
</style>
