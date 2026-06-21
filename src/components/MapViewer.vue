<template>
  <div class="relative w-full h-full">
    <div id="map" class="w-full h-full z-0"></div>
    
    <!-- GPS Button -->
    <button @click="getUserLocation" 
            class="absolute bottom-6 right-6 z-10 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-teal-500 transition-all group"
            :class="{'animate-pulse bg-teal-50 dark:bg-teal-900 text-teal-600': isLocating}">
      <i class="fa-solid fa-location-crosshairs text-2xl group-hover:scale-110 transition-transform"></i>
    </button>
    <!-- Region Select Button -->
    <button v-if="showRegionButton" @click="$emit('open-region-modal')" 
            class="absolute bottom-24 right-6 z-10 w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-teal-500 transition-all group">
      <i class="fa-solid fa-map-location-dot text-2xl group-hover:scale-110 transition-transform"></i>
    </button>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'

const props = defineProps(['locations', 'focusedLocation', 'categories', 'geoJsonData', 'showRegionButton'])
const emit = defineEmits(['map-click', 'edit-location', 'delete-location', 'district-selected', 'location-selected', 'route-info', 'open-region-modal'])

let map = null;
let markersLayer = null;
let choroplethLayer = null;

// Live Location & Routing State
let userMarker = null;
let userAccuracyCircle = null;
let routeLayer = null;
const userLocation = ref(null);
const isLocating = ref(false);

onMounted(() => {
    // Base Maps
    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    });

    const lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    });

    const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
    });

    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    const topoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: 'Map data &copy; Google',
        maxZoom: 20,
        subdomains: ['mt0','mt1','mt2','mt3']
    });

    const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        attribution: 'Map data &copy; Google',
        maxZoom: 20,
        subdomains: ['mt0','mt1','mt2','mt3']
    });

    map = L.map('map', {
        center: [-5.1476, 119.4327],
        zoom: 12,
        minZoom: 5,
        maxBounds: [
            [-11.0, 95.0],
            [6.0, 141.0]
        ],
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

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
        lightMap.addTo(map); // Default to Light Theme for modern look
    }

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    map.on('baselayerchange', (e) => {
        localStorage.setItem('mapLayer', e.name);
    });

    choroplethLayer = L.geoJSON(null, { 
        style: styleChoropleth,
        onEachFeature: (feature, layer) => {
            layer.bindTooltip(() => {
                const districtName = feature.properties.district || feature.properties.kecamatan || feature.properties.name || '-';
                const villageName = feature.properties.village || '-';
                const count = getDistrictCount(districtName);
                return `<div class="text-sm font-bold">Kecamatan ${districtName}</div><div class="text-xs font-medium text-slate-600 dark:text-gray-300">Kelurahan ${villageName}</div><div class="text-[10px] text-gray-500 mt-1">${count} Lokasi</div><div class="text-[10px] text-teal-600 mt-1">Klik untuk tambah lokasi di sini</div>`;
            }, { sticky: true, className: 'glass-tooltip bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl px-3 py-2' });
            
            // Hover events for highlight
            layer.on({
                mouseover: (e) => {
                    const targetLayer = e.target;
                    const targetCode = feature.properties.district_code || feature.properties.district;
                    
                    choroplethLayer.eachLayer((l) => {
                        if ((l.feature.properties.district_code || l.feature.properties.district) === targetCode) {
                            if (l === targetLayer) {
                                // Highlight specific kelurahan
                                l.setStyle({
                                    weight: 4,
                                    color: '#0ea5e9', // Sky blue border
                                    dashArray: '',
                                    fillOpacity: 0.8
                                });
                            } else {
                                // Highlight rest of kecamatan slightly
                                l.setStyle({
                                    weight: 2,
                                    color: '#0f766e',
                                    dashArray: '',
                                    fillOpacity: 0.5
                                });
                            }
                        }
                    });
                    
                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        targetLayer.bringToFront();
                    }
                },
                mouseout: (e) => {
                    const targetCode = feature.properties.district_code || feature.properties.district;
                    choroplethLayer.eachLayer((l) => {
                        if ((l.feature.properties.district_code || l.feature.properties.district) === targetCode) {
                            choroplethLayer.resetStyle(l);
                        }
                    });
                },
                click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    const districtName = feature.properties.district || feature.properties.kecamatan || feature.properties.name || '';
                    emit('district-selected', districtName);
                }
            });
        }
    }).addTo(map);

    // Watch for GeoJSON Data changes
    watch(() => props.geoJsonData, (newData) => {
        if (choroplethLayer && newData) {
            choroplethLayer.clearLayers();
            choroplethLayer.addData(newData);
            if (map && Object.keys(newData).length > 0) {
                try {
                    map.fitBounds(choroplethLayer.getBounds(), { padding: [20, 20], maxZoom: 14 });
                } catch(e) {}
            }
        }
    }, { immediate: true, deep: true });

    markersLayer = L.layerGroup().addTo(map);

    map.on('click', (e) => {
        emit('map-click', { lat: e.latlng.lat, lng: e.latlng.lng })
    })

    renderMarkers()
})

watch(() => props.locations, () => {
    renderMarkers();
    if(choroplethLayer) {
        choroplethLayer.eachLayer(layer => {
            layer.setStyle(styleChoropleth(layer.feature));
        });
    }
}, { deep: true })

watch(() => props.categories, () => {
    renderMarkers();
}, { deep: true })

watch(() => props.focusedLocation, (newVal) => {
    if (newVal && newVal.lat && newVal.lng && map) {
        map.setView([newVal.lat, newVal.lng], 15, { animate: true });
        
        // If user location is active, draw route
        if (userLocation.value) {
            calculateRoute(userLocation.value, newVal);
        } else {
            clearRoute();
            emit('route-info', null);
        }
    } else {
        clearRoute();
        emit('route-info', null);
    }
}, { deep: true })

const clearRoute = () => {
    if (routeLayer && map) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
}

const calculateRoute = async (start, end) => {
    try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
        const data = await res.json();
        
        if (data.code === 'Ok' && data.routes.length > 0) {
            const route = data.routes[0];
            
            clearRoute();
            
            // Draw polyline
            routeLayer = L.geoJSON(route.geometry, {
                style: {
                    color: '#0ea5e9', // Sky blue
                    weight: 6,
                    opacity: 0.8,
                    dashArray: '10, 10',
                    lineJoin: 'round'
                }
            }).addTo(map);

            // Fit bounds to show entire route
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50], maxZoom: 16 });

            // Format distance and time
            const distance = route.distance > 1000 
                ? (route.distance / 1000).toFixed(1) + ' km' 
                : Math.round(route.distance) + ' m';
                
            const minutes = Math.round(route.duration / 60);
            const duration = minutes > 60 
                ? `${Math.floor(minutes / 60)} jam ${minutes % 60} menit` 
                : `${minutes} menit`;

            emit('route-info', { distance, duration });
        }
    } catch (e) {
        console.error("OSRM Routing Error:", e);
    }
}

const getUserLocation = () => {
    if (!navigator.geolocation) {
        alert("Browser Anda tidak mendukung geolokasi.");
        return;
    }
    
    isLocating.value = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            userLocation.value = { lat, lng };
            
            if (userMarker) map.removeLayer(userMarker);
            if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);
            
            // Draw pulsing user marker (custom CSS)
            const userIcon = L.divIcon({
                className: 'custom-user-marker',
                html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            
            userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
            userMarker.bindTooltip("Lokasi Anda", { direction: 'top', offset: [0, -10] });
            
            userAccuracyCircle = L.circle([lat, lng], {
                radius: accuracy,
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 1
            }).addTo(map);
            
            map.setView([lat, lng], 15, { animate: true });
            isLocating.value = false;
            
            // If there is already a focused location, calculate route immediately
            if (props.focusedLocation && props.focusedLocation.lat) {
                calculateRoute(userLocation.value, props.focusedLocation);
            }
        },
        (error) => {
            isLocating.value = false;
            console.error("Geolocation Error:", error);
            if (error.code === 1) alert("Harap izinkan akses lokasi untuk menggunakan fitur ini.");
            else alert("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

const getDistrictCount = (districtName) => {
    if(!props.locations || !districtName) return 0;
    return props.locations.filter(l => l.district && l.district.toLowerCase() === districtName.toLowerCase()).length;
}

const styleChoropleth = (feature) => {
    const districtName = feature.properties.district || feature.properties.kecamatan || feature.properties.name;
    const count = getDistrictCount(districtName);
    const color = count > 0 ? '#14b8a6' : '#334155'; // teal vs slate
    const fillOpacity = count > 0 ? 0.2 + (count * 0.1) : 0.1;
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: '#475569',
        dashArray: '3',
        fillOpacity: Math.min(fillOpacity, 0.8)
    };
}

const getCategoryDetails = (categoryName) => {
    if (!categoryName) return { color: '#64748b', icon_name: 'fa-solid fa-location-dot' };
    if (props.categories && props.categories.length > 0) {
        const cat = props.categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (cat) return cat;
    }
    return { color: '#f59e0b', icon_name: 'fa-solid fa-location-dot' }; // Fallback amber
}

const renderMarkers = () => {
    if(!markersLayer) return;
    markersLayer.clearLayers();

    props.locations.forEach(loc => {
        const categoryDetails = getCategoryDetails(loc.category);
        const color = categoryDetails.color || '#f59e0b';
        const iconName = categoryDetails.icon_name || 'fa-solid fa-location-dot';
        
        // Pure CSS Teardrop Pin (Guarantees icon visibility without SVG overlap)
        const pinHtml = `
            <div class="relative w-10 h-[50px] flex justify-center group cursor-pointer transition-transform hover:scale-110 hover:-translate-y-1" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                <div style="
                    width: 40px;
                    height: 40px;
                    background-color: ${color};
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid white;
                    box-shadow: -2px 2px 6px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="${iconName}" style="color: white; font-size: 16px; transform: rotate(45deg); font-weight: 900; text-shadow: 0 1px 2px rgba(0,0,0,0.3);"></i>
                </div>
            </div>
        `;

        const icon = L.divIcon({
            html: pinHtml,
            className: 'bg-transparent',
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -50]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon, locId: loc.id }).addTo(markersLayer);
        
        marker.on('click', () => {
            emit('location-selected', loc);
        });
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
.glass-tooltip {
    background-color: rgba(17, 24, 39, 0.8) !important;
    border: 1px solid rgba(20, 184, 166, 0.5) !important;
    color: white !important;
    backdrop-filter: blur(4px);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.glass-tooltip.leaflet-tooltip-left::before {
    border-left-color: rgba(17, 24, 39, 0.8) !important;
}
.glass-tooltip.leaflet-tooltip-right::before {
    border-right-color: rgba(17, 24, 39, 0.8) !important;
}
</style>
