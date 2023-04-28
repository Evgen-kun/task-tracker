<template>
  <v-card
    :loading="loading"
    class="mx-auto mt-10 bg-form"
    max-width="350"
    title="Вход в аккаунт"
  >
    <v-form v-model="valid" @submit.prevent="onSubmit">
      <v-container>
        <v-text-field
          v-model="login"
          class="loginField"
          :rules="loginRules"
          :counter="15"
          label="Логин"
          required
        ></v-text-field>
            
        <v-text-field
          v-model="password"
          class="passwordField"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passwordRules.required, passwordRules.min]"
          :type="showPass ? 'text' : 'password'"
          name="pass"
          label="Пароль"
          hint="Минимум 3 символа"
          counter
          @click:append="showPass = !showPass"
        ></v-text-field>

        <v-btn 
          block
          class="loginButton"
          type="submit" 
          color="info" 
          rounded="lg" 
          :loading="loading"
          :disabled="!valid || loading"
        >
          Войти
        </v-btn>

        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          color="info"
          rounded="pill"
        >
          {{ text }}
        </v-snackbar>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
    export default {
        name: "LoginView",
        data() {
            return {
                showPass: false,
                login: '',
                password: '',
                valid: false,
                loginRules: [
                    v => !!v || 'Требуется логин',
                    v => v.length <= 15 || 'Логин должен быть меньше 15 символов',
                ],
                passwordRules: {
                    required: value => !!value || 'Необходим',
                    min: v => v.length >= 3 || 'Минимум 3 символа',
                    emailMatch: () => (`The email and password you entered don't match`),
                },
                loading: false,
                snackbar: false,
                text: "",
                timeout: 2000,
            }
        },
        methods: {
            async validate () {
              const { valid } = await this.$refs.form.validate();
              this.valid = valid;
              //if (valid) alert('Отлично! Ошибок нет');
            },
            async onSubmit() {
              //await this.validate();
              if(this.valid) {
                this.loading = true;
                try {
                  await this.$store.dispatch('authM/onLogin', {
                    login: this.login,
                    password: this.password
                  });
                  await this.$router.push({ name: 'home' });
                  //console.log("router push => home");
                  location.reload();
                } catch (err) {
                  console.log(err);
                  this.text = 'Неизвестное имя или пароль';
                  this.snackbar = true;
                }
                this.loading = false;
              }
              console.log('Есть ошибки');
            },
        },
    }
</script>