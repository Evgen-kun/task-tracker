<template>
    <div>
        <gantt-elastic :tasks="tasks" :options="options"></gantt-elastic>
    </div>
</template>

<script>
import GanttElastic from 'gantt-elastic';

export default {
  components:{
    ganttElastic: GanttElastic
  },
  props:['tasks', 'options'],
  data() {
    return {
        tasks: [
            {
                id: 1,
                name: 'Task 1',
                start: new Date('2023-04-01'),
                end: new Date('2023-04-05'),
            },
            {
                id: 2,
                name: 'Task 2',
                start: new Date('2023-04-02'),
                end: new Date('2023-04-06'),
            },
            {
                id: 3,
                name: 'Task 3',
                start: new Date('2023-04-04'),
                end: new Date('2023-04-10'),
            }
        ],
        options: {
            headerHeight: 50,
            columnWidth: 50,
            step: 24,
            viewmode: 'week',
            barHeight: 20,
            barCornerRadius: 2,
            arrowCurve: 5,
            padding: 18,
            paddingBottom: 0,
            paddingLeft: 50,
            paddingRight: 0,
            paddingTop: 20,
            useCustomDayHeader: true,
            language: 'en',
            customDayHeader: () => 'Day',
        }
    };
  }
}
</script>