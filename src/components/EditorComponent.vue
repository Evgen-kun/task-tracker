<template>
    <v-card
    class="mx-auto"
    max-width="550"
    color="blue"
    rounded="xl"
    @click="show = !show"
  >

    <v-card-title>
        {{ title }}
    </v-card-title>

  </v-card>

  <v-dialog 
    v-model="show"
    max-width="1000"
    transition="dialog-top-transition"
  >
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar
              color="primary"
              title="Новая задача"
            ></v-toolbar>
            <v-card-text>
                <v-container>

                    <v-text-field
                        label="Заголовок*"
                        v-model="taskTitle"
                        required
                    >
                    </v-text-field>

                    <v-textarea label="Описание" v-model="text"></v-textarea>

                    <v-select
                        :items="['John', 'Jeff', 'Tom']"
                        label="Исполнитель*"
                        v-model="executor"
                        required
                    >
                    </v-select>

                </v-container>
                <small>*обязательное поле</small>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                variant="text"
                @click="isActive.value = false"
              >Закрыть</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

</template>

<script>
    export default {
        data() {
            return {
                title: "Создать задачу",
                show: false,
                taskTitle: "",
                text: "",
                executor: "",
            }
        },
        props: {

        },
        methods: {
            createTask() {
                alert("create");
            },
        }
    }
</script>