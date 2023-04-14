<template>
  <v-data-table
      v-model="selected"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="tasks"
      :search="search"
      item-value="title"
      
      class="elevation-1"
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
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              Новая задача
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.title"
                      label="Название задачи"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.executor.name"
                      label="Исполнитель"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.status"
                      label="Статус задачи"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Закрыть
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="550px">
          <v-card>
            <v-card-title class="text-h5">Вы действительно хотите удалить задачу?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Нет</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Да</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item.raw)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
  
<script>
import { mapGetters } from 'vuex';
import store from '@/plugins/store';

export default {
    data() {
      return {
        search: '',
        selected: [],
        dialog: false,
        dialogDelete: false,
        itemsPerPage: 5,
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
        ...mapGetters('taskM', {
        tasks: 'getTasksFromMe',
        //sordedTasks: 'getSortedTasksFromMe',
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'Новая задача' : 'Редактирование задачи'
      },
    },
    components: {

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