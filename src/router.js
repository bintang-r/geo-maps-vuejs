import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import LocationFormView from './views/LocationFormView.vue'
import CategoryManagerView from './views/CategoryManagerView.vue'
import AdminDashboardView from './views/AdminDashboardView.vue'
import BasicMapView from './views/BasicMapView.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/location/add', name: 'AddLocation', component: LocationFormView },
  { 
    path: '/location/edit/:id', 
    name: 'EditLocation', 
    component: LocationFormView 
  },
  { 
    path: '/categories', 
    name: 'CategoryManager', 
    component: CategoryManagerView 
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView
  },
  {
    path: '/basic',
    name: 'BasicMap',
    component: BasicMapView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
