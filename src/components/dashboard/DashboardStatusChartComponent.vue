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
              data: [],
              borderRadius: 20,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              right: 20,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Количество задач',
                font: {
                  size: 20,
                }
              },
              ticks: {
                beginAtZero: true,
                font: {
                  size: 16,
                },
                callback: function(value) {if (value % 1 === 0) {return value;}}
              }
            },
            x: {
              title: {
                display: true,
                text: 'Статус',
                font: {
                  size: 20,
                }
              },
              ticks: {
                font: {
                  size: 16,
                },
              }
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            plugins: [],
          },
        },
      }
    },
    mounted() {
      this.allTasks = store.getters['taskM/getTasksFromProjectsByProjectID'](this.$route.params.projectID);
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