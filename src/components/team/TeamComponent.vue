<template>
  <v-card
    color="#A8E4A0"
    width="100%"
    @click="goToProjects"
    height="200"
    rounded="xl"
    class="team-card elevation-0"
  >
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-menu class="team-card-menu" location="end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="currentUser.roles.includes('manager') || currentUser.roles.includes('administrator')"
            v-bind="props"
            class="team-card-menu-btn"
            size="small"
            color="surface-variant" 
            variant="text" 
            icon="mdi-dots-horizontal"
          ></v-btn>
        </template>
      <v-list>
        <v-list-item
          class="team-card-menu-list-item-edit"
          @click="showEdit = !showEdit"
        >
          <v-list-item-title>Изменить</v-list-item-title>
        </v-list-item>

        <v-list-item
          class="team-card-menu-list-item-delete"
          @click="showDelete = !showDelete"
        >
          <v-list-item-title>Удалить</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-card-actions>

    <v-card-title class="team-card-title">{{ team.title }}</v-card-title>

    <v-card-subtitle class="team-card-subtitle">{{ team.body }}</v-card-subtitle>

    <v-dialog
      v-model="showEdit"
      class="team-card-dialog-edit"
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
                  label="Исполнители"
                  :items="usersWithID"
                  item-title="nameWithID"
                  item-value="uid"
                  v-model="teamExecutorsID"
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
      class="team-card-dialog-delete"
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
          teamTitle: this.team.title,
          teamSubtitle: this.team.body,
          teamExecutorsID: this.team.users.map(user => user.uid),

          titleRules: [
              v => !!v || 'Требуется название',
              v => v.length <= 30 || 'Название должно быть меньше 30 символов',
          ],
          textRules: [
              v => (v)? v.length <= 300 : true || 'Описание должно быть меньше 300 символов',
          ],
      }
  },
  props: {
    team: {
      type: Object,
      required: true
    },
    allUsers: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  methods: {
    async editTeam() {
      const { valid } = await this.$refs.editTeamForm.validate();
      if(valid) {
        await store.dispatch('teamM/editTeam', { id: this.team.id, title: this.teamTitle, body: this.teamSubtitle, usersUID: this.teamExecutorsID});
      }
      else alert("NOT validate");
    },
    async deleteTeam() {
      await store.dispatch('teamM/deleteTeam', { id: this.team.id });
    },
    goToProjects() {
      this.$router.push({ name: 'projects', params: { teamID: this.team.id } });
    },
  },
  computed: {
    usersWithID() {
      return this.allUsers.map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
    },
  },
}
</script>