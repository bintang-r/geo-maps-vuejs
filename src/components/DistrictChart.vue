<template>
  <div class="w-full h-48 relative flex items-center justify-center">
    <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  stats: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  if (!props.stats || props.stats.length === 0) return null

  return {
    labels: props.stats.map(s => s.name),
    datasets: [
      {
        backgroundColor: props.stats.map(s => s.color || '#14b8a6'),
        data: props.stats.map(s => s.count),
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#9ca3af',
        font: {
          family: "'Inter', sans-serif",
          size: 11
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4
    }
  },
  cutout: '70%'
}
</script>
