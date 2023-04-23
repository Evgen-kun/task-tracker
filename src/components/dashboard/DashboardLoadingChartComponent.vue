<template>
    <v-card
      class="mx-2"
      width="50%"
      min-width="270"
      rounded="xl"
    >
      <v-card-title class="text-h6">Загруженность команды</v-card-title>
      <div>
        <Doughnut 
          id="dashboard-loading-chart-component-id"
          :key="key" 
          :data="data" 
          :options="options" 
        ></Doughnut>
      </div>
    </v-card>
  </template>
    
  <script>
  import store from '@/plugins/store';
  
  import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
  import { Doughnut } from 'vue-chartjs';
  
  
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
  );
  
  export default {
      name: 'DashboardLoadingChartComponent',
      components: {
        Doughnut
      },
      data() {
        return {
          key: 0,
          allTasks: [],
          allUsers: [],
          data: {
            labels: [],
            datasets: [
              {
                backgroundColor: ['#E46651', '#6669fa', '#41B883', '#f79b11', '#00D8FF'],
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
        // this.allUsers = store.getters['userM/getUsers'];
        this.allTasks = store.getters['taskM/getTasksFromMeByProjectID'](this.$route.params.projectID);
        const allUsers = new Map();
        this.allTasks.forEach((task) => {
          allUsers.set(task.executor.uid, task.executor);
        });
        this.allUsers = [...allUsers.values()];
        console.log(allUsers);
        console.log(allUsers.values());
        console.log(this.allUsers);
        const data = [];
        const labels = [];
        this.allUsers.forEach((user) => {
          labels.push(`${user.name} (${user.id})`);
          const count = this.allTasks.filter(task => task.executor.uid === user.uid).length;
          data.push(count);
        });
        this.data.datasets[0].data = data;
        this.data.labels = labels;
        console.log(labels);
        this.key += 1;
      }
    }
  </script>
    
  <style scoped>
      canvas { 
        height: 500px;
      }
  </style>