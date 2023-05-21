<template>
  <v-container>
    <v-row>
      <v-col :cols="(showEdit)? 9 : 12">
        <v-sheet rounded="lg">
          <div class="container">
            <Bar
              id="gantt-component-id" 
              ref="bar"
              :key="key" 
              :data="chartData" 
              :options="options"
              :plugins="plugins"
            ></Bar>
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

            <v-autocomplete
              v-model="filterExecutors"
              label="Фильтр по исполнителям"
              :items="allUsers"
              item-title="nameWithID"
              item-value="uid"
              chips
              closable-chips
              clearable
              multiple
            ></v-autocomplete>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="3" v-if="showEdit">
        <EditTaskComponent 
          :key="editKey" 
          :task="currentTask" 
          :userUID="currentTask?.executor.uid"
          @closeEvent="{ showEdit = !showEdit; showAlert = false; currentTask = {} }"
        ></EditTaskComponent>
      </v-col>
    </v-row>
  </v-container>
  <v-alert
    v-model="showAlert"
    class="toast"
    type="warning"
    elevation="5"
    max-width="600px"
    border="start"
    closable
    title="Пересечение задач"
  >
    Задача <strong>'{{ currentTask.title }}'</strong> пользователя <strong>{{ currentTask?.executor?.name }}</strong> имеет пересечение со следующими задачами:
    <ul>
      <li v-for="item in taskOverlap"
        :key="item.title"
      >
        <strong>'{{ item.title }}'</strong>: {{ (item.begin !== item.end)? `${item.begin} - ${item.end}` : item.begin }}
      </li>
    </ul>
    По возможности старайтесь избегать наложения задач.
  </v-alert>
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
// import ChartJSdragDataPlugin from 'chartjs-plugin-dragdata';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
import store from '@/plugins/store';
import EditTaskComponent from '../task/actions/cards/EditTaskComponent.vue';

export default {
  name: 'GanttComponent',
  components: {
    Bar,
    EditTaskComponent,
  },
  data() {
    return {
      key: 0,
      editKey: 0,
      showEdit: false,
      showAlert:false,
      dateStart: new Date().toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit' }).toString().split('.').reverse().join('-'),
      dateEnd: new Date().toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit' }).toString().split('.').reverse().join('-'),
      filterExecutors: [],
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
      currentTask: {},
      allTasks: [],
      allUsers: [],
      chartItems: [],
      data: {
        datasets: [
          {
            label: 'Задачи',
            data: [],
            backgroundColor: (ctx) => {
              switch(ctx.raw.difficulty) {
                case "Легко": return this.borderColors[0];
                case "Нормально": return this.borderColors[1];
                case "Сложно": return this.borderColors[2];
              }
            },
            borderSkipped: false,
            borderRadius: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.9,
            borderWidth: 1,
            pointHitRadius: 25,
            dragData: true,
          },
        ],
      },
      plugins: [
        {
          id: 'todayLine',
          beforeDatasetsDraw(chart, args, pluginOptions) {
              const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
              ctx.save();
              ctx.beginPath();
              ctx.lineWidth = 3;
              ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
              ctx.setLineDash([6, 6]);
              ctx.moveTo(x.getPixelForValue(new Date()), top);
              ctx.lineTo(x.getPixelForValue(new Date()), bottom);
              ctx.stroke();
              ctx.restore();
          
              ctx.setLineDash([]);

              ctx.beginPath();
              ctx.lineWidth = 1;
              ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
              ctx.fillStyle = 'rgba(102, 102, 102, 1)';
              ctx.moveTo(x.getPixelForValue(new Date()), top + 3);
              ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
              ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
              ctx.closePath();
              ctx.stroke();
              ctx.fill();
              ctx.restore();

              ctx.font = 'bolder 12px sans-serif';
              ctx.fillStyle = 'rgba(102, 102, 102, 1)';
              ctx.textAlign = 'center';
              ctx.fillText('Сейчас', x.getPixelForValue(new Date()), bottom + 15);
              ctx.restore();
          }
        },
        {
          id: 'assignedTasks',
          afterDatasetsDraw(chart, args, pluginOptions) {
              const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
              
              ctx.font = 'bolder 12px sans-serif';
              ctx.fillStyle = 'black';
              ctx.textBaseline = 'middle';
              ctx.textAlign = 'left';
              
              data.datasets[0].data.forEach((item, index) => {
                  if(index % 2 === 1) { return; }
                  ctx.fillText(item.name, 40, y.getPixelForValue(index / 2));
              });
              ctx.fillText('Исполнитель', 25, top - 15);
              ctx.restore();
          }
        },
        {
          id: 'status',
          beforeDatasetsDraw(chart, args, pluginOptions) {
              const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
          
              const icons = new Map();
              icons.set('Не выполнено', { icon: '\uf00d', color: 'rgba(255, 26, 104, 1)' });
              icons.set('Выполняется', { icon: '\uf110', color: 'rgba(255, 206, 86, 1)' });
              icons.set('Выполнено', { icon: '\uf00c', color: 'rgba(75, 192, 192, 1)' });

              const angle = Math.PI / 180;
              
              ctx.save();
              ctx.font = 'bolder 15px FontAwesome';
              ctx.textBaseline = 'middle';
              ctx.textAlign = 'center';
              data.datasets[0].data.forEach((item, index) => {
                  if(index % 2 === 1) { return; }
                  ctx.beginPath();
                  ctx.fillStyle = icons.get(item.status).color;
                  ctx.arc(left - 250, y.getPixelForValue(index / 2), 12, 0, angle * 360, false);
                  ctx.closePath();
                  ctx.fill();
                  ctx.fillStyle = 'white';
                  ctx.fillText(icons.get(item.status).icon, left - 250, y.getPixelForValue(index / 2));
              });
              ctx.font = 'bolder 12px sans-serif';
              ctx.fillStyle = 'black';
              ctx.fillText('Статус', left - 250, top - 15);
              ctx.restore();
          }
        },
        {
          id: 'taskName',
          beforeDatasetsDraw(chart, args, pluginOptions) {
              const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

              ctx.font = 'bolder 12px sans-serif';
              ctx.fillStyle = 'black';
              ctx.fillText('Название', left - 60, top - 13);
              ctx.restore();
          }
        },
        {
          id: 'weekend',
          beforeDatasetsDraw(chart, args, pluginOptions) {
              const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
              ctx.save();

              x.ticks.forEach((tick, index) => {
                  const day = new Date(tick.value).getDay();
                  if(day === 6 || day === 0) {
                      ctx.fillStyle = pluginOptions.weekendColor; //'rgba(102, 102, 102, 0.2)';
                      ctx.fillRect(x.getPixelForValue(tick.value), top, 
                          x.getPixelForValue(new Date(tick.value).setHours(24)) - x.getPixelForValue(tick.value), height);
                  }
              });
          }
        },
      ],
      options: {
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          // console.log(chartElement[0]);
        },
        onClick: (event, chartElement) => {
          const element = chartElement[0] ? chartElement[0].element.$context.raw : null;
          this.showEditTask(element.id);
          console.log(element);
        },
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
            id: 'x-axis-1',
            position: 'top',
            type: 'time',
            time: {
              displayFormats: {
                day: 'dd.MM',
              },
            },
            min: '2023-03-01',
            max: '2023-05-01',
            categoryPercentage: 1.0,
            barPercentage: 0.5,
            stacked: true,
          },
          y: {
            id: 'y-axis-1',
            min: 0,
            max: 10,
            labels: [],
            ticks: {
              font: {
                weight: 'bold'
              }
            },
          },
        },
        plugins: {
          // dragData: {
          //   round: 0,
          //   onDragStart: function (e, datasetIndex) {
          //     console.log("drag start!");

          //     // chart
          //     // this.$refs.bar.chart.data.datasets[datasetIndex].data[index].x = [new Date(), new Date().setDate(new Date().getDate() + 8)];
          //     // this.$refs.bar.chart.update();
          //     console.log({event: e});
          //   },
          //   onDrag: function (e, datasetIndex, index, value) {
          //     console.log("drag!");
          //     e.target.style.cursor = 'grabbing';

          //     // this.$refs.bar.chart.data.datasets[datasetIndex].data[index].x = [new Date(), new Date().setDate(new Date().getDate() + 8)];
          //     // this.$refs.bar.chart.update();
          //     console.log({event: e, index: index, value: value});
          //   },
          //   onDragEnd: function (e, datasetIndex, index, value) {
          //     console.log("drag end!");
          //     e.target.style.cursor = 'default';

          //     console.log({event: e, index: index, value: value});
          //     // const xScale = chart.scales["x-axis-1"];
          //     // const xValue = xScale.getValueForPixel(value.x);

          //     // if (isNaN(xValue) || !isFinite(xValue)) {
          //     //   console.error("Ошибка значения времени: ", xValue);
          //     //   return;
          //     // }

          //     // chart.data.datasets[datasetIndex].data[index].x = [new Date(), new Date().setDate(new Date().getDate() + 8)];
          //     // chart.update();
          //   },
          // },
          // plugins: [todayLine, assignedTasks, status, weekend],
          weekend: {
            weekendColor: 'rgba(102, 102, 102, 0.2)'
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            callbacks: {
              title: (ctx) => {
                const startDate = new Date(ctx[0].raw.x[0]);
                const endDate = new Date(ctx[0].raw.x[1]);
                const formattedStartDate = startDate.toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
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
    addDay(taskID = "1") {
      console.log(this.$refs.bar.chart);
      const taskIndex = this.data.datasets[0].data.findIndex(task => (task.type === "task" && task.id === taskID));
      const progressIndex = this.data.datasets[0].data.findIndex(progress => (progress.type === "progress" && progress.id === taskID));
      console.log(this.data.datasets[0].data);
      console.log(taskIndex);
      const date = this.data.datasets[0].data[taskIndex].x[1];
      console.log(taskIndex);
      this.data.datasets[0].data[taskIndex].x[1] = new Date(date).setDate(new Date(date).getDate() + 1);
      const task = this.data.datasets[0].data[taskIndex];
      this.data.datasets[0].data[progressIndex].x = [task.x[0], this.progressCalc(task.x[0], task.x[1], task.progress)]
      this.$refs.bar.chart.update();
    },
    progressCalc(beginDate, dueDate, progress) {
      const timestamp = new Date(dueDate) - new Date(beginDate);
      const done = timestamp * progress * 0.01;
      return Number(new Date(beginDate)) + done;
    },
    lastDay(year, month) {
      return new Date(year, month, 0).getDate();
    },
    chartFilterDate() {
      this.options.scales.x.min = this.minDate;
      this.options.scales.x.max = this.maxDate;

      this.options = Object.assign({}, this.options);
    },
    chartFilterExecutor() {
      if(this.filterExecutors.length === 0) { this.data.datasets[0].data = this.chartItems; }
      else { this.data.datasets[0].data = this.chartItems.filter(task => this.filterExecutors.includes(task.executorUID)); }
      this.options.scales.y.labels = this.data.datasets[0].data.filter(task => task.type === "task").map(task => task.y);

      this.dynamicHeight(this.data.datasets[0].data.length);
      this.key += 1;
    },
    dynamicHeight(rowsCount) {
      let rowHeight = 50;
      const chartBox = document.querySelector('canvas');
      chartBox.parentNode.style.height = rowHeight * rowsCount + 'px';
    },
    showEditTask(id) {
      const task = this.allTasks.find(task => task.id === id);
      this.currentTask = task;
      this.showAlert = (this.taskOverlap.length > 0)? true : false;
      this.editKey++;
      this.showEdit = true;
    },
  },
  watch: {
    dateStart() {
      this.chartFilterDate();
    },
    dateEnd() {
      this.chartFilterDate();
    },
    filterExecutors() {
      this.chartFilterExecutor();
    },
    allTasks() {
      console.log("Все задачи: ");
      console.log(this.allTasks);
    }
  },
  computed: {
    chartData() {
      return this.data;
    },
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
    taskOverlap() {
      const userTasksWithoutTargetTask = this.allTasks.filter(task => (task.executor.uid === this.currentTask?.executor.uid) 
        && (task.id !== this.currentTask.id));
      const overlappingTasks = userTasksWithoutTargetTask.filter(task => !(
        (new Date(task.dueDate) <= new Date(this.currentTask.beginDate)) 
        || (new Date(task.beginDate) >= new Date(this.currentTask.dueDate))));
      const data = [];
      overlappingTasks.forEach((task) => {
        if((new Date(this.currentTask.beginDate) <= new Date(task.beginDate)) && (new Date(this.currentTask.dueDate) >= new Date(task.dueDate))) {
          data.push({
            title: task.title,
            begin: new Date(task.beginDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' }),
            end: new Date(task.dueDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })
          });
          return;
        }
        if((new Date(this.currentTask.beginDate) > new Date(task.beginDate)) && (new Date(this.currentTask.dueDate) < new Date(task.dueDate))) {
          data.push({
            title: task.title,
            begin: new Date(this.currentTask.beginDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' }),
            end: new Date(this.currentTask.dueDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })
          });
          return;
        }
        if((new Date(this.currentTask.beginDate) < new Date(task.beginDate)) && (new Date(this.currentTask.dueDate) > new Date(task.beginDate))) {
          data.push({
            title: task.title,
            begin: new Date(task.beginDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' }),
            end: new Date(this.currentTask.dueDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })
          });
          return;
        }
        if((new Date(this.currentTask.beginDate) < new Date(task.dueDate)) && (new Date(this.currentTask.dueDate) > new Date(task.dueDate))) {
          data.push({
            title: task.title,
            begin: new Date(this.currentTask.beginDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' }),
            end: new Date(task.dueDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })
          });
          return;
        }
      });
      return data;
    }
  },
  mounted() {
    this.options.scales.x.min = this.minDate;
    this.options.scales.x.max = this.maxDate;
    this.options = Object.assign({}, this.options);
  },
  created() {
    this.allTasks = store.getters['taskM/getTasksFromProjectsByProjectID'](this.$route.params.projectID);
    this.allUsers = store.getters['userM/getUsers'].map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
    this.options.scales.y.labels = this.allTasks.map(task => task.title);

    const data = [];

    this.allTasks.forEach((task) => {
      data.push({ 
          id: task.id,
          x: [task.beginDate, task.dueDate], 
          y: task.title, 
          executorUID: task.executor.uid,
          name: task.executor.name, 
          status: task.status, 
          progress: task.progress,
          difficulty: task.difficulty,
          type: "task"
        });
        const beginDate = new Date(task.beginDate);
        const dueDate = new Date(task.dueDate);
        const timestamp = dueDate - beginDate;
        const done = timestamp * task.progress * 0.01;
        const doneTime = Number(beginDate) + done;
        data.push({ 
          id: task.id,
          x: [task.beginDate, doneTime], 
          y: task.title, 
          executorUID: task.executor.uid,
          name: task.executor.name, 
          status: task.status, 
          progress: task.progress,
          difficulty: task.difficulty,
          type: "progress"
        });
      });
    this.chartItems = data;
    this.data.datasets[0].data = data;
    this.data.datasets[0].backgroundColor = (ctx) => {
      switch(ctx.raw.difficulty) {
        case "Легко": return (ctx.raw.type === 'task')? this.colors[0] : this.borderColors[0];
        case "Нормально": return (ctx.raw.type === 'task')? this.colors[1] : this.borderColors[1];
        case "Сложно": return (ctx.raw.type === 'task')? this.colors[2] : this.borderColors[2];
      }
    };
  },
}
</script>

<style scoped>
  canvas { 
    height: 640px;
  }

  .toast {
    position: fixed;
    text-align: left;
    z-index: 1;
    bottom: 35px;
    left: 80px;
  }
</style>