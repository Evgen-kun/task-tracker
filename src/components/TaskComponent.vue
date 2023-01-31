<template>
    <v-card
    class="mx-auto mt-8"
    color="#26c6da"
    theme="dark"
    max-width="400"
    prepend-icon="mdi-alert-octagon-outline"
  >

    <template v-slot:prepend>
      <v-icon size="x-large"></v-icon>
    </template>

    <v-card-text class="text-h4 py-2">
      {{ title }}
    </v-card-text>

    <v-card-text class="text-h5 py-2">
      {{ body }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            color="grey-darken-3"
            :image=image
          ></v-avatar>
        </template>

        <v-list-item-title>{{ author }}</v-list-item-title>

        <v-list-item-subtitle>Назначил задачу</v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-btn>Добавить ответ</v-btn>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            title: String,
            body: String,
            author: String,
            image: Image,
        },
        methods: {
            
        }
    }
</script>