<template>
  <v-container>
    <v-row>
      <v-col v-for="project in projects" :key="project.id" :cols="12">
        <project-card :project="project" @refresh="getProjects" @add-bug="showAddBugDialog(project.id)" />
      </v-col>
    </v-row>
    <add-bug-dialog
      v-if="showBugDialogValue"
      :projectId="bugProjectId"
      :value="showBugDialogValue"
      @close="handleBugDialogClose"
    />
    <add-project-dialog
      v-if="showAddProjectDialogValue"
      :users="users"
      @close="handleCloseAddProjectDialog"
    />
    <v-btn @click="showAddProjectDialogValue = true" color="pink" dark fixed bottom right fab>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import api from '@/api'
import ProjectCard from './ProjectCard.vue'
import AddBugDialog from './AddBugDialog.vue'
import AddProjectDialog from './AddProjectDialog.vue'

export default {
  name: 'Dashboard',
  components: {
    ProjectCard,
    AddBugDialog,
    AddProjectDialog,
  },
  data: () => ({
    projects: [],
    bugProjectId: null,
    users: [],
    showBugDialogValue: false,
    showAddProjectDialogValue: false,
  }),
  mounted() {
    this.getProjects()
    this.getUsers()
  },
  methods: {
    showAddBugDialog(projectId) {
      this.bugProjectId = projectId
      this.showBugDialogValue = true
    },
    handleBugDialogClose() {
      this.showBugDialogValue = false
      this.bugProjectId = null
      this.getProjects()
    },
    handleCloseAddProjectDialog() {
      this.showAddProjectDialogValue = false
      this.getProjects()
    },
    getProjects() {
      api()
        .get('/projects')
        .then(({ data }) => (this.projects = data))
    },
    getUsers() {
      api()
        .get('/users')
        .then(({ data }) => (this.users = data))
    },
  },
}
</script>
