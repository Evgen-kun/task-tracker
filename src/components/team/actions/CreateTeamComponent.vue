<template>
    <v-card
    color="#A5A8E9"
    max-width="300"
    min-width="250"
    @click="show = !show"
    height="200"
  >

    <!--<v-img
      src="../assets/plus4.png"
    ></v-img>-->

   <v-card-title>{{ title }}</v-card-title>

   <v-dialog
      v-model="show"
      max-width="1000"
      transition="dialog-top-transition"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            title="Создание команды"
          ></v-toolbar>
          <v-card-text>
            <v-form ref="createTeamForm" @submit.prevent="createTeam">
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
                  :items="usersWithID"
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
                  >Создать</v-btn>
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
                title: "Создать команду",

                teamTitle: "",
                teamSubtitle: "",
                teamExecutors: [],

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
            allUsers: {
              type: Array,
              required: true
            },
        },
        methods: {
            async createTeam() {
                const { valid } = await this.$refs.createTeamForm.validate();

                if(valid) {
                    await store.dispatch('teamM/createTeam', { title: this.teamTitle, body: this.teamSubtitle, usersUID: this.teamExecutors});
                    this.$refs.createTeamForm.reset();
                    this.$refs.createTeamForm.resetValidation();
                }
                else alert("NOT validate");
                console.log(this.teamExecutors);
            },
            showTeam() {
                console.log(this.teamTitle);
                console.log(this.teamSubtitle);
                console.log(this.teamExecutors);
            },
        },
        computed: {
            usersWithID() {
                return this.allUsers.map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
            },
        }
    }
</script>
