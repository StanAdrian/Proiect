<template>
  <v-card class="mx-auto" color="primary" dark>
    <v-card-title>
      <span class="title font-weight-light">
        <a style="color: white !important" :href="project.repoUrl">{{ project.repoUrl }}</a>
      </span>
    </v-card-title>
    <v-card-text>
      <h4>{{ getUserRole }}</h4>
      <h3>Members</h3>
      <p class="my-0" v-for="user in project.users" :key="user.id">
        {{ user.email }} -
        <strong>{{ user.UserProject.role }}</strong>
      </p>
      <v-expand-transition>
        <div v-show="showBugs">
          <v-divider class="mt-1"></v-divider>
          <div class="mt-1">
            <v-select :items="['SOLVED', 'CREATED', 'ASSIGNED']" v-model="filterVal"></v-select>
            <bug-card v-for="bug in filteredBugs" :bug="bug" :key="bug.id" @refresh="getBugs"/>
          </div>
        </div>
      </v-expand-transition>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="!getUserRole" @click="registerAsTester" small color="success">Register as tester</v-btn>
      <v-btn v-if="getUserRole === 'TESTER'" small color="success" @click="$emit('add-bug')">
        Add bug
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="getUserRole === 'MP'" text @click="showBugs = !showBugs">
        <v-icon>{{ showBugs ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        Bugs
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from '@/api'
import BugCard from './BugCard.vue'

export default {
  name: 'ProjectCard',
  components: {
    BugCard,
  },
  props: {
    project: {
      type: Object,
      default: undefined,
    },
  },
  data: () => ({
    showBugs: false,
    bugs: [],
    filterVal: 'CREATED',
  }),
  computed: {
    getUserRole() {
      const userId = JSON.parse(localStorage.user).id
      const projectUser = this.project.users.find(({ id }) => id === userId)
      return projectUser?.UserProject.role
    },
    filteredBugs() {
      return this.bugs.filter(({ status }) => status === this.filterVal)
    },
  },
  mounted() {
    if (this.getUserRole === 'MP') this.getBugs()
  },
  methods: {
    getUserFromId(userId) {
      return this.project.users.find(({ id }) => id === userId)?.email
    },
    getBugs() {
      api()
        .get(`/bugs/${this.project.id}`)
        .then(({ data }) => {
          this.bugs = data
          this.bugs.forEach((bug) => (bug.assignedUserEmail = this.getUserFromId(bug.assignedUserId)))
        })
    },
    registerAsTester() {
      api()
        .post('/add-self-as-tester', { projectId: this.project.id })
        .then(() => this.$emit('refresh'))
    },
  },
}
</script>
