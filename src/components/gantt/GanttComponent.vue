<template>
  <div>
    <Bar :data="data" :options="options" />
  </div>
  <div class="d-flex flex-row">
    <v-text-field 
      v-model="dateStart" 
      class="mx-2"
      type="month" 
      variant="outlined" 
      label="Начальная дата"
    ></v-text-field>
    <v-text-field 
      v-model="dateEnd" 
      class="mx-2"
      type="month" 
      variant="outlined" 
      label="Конечная дата"
    ></v-text-field>
  </div>
</template>

<script>
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
  // progressBar
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
  // progressBar
);

import store from '@/plugins/store';

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
        'rgba(13, 215, 13, 0.3)',
        'rgba(46, 144, 255, 0.3)',
        'rgba(255, 26, 104, 0.3)'
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
            data: [],
            backgroundColor: (ctx) => {
              switch(ctx.raw.difficulty) {
                case "Легко": return this.borderColors[0];
                case "Нормально": return this.borderColors[1];
                case "Сложно": return this.borderColors[2];
              };
            },
            // borderColor: (ctx) => {
            //   return this.borderColors[ctx.raw.status];
            // },
            // borderWidth: 1,
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
            labels: [],
          }
        },
        plugins: {
          plugins: [todayLine, assignedTasks, status, weekend/*, progressBar*/],
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
    },

    progressDate() {
      this.data.datasets[0].data.forEach(item => {
        const mutate = item;
        const beginDate = mutate.x[0];
        const endDate = mutate.x[1];

        if(new Date(beginDate) === new Date(endDate)) this.data.datasets[0].data.push(item);

      });
    },
  },
  mounted() {
    this.options.scales.x.min = this.minDate;
    this.options.scales.x.max = this.maxDate;
    this.options = Object.assign({}, this.options);
  },
  created() {
    const tasks = store.getters['taskM/getTasksFromMe'];
    console.log(tasks);
    this.options.scales.y.labels = tasks.map(task => task.title);

    const data = [];

    tasks.forEach((task) => {
      data.push({ 
          x: [task.beginDate, task.dueDate], 
          y: task.title, 
          name: task.executor.name, 
          status: task.status, 
          progress: task.progress,
          difficulty: task.difficulty,
          type: "task"
        });

        const beginDate = new Date(task.beginDate);
        const dueDate = new Date(task.dueDate);

        const timestamp = dueDate - beginDate;
        console.log("timestamp: " + timestamp);
        const done = timestamp * task.progress * 0.01;
        console.log("done: " + done);
        const doneTime = Number(beginDate) + done;
        console.log("doneTime: " + doneTime);
        console.log("res: " + beginDate);
        console.log("res: " + dueDate);
        console.log("res: " + new Date(doneTime));

        data.push({ 
          x: [task.beginDate, doneTime], 
          y: task.title, 
          name: task.executor.name, 
          status: task.status, 
          progress: task.progress,
          difficulty: task.difficulty,
          type: "progress"
        });
      });

    console.log("Dataset: " + data);
    this.data.datasets[0].data = data;
    this.data.datasets[0].backgroundColor = (ctx) => {
      switch(ctx.raw.difficulty) {
        case "Легко": return (ctx.raw.type === 'task')? this.colors[0] : this.borderColors[0];
        case "Нормально": return (ctx.raw.type === 'task')? this.colors[1] : this.borderColors[1];
        case "Сложно": return (ctx.raw.type === 'task')? this.colors[2] : this.borderColors[2];
      };
    };
  }
}
</script>

<style>
  canvas { 
    height: 620px;
  }
</style>