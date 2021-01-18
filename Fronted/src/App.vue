<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>Bug tracker</h2>
      </div>
      <v-spacer></v-spacer>
      <span class="mr-3">{{ getUserEmail() }}</span>
      <v-btn v-if="hasJwt()" color="indigo" rounded small @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  methods: {
    hasJwt() {
      return localStorage.jwt
    },
    getUserEmail() {
      return localStorage.user && JSON.parse(localStorage.user)?.email
    },
    logout() {
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      this.$router.push({ name: 'login' })
    },
  },
}
</script>
