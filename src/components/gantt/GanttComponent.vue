<template>
  <div>
    <Bar :data="data" :options="options" />
  </div>
  <div>
    <v-text-field v-model="dateStart" type="month" label="Начальная дата"></v-text-field>
    <v-text-field v-model="dateEnd" type="month" label="Конечная дата"></v-text-field>
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import 'chartjs-adapter-date-fns';
// import annotationPlugin from 'chartjs-plugin-annotation';
import { 
  todayLine,
  assignedTasks,
  status,
  weekend,
  progressBar
} from './plugins/chartPlugins'


ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  // annotationPlugin
  todayLine,
  assignedTasks,
  status,
  weekend,
  progressBar
);

export default {
  name: 'MyChart',
  extends: Bar,
  components: {
    Bar,
  },
  data() {
    return {
      dateStart: new Date().toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit' }).toString().split('.').reverse().join('-'),
      dateEnd: new Date().toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit' }).toString().split('.').reverse().join('-'),
      colors: [
        'rgba(13, 215, 13, 0.2)',
        'rgba(46, 144, 255, 0.2)',
        'rgba(255, 26, 104, 0.2)'
      ],
      borderColors: [
        'rgba(46, 255, 53, 1)',
        'rgba(46, 144, 255, 1)',
        'rgba(255, 26, 104, 1)'
      ],
      data: {
        // labels: ['Выполненные', 'В процессе', 'Назначенные'],
        datasets: [
          {
            label: 'Задачи',
            data: [
              { x: ['2023-03-20', '2023-03-29'], y: 'Task 1', name: 'John', status: 0, progress: 30 },
              { x: ['2023-03-11', '2023-03-19'], y: 'Task 2', name: 'Jack', status: 0, progress: 10 },
              { x: ['2023-03-12', '2023-03-26'], y: 'Task 3', name: 'James', status: 0, progress: 80 },
              { x: ['2023-03-25', '2023-03-29'], y: 'Task 4', name: 'Tom', status: 1, progress: 50 },
              { x: ['2023-03-25', '2023-03-31'], y: 'Task 5', name: 'Jeff', status: 2, progress: 40 },
              { x: ['2023-04-05', '2023-04-09'], y: 'Task 6', name: 'Tom', status: 1, progress: 30 },
              { x: ['2023-04-15', '2023-04-25'], y: 'Task 7', name: 'Jeff', status: 2, progress: 70 },
            ],
            backgroundColor: (ctx) => {
              return this.colors[ctx.raw.status];
            },
            borderColor: (ctx) => {
              return this.borderColors[ctx.raw.status];
            },
            borderWidth: 1,
            borderSkipped: false,
            borderRadius: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.9
          },
          // {
          //   label: 'Проекты',
          //   data: [
          //     { x: ['2023-03-11', '2023-04-09'], y: 'Project 1', name: 'John', status: 0 },
          //     { x: ['2023-03-21', '2023-04-09'], y: 'Project 2', name: 'Jack', status: 0 },
          //   ],
          //   backgroundColor: (ctx) => {
          //     return this.colors[ctx.raw.status];
          //   },
          //   borderColor: (ctx) => {
          //     return this.borderColors[ctx.raw.status];
          //   },
          //   borderWidth: 1,
          //   borderSkipped: false,
          //   borderRadius: 10,
          //   barPercentage: 0.5,
          // }
        ],
      },
      options: {
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: 200,
            right: 0,
            bottom: 20
          },
          height: 100,
        },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            position: 'top',
            type: 'time',
            time: {
              // unit: 'day',
              displayFormats: {
                day: 'dd.MM'
              }
            },
            min: '2023-03-01',
            max: '2023-05-01',
            categoryPercentage: 1.0,
            barPercentage: 0.5,
            stacked: true,
          },
          y: {
            min: 0,
            max: 10,
            labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7'],
          }
        },
        plugins: {
          plugins: [todayLine, assignedTasks, status, weekend, progressBar],
          weekend: {
            weekendColor: 'rgba(102, 102, 102, 0.2)'
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (ctx) => {
                // console.log(ctx[0].raw.x[0]);
                const startDate = new Date(ctx[0].raw.x[0]);
                const endDate = new Date(ctx[0].raw.x[1]);
                const formattedStartDate = startDate.toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  // hour12: true
                });
                const formattedEndDate = endDate.toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                return [ctx[0].raw.name, `Время выполнения задачи: ${formattedStartDate} - ${formattedEndDate}`];
              }
            }
          }
        }
      }
    }
  },
  methods: {
    showMonth() {
      console.log(this.month);
    },
    lastDay(year, month) {
      return new Date(year, month, 0).getDate();
    },
    chartFilter() {
      // console.log("Update!");
      this.options.scales.x.min = this.minDate;
      this.options.scales.x.max = this.maxDate;

      this.options = Object.assign({}, this.options);
    }
  },
  watch: {
    dateStart() {
      this.chartFilter();
    },
    dateEnd() {
      this.chartFilter();
    }
  },
  computed: {
    startYear() {
      return this.dateStart.substring(0, 4);
    },
    startMonth() {
      return this.dateStart.substring(5, 7);
    },
    endYear() {
      return this.dateEnd.substring(0, 4);
    },
    endMonth() {
      return this.dateEnd.substring(5, 7);
    },
    minDate() {
      return `${this.startYear}-${this.startMonth}-01`;
    },
    maxDate() {
      return `${this.endYear}-${this.endMonth}-${this.lastDay(this.endYear, this.endMonth)}`
    }
  },
  mounted() {
    this.options.scales.x.min = this.minDate;
    this.options.scales.x.max = this.maxDate;
    this.options = Object.assign({}, this.options);
  }
}
</script>

<style>
  canvas { 
    height: 620px;
  }
</style>