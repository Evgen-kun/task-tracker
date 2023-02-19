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

      <v-btn size="small" color="surface-variant" variant="text" icon="mdi-dots-horizontal" @click.stop="show = !show"></v-btn>
    </v-card-actions>

    <v-card-title v-text="title"></v-card-title>

    <v-card-subtitle v-text="body"></v-card-subtitle>

    <v-dialog
      v-model="show"
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
            <v-form ref="editTeamForm" @submit.prevent="editTeam">
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
                  item-title="name"
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

  </v-card>
</template>
  
<script>
import store from '@/plugins/store';

    export default {
        data() {
            return {
                show: false,
                teamTitle: this.title,
                teamSubtitle: this.body,
                teamExecutors: this.teamUsers,

                titleRules: [
                    v => !!v || 'Требуется название',
                    v => v.length <= 30 || 'Название должно быть меньше 30 символов',
                ],
                textRules: [
                    v => v.length <= 300 || 'Описание должно быть меньше 300 символов',
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
                    await store.dispatch('teamM/editTeam', { id: this.teamID, title: this.teamTitle, body: this.teamSubtitle, users: this.teamExecutors});
                    this.$refs.editTeamForm.reset();
                    this.$refs.editTeamForm.resetValidation();
                }
                else alert("NOT validate");
            },
            showTeam() {
                console.log(this.teamTitle);
                console.log(this.teamSubtitle);
                console.log(this.teamExecutors);
            },
        },
    }
</script>