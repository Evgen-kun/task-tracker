<template>
  <v-card
    color="#A8E4A0"
    max-width="300"
    min-width="250"
    @click="showTeam"
    height="200"
  >
    <!-- <v-img
      :src="card.src"
      class="align-end"
      gradient="to bottom, rgba(100,50,0,.1), rgba(0,100,80,.5)"
      height="200px"
      cover
    >
      <v-card-title class="text-white" v-text="card.title"></v-card-title>
    </v-img> -->

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-menu location="end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            color="surface-variant" 
            variant="text" 
            icon="mdi-dots-horizontal"
          ></v-btn>
        </template>
      <v-list>
        <v-list-item
          @click="showEdit = !showEdit"
        >
          <v-list-item-title>Изменить</v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="showDelete = !showDelete"
        >
          <v-list-item-title>Удалить</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-card-actions>

    <v-card-title v-text="title"></v-card-title>

    <v-card-subtitle v-text="body"></v-card-subtitle>

    <v-dialog
      v-model="showEdit"
      max-width="1000"
      transition="dialog-top-transition"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            title="Изменение команды"
          ></v-toolbar>
          <v-card-text>
            <v-form ref="editTeamForm" @submit.prevent="{ editTeam(); isActive.value = false }">
              <v-container>

                <v-text-field
                  label="Название*"
                  v-model="teamTitle"
                  :rules="titleRules"
                  required
                >
                </v-text-field>

                <v-textarea label="Описание" :rules="textRules" v-model="teamSubtitle"></v-textarea>

                <v-select
                  label="Исполнитель*"
                  :items="allUsers"
                  item-title="nameWithID"
                  item-value="id"
                  v-model="teamExecutors"
                  multiple
                >
                </v-select>

                <div><small>*обязательное поле</small></div>

                <v-card-actions class="justify-end">
                  <v-btn
                    type="submit"
                    variant="text"
                  >Изменить</v-btn>
                  <v-btn
                    variant="text"
                    @click="isActive.value = false"
                  >Отмена</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-dialog
      v-model="showDelete"
      max-width="500"
      transition="dialog-top-transition"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            title="Удаление команды"
          ></v-toolbar>

          <v-card-item>
            <v-card-text>Вы действительно хотите удалить команду?</v-card-text>
          </v-card-item>

          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              @click="{ deleteTeam(); isActive.value = false }"
            >Да</v-btn>
            <v-btn
              variant="text"
              @click="isActive.value = false"
            >Нет</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

  </v-card>
</template>
  
<script>
import store from '@/plugins/store';

    export default {
        data() {
            return {
                showEdit: false,
                showDelete: false,
                teamTitle: this.title,
                teamSubtitle: this.body,
                teamExecutors: this.teamUsers,

                titleRules: [
                    v => !!v || 'Требуется название',
                    v => v.length <= 30 || 'Название должно быть меньше 30 символов',
                ],
                textRules: [
                    v => (!!v)? v.length <= 300 : true || 'Описание должно быть меньше 300 символов',
                ],
            }
        },
        props: {
          teamID: String,
          title: String,
          body: String,
          teamUsers: Array,
          allUsers: Array,
        },
        methods: {
            async editTeam() {
                const { valid } = await this.$refs.editTeamForm.validate();

                if(valid) {
                    await store.dispatch('teamM/editTeam', { id: this.teamID, title: this.teamTitle, body: this.teamSubtitle, usersUID: this.teamExecutors});
                }
                else alert("NOT validate");
            },
            async deleteTeam() {
                await store.dispatch('teamM/deleteTeam', { id: this.teamID });
            },
            showTeam() {
                console.log(this.teamTitle);
                console.log(this.teamSubtitle);
                console.log(this.teamExecutors);
            },
        },
    }
</script>