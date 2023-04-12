<template>
    <!-- <v-container fluid>
        <v-row dense>
            <v-col cols="1">
                №
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                Проекты/Задачи
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="1">
                Статус
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="2">
                Исполнитель
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                Диаграмма
            </v-col>
        </v-row>
        <v-row 
            dense
            v-for="project in projects"
            :key="project.id"
        >
            <v-col cols="1">
                1
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                <v-card
                    variant="tonal"
                    rounded="lg"
                >

                <div>
                    <div class="d-flex flex-row">
                        <v-card-item>
                            {{ project.name }}
                        </v-card-item>

                        <v-spacer></v-spacer>
                        <v-card-actions>
                            <v-btn
                                :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                @click="show = !show"
                            ></v-btn>
                        </v-card-actions>
                    </div>
                    

                    <v-expand-transition>
                    <div v-show="show">
                        <v-divider></v-divider>

                        <v-card-item>
                            <v-card
                                variant="tonal"
                                rounded="lg"
                            >
                            <div class="d-flex flex-row">
                                    <v-card-item>
                                        {{ project.name }}
                                    </v-card-item>
                            </div>

                            </v-card>
                        </v-card-item>
                        
                    </div>
                    </v-expand-transition>
                </div>

                </v-card>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="1">
                <v-progress-circular
                    :rotate="360"
                    :width="7"
                    :model-value="75"
                    color="blue"
                >
                </v-progress-circular>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="2">
                <v-chip
                    pill
                >
                    <v-avatar start>
                    <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                    </v-avatar>

                    John Leider
                </v-chip>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                Диаграмма
            </v-col>
        </v-row>
    </v-container> -->
    <v-table>
    <thead>
      <tr>
        <th class="text-center" style="width: 15px;">
            №
        </th>
        <th class="text-start" style="width: 350px;">
            Проекты/Задачи
        </th>
        <th class="text-center" style="width: 15px;">
            Статус
        </th>
        <th class="text-center" style="width: 150px;">
            Исполнитель
        </th>
        <th class="text-center">
            Диаграмма
        </th>
      </tr>
    </thead>
    <tbody>
      <div
            v-for="(project, i) in projects"
            :key="project.id"
        >

            <TableProjectComponent :num="i" :project="project" />

            <div
                v-show="show"
                v-for="(task, j) in project.tasks"
                :key="task.id"
            >
            
                <TableTaskComponent :num="i + '.' + j" :task="task" />
            
            </div>

            <v-spacer></v-spacer>
        </div>
    </tbody>
  </v-table>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
// import TableProjectComponent from './TableProjectComponent.vue';
// import TableTaskComponent from './TableTaskComponent.vue';

export default {
    data() {
        return {
            power: 40,
            show: false,
            projects: [
                {
                    id: "31wefcef",
                    name: "Проект 1",
                    status: "open",
                    tasks: [
                        {
                            id: "wefcef",
                            name: "Задача 1",
                            progress: 15,
                        },
                        {
                            id: "wefce",
                            name: "Задача 2",
                            progress: 75,
                        },
                        {
                            id: "wefef",
                            name: "Задача 3",
                            progress: 45,
                        },
                    ],
                },
                {
                    id: "31wefc",
                    name: "Проект 2",
                    status: "open",
                },
                {
                    id: "31we",
                    name: "Проект 3",
                    status: "open",
                },
                {
                    id: "31wefcefsa",
                    name: "Проект 4",
                    status: "open",
                },
                {
                    id: "31wefcefadasas",
                    name: "Проект 5",
                    status: "open",
                },
            ],
        }
    },
    methods: {

    },
    computed: {
        ...mapGetters('teamM', {

        }),
    },
    components: {
    // TableProjectComponent,
    // TableTaskComponent,
},
    async created() {
        const user = store.getters['authM/getUser'];
        const userUID = user.uid;
        console.log(store.getters['authM/getToken']);
    }
}
</script>

<style>

</style>