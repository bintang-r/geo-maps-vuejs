import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = idCounter++
    const toast = { id, message, type }
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const success = (message, duration = 3000) => showToast(message, 'success', duration)
  const error = (message, duration = 4000) => showToast(message, 'error', duration)
  const info = (message, duration = 3000) => showToast(message, 'info', duration)

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    success,
    error,
    info,
    removeToast
  }
}
