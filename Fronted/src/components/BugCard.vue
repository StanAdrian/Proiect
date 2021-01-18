<template>
  <v-card color="amber darken-4" class="mb-2">
    <v-card-title>Bug #{{ bug.id }} - {{ bug.status }}</v-card-title>
    <v-card-subtitle>{{ bug.description }}</v-card-subtitle>
    <v-card-text>
      <p v-if="bug.status === 'ASSIGNED'">Assigned to: {{ bug.assignedUserEmail }}</p>
      <p>
        Commit:
        <a :href="bug.commitUrl">{{ bug.commitUrl }}</a>
      </p>
      <p v-if="bug.solveCommitUrl">
        Solve Commit:
        <a :href="bug.solveCommitUrl">{{ bug.solveCommitUrl }}</a>
      </p>
      <p>
        Severity:
        <v-rating
          style="display: inline-block"
          empty-icon="mdi-star-outline"
          full-icon="mdi-star"
          dense
          half-icon="mdi-star-half-full"
          readonly
          length="5"
          size="20"
          :value="bug.severity"
        ></v-rating>
      </p>
      <p>
        Priority:
        <v-rating
          style="display: inline-block"
          empty-icon="mdi-star-outline"
          full-icon="mdi-star"
          half-icon="mdi-star-half-full"
          readonly
          dense
          length="5"
          size="20"
          :value="bug.priority"
        ></v-rating>
      </p>
      <v-text-field v-if="isBugAssignedToMe" label="Solve url" v-model="solveUrl"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" v-if="bug.status === 'CREATED'" @click="assignBug">
        Assign
      </v-btn>
      <v-btn color="success" v-if="isBugAssignedToMe" @click="solveBug">
        Solve
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from '@/api'

export default {
  name: 'BugCard',
  props: {
    bug: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    solveUrl: '',
  }),
  computed: {
    isBugAssignedToMe() {
      return this.bug.status === 'ASSIGNED' && this.bug.assignedUserId === JSON.parse(localStorage.user)?.id
    },
  },
  methods: {
    assignBug() {
      api()
        .post('/assign-bug', { bugId: this.bug.id })
        .then(() => this.$emit('refresh'))
        .catch(console.log)
    },
    solveBug() {
      if (this.solveUrl)
        api()
          .post('/update-bug-status', { bugId: this.bug.id, solveCommitUrl: this.solveUrl })
          .then(() => this.$emit('refresh'))
          .catch(console.log)
      else alert('Solve Url cannot be empty')
    },
  },
}
</script>
