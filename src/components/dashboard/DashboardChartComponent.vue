<template>
    <Doughnut :data="data" :options="options" />
</template>
  
<script lang="ts">
import store from '@/plugins/store';

import {
Chart as ChartJS,
Title,
Tooltip,
Legend,
ArcElement,
LinearScale,
CategoryScale
} from 'chart.js';
import { Doughnut } from 'vue-chartjs';


ChartJS.register(
LinearScale,
CategoryScale,
ArcElement,
Title,
Tooltip,
Legend,
);

export default {
    name: 'DashboardChartComponent',
    extends: Doughnut,
    components: {
      Doughnut
    },
    data() {
      return {
        data: {},
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            // display: false
          }
        },
      }
    },
    methods: {
        
    },
    computed: {

    },
    mounted() {
      this.data = {
        labels: ['Не выполненные', 'В процессе', 'Выполненные'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [
              store.getters['taskM/getFilteredByStatusTasks']("Не выполнено"),
              store.getters['taskM/getFilteredByStatusTasks']("Выполняется"),
              store.getters['taskM/getFilteredByStatusTasks']("Выполнено"),
            ]
          },
        ],
      };
    }
  }
</script>
  
<style>
    /* canvas { 
      height: 620px;
    } */
</style>