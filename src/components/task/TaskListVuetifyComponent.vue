<template>
  <v-data-table
      v-model="selected"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="tasks"
      :search="search"
      item-value="title"
      
      class="elevation-1 rounded-lg"
  >
  <!-- show-select -->
    <template v-slot:item.executor="{ item }">
      <v-chip
        pill
      >
        <v-avatar start :image="item.raw.executor.picture.url"></v-avatar>

        {{ item.raw.executor.name }}
      </v-chip>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColorStatus(item.raw.status)">
        {{ item.raw.status }}
      </v-chip>
    </template>
    <template v-slot:item.progress="{ item }">
      <v-progress-linear 
        :color="getColorProgress(item.raw.progress)"
        :model-value="item.raw.progress"
        height="6"
        bg-color="black"
        rounded
      ></v-progress-linear>
    </template>
    <template v-slot:item.answers="{ item }">
      <v-chip
        :color="getColorAnswers(item.raw.answers.length)"
        text-color="white"
      >
        {{ item.raw.answers.length }} Отв.
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar
        flat
        rounded="lg"
      >
        <v-toolbar-title>Моя команда</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
        >
          Новая задача
          <CreateTaskDialogComponent />
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        variant="text"
      ><v-icon>mdi-pencil</v-icon>
        <EditTaskDialogComponent
          v-bind:task="item.raw"
          v-bind:userUID="item.raw.executor.uid"
        ></EditTaskDialogComponent>
      </v-btn>
    </template>
  </v-data-table>
</template>
  
<script>
import { mapGetters } from 'vuex';
import store from '@/plugins/store';
import CreateTaskDialogComponent from './actions/dialog/CreateTaskDialogComponent.vue';
import EditTaskDialogComponent from './actions/dialog/EditTaskDialogComponent.vue';

export default {
    data() {
      return {
        search: '',
        selected: [],
        dialog: false,
        dialogDelete: false,
        itemsPerPage: 10,
        headers: [
          { 
            title: 'Название',
            align: 'center',
            sortable: false,
            key: 'title'
        },
        //   { title: 'Проект', align: 'center', key: 'project' },
          { title: 'Исполнитель', align: 'center', key: 'executor' },
          { title: 'Статус', align: 'center', key: 'status' },
          { title: 'Прогресс', align: 'center', key: 'progress' },
          { title: 'Количество ответов', align: 'center', key: 'answers' },
          { title: 'Действия', align: 'center', key: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          id: 0,
          title: '',
          body: '',
          executor: {
            name: ''
          },
          author: {},
          status: '',
          progress: '',
          answers: [],
        },
        defaultItem: {
          id: 0,
          title: '',
          body: '',
          executor: {
            name: ''
          },
          author: {},
          status: '',
          progress: '',
          answers: [],
        },
      }
    },
    methods: {
      getColorStatus (status) {
        switch(status) {
          case 'Выполнено': return 'green';
          case 'Выполняется': return 'blue';
          case 'Не выполнено': return 'orange';
          default: return 'red';
        }
      },
      getColorProgress (progress) {
        if (progress === 100) return 'green';
        else if (progress < 100 && progress >= 10) return 'blue';
        else return 'red';
      },
      getColorAnswers (answers) {
        if (answers === 0) return 'red';
        else return 'teal';
      },

      editItem (item) {
        this.editedIndex = this.tasks.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },

      deleteItem (item) {
        this.editedIndex = this.tasks.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },

      deleteItemConfirm () {
        this.tasks.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      save () {
        // if (this.editedIndex > -1) {
        //   Object.assign(this.tasks[this.editedIndex], this.editedItem);
        // } else {
        //   this.tasks.push(this.editedItem);
        // }
        this.close()
      },
    },
    computed: {
      //   ...mapGetters('taskM', {
      //   tasks: 'getTasksFromMe',
      // }),
      tasks() { 
        return store.getters['taskM/getTasksFromMeByProjectID'](this.$route.params.projectID); 
      },
      formTitle () {
        return this.editedIndex === -1 ? 'Новая задача' : 'Редактирование задачи'
      },
    },
    components: {
      CreateTaskDialogComponent,
      EditTaskDialogComponent
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    async created() {
        const user = store.getters['authM/getUser'];
        const userUID = user.uid;
        await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
        await store.dispatch('userM/usersQuery');
    }
}
</script>

<style>

</style>