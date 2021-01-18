<template>
  <v-content>
    <v-container fill-height="fill-height">
      <v-layout align-center="align-center" justify-center="justify-center">
        <v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">
            {{ options.isLoggingIn ? 'Login' : 'Register' }}
          </div>
          <v-card light="light">
            <v-card-text>
              <div class="subheading">
                <template v-if="options.isLoggingIn">Pleasae enter your credentials</template>
                <template v-else>Crate a new account</template>
              </div>
              <v-form>
                <v-text-field
                  v-model="user.email"
                  light="light"
                  prepend-icon="mdi-email"
                  label="Email"
                  type="email"
                ></v-text-field>
                <v-text-field
                  v-model="user.password"
                  light="light"
                  prepend-icon="mdi-lock"
                  label="Password"
                  type="password"
                ></v-text-field>
                <br />
                <v-btn
                  color="success"
                  v-if="options.isLoggingIn"
                  @click.prevent="auth('login')"
                  block="block"
                  type="submit"
                >
                  Sign in
                </v-btn>
                <v-btn color="primary" v-else block="block" type="submit" @click.prevent="auth('register')">
                  Sign up
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          <br />
          <div v-if="options.isLoggingIn">
            Don't have an account?
            <v-btn light="light" color="primary" rounded @click="options.isLoggingIn = false">Sign up</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import api from '@/api/index.js'
import decode from 'jwt-decode'

export default {
  data: () => ({
    user: {
      email: '',
      password: '',
    },
    options: {
      isLoggingIn: true,
      shouldStayLoggedIn: true,
    },
  }),
  methods: {
    auth(method) {
      api()
        .post(`/${method}`, { email: this.user.email, password: this.user.password })
        .then(({ data: { token } }) => {
          localStorage.jwt = token
          localStorage.user = JSON.stringify(decode(token))
          this.$router.push({ name: 'dashboard' })
        })
        .catch(console.log)
    },
  },
}
</script>
