<template>
    <v-card
        min-width="400px"
        width="100%"
        class="mr-3"
        color="rgba(255, 255, 255, 0.4)"
    >
        <v-toolbar
            color="deep-purple-accent-3"
            density="compact"
            dark
        >
            <v-toolbar-title>
                {{ column.title }}
            </v-toolbar-title>

            <template v-slot:append>
                <v-chip
                    v-if="inProgressRestrictionCheck"
                    :color="inProgressRestrictionColor"
                    size="large"
                    variant='elevated'
                    class="elevation-0 text-h6"
                >{{ inProgressRestriction }}</v-chip>
            </template>
        </v-toolbar>

        <draggable v-if="this.$route.name === 'dashboard'" v-model="myList" class="list-group" group="tasks" tag="transition" item-key="id">
            <template #item="{ element: task }">
                <v-card-item class="item-top">
                    <TaskComponent
                        v-bind:task="task"
                        v-bind:user="task.executor"
                        v-bind:subtitle="subtitle">
                    </TaskComponent>
                </v-card-item>
            </template>
        </draggable>
        <v-card-item v-else class="item-top">
            <TaskComponent
                v-for="task in tasks"
                v-bind:key="task.id"
                v-bind:task="task"
                v-bind:user="task.author"
                v-bind:subtitle="subtitleAuthor">
            </TaskComponent>
        </v-card-item>
    </v-card>
</template>
  
<script>
import draggable from 'vuedraggable';
import TaskComponent from './TaskComponent.vue';
  
export default {
    data() {
        return {
            subtitle: "Исполнитель",
            subtitleAuthor: "Автор"
        }
    },
    props: {
        column: {
            type: Object,
            required: true
        },
        tasks: {
            type: Array,
            required: true
        },
    },
    computed: {
        myTasks() {
            return this.$store.getters['taskM/getTasksFromProjectsByProjectID'](this.$route.params.projectID);
        },
        myList: {
            get() {
                return this.myTasks.filter(task => task.status === this.column.title);
            },
            set(value) {
                const project = this.$store.getters['projectM/getProjectByID'](this.$route.params.projectID);
                if((project?.inProgressRestriction)
                    && (value.filter(task => task.status === 'Выполняется').length + 1 > project.inProgressRestriction)) return;
                this.$store.dispatch('taskM/replaceTasks', { tasks: value, status: this.column.title, type: 'fromProjects' });
            }
        },
        inProgressRestrictionCheck() {
            const project = this.$store.getters['projectM/getProjectByID'](this.$route.params.projectID);
            return !!((this.column.title === 'Выполняется') && (project?.inProgressRestriction));
        },
        inProgressRestriction() {
            const project = this.$store.getters['projectM/getProjectByID'](this.$route.params.projectID);
            if(project.inProgressRestriction) return `${this.tasks.length}/${project.inProgressRestriction}`;
            else return null;
        },
        inProgressRestrictionColor() {
            const project = this.$store.getters['projectM/getProjectByID'](this.$route.params.projectID);
            if(project.inProgressRestriction == this.tasks.length) return 'error';
            else return 'secondary';
        }
    },
    components: {
        draggable,
        TaskComponent
    },
}
</script>
  
<style scoped>

.item-top {
    padding-top: 0;
}
</style>