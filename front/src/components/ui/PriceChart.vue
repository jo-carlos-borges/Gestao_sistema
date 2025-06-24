<script setup lang="ts">
import { defineProps, computed, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import type { Price } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{
  prices: Price[];
}>();

const chartData = computed(() => {
  // Sort prices by date
  const sortedPrices = [...props.prices].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const labels = sortedPrices.map(price => {
    const date = new Date(price.date);
    return date.toLocaleDateString();
  });
  
  const values = sortedPrices.map(price => price.value);
  
  return {
    labels,
    datasets: [
      {
        label: 'Price History',
        backgroundColor: 'rgba(63, 131, 248, 0.2)',
        borderColor: 'rgba(63, 131, 248, 1)',
        borderWidth: 2,
        data: values,
        tension: 0.2,
        pointBackgroundColor: 'rgba(63, 131, 248, 1)',
      }
    ]
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value: any) {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
      }
    }
  }
});
</script>

<template>
  <div class="h-60">
    <Line v-if="props.prices.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      No price history available
    </div>
  </div>
</template>