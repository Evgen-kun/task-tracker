<template>
  <v-card
    class="mx-2"
    width="50%"
    min-width="270"
    rounded="xl"
  >
    <v-card-title class="text-h6">Распределение задач по статусам</v-card-title>
    <div>
      <Bar 
        id="dashboard-status-chart-component-id"
        :key="key" 
        :data="data" 
        :options="options" 
      ></Bar>
    </div>
  </v-card>
</template>
  
<script>
import store from '@/plugins/store';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
    name: 'DashboardStatusChartComponent',
    components: {
      Bar
    },
    data() {
      return {
        key: 0,
        allTasks: [],
        data: {
          labels: ['Не выполненные', 'В процессе', 'Выполненные'],
          datasets: [
            {
              backgroundColor: ['#E46651', '#6669fa', '#41B883'],
              data: []
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            // display: false
          },
          scales: {
            y: {
              ticks: {
                beginAtZero: true,
                callback: function(value) {if (value % 1 === 0) {return value;}}
              }
            }
          },
          plugins: {
            plugins: [],
          },
        },
      }
    },
    methods: {
        
    },
    computed: {

    },
    mounted() {
      // this.allTasks = store.getters['taskM/getTasksFromMe'];
      this.allTasks = store.getters['taskM/getTasksFromMeByProjectID'](this.$route.params.projectID);
      const data = [
        this.allTasks.filter(task => task.status === "Не выполнено").length,
        this.allTasks.filter(task => task.status === "Выполняется").length,
        this.allTasks.filter(task => task.status === "Выполнено").length,
      ];
      this.data.datasets[0].data = data;
      this.key += 1;
    }
  }
</script>
  
<style scoped>
    canvas { 
      height: 500px;
    }
</style>