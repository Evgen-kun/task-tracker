<template>
    <v-form v-model="valid" @submit.prevent="onSubmit">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="login"
              :rules="loginRules"
              :counter="10"
              label="Login"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col
          cols="12"
          sm="4"
        >
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="show1 ? 'text' : 'password'"
            name="pass"
            label="Password"
            hint="At least 3 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
        </v-row>
        <v-row>
            <v-col
            cols="12"
            sm="4"
            >
                <v-btn variant="tonal" type="submit">Button</v-btn>
            </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>

<script>
    import { RouterLink, RouterView } from 'vue-router'
    export default {
        name: "login",
        data() {
            return {
                login: '',
                password: '',
                valid: false,
                loginRules: [
                    v => !!v || 'Login is required',
                    v => v.length <= 10 || 'Login must be less than 10 characters',
                ],
                passwordRules: {
                    required: value => !!value || 'Required.',
                    min: v => v.length >= 3 || 'Min 3 characters',
                    emailMatch: () => (`The email and password you entered don't match`),
                },
            }
        },
        methods: {
            onSubmit() {
                console.log("Yes");
                console.log(this.login);
                console.log(this.password);
                this.$store.dispatch('authM/onLogin', {
                    login: this.login,
                    password: this.password
                }).then(() => {
                    this.$router.push({ name: 'home' })
                })
            }
        }
    }
</script>