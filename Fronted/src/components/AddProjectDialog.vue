<template>
  <v-dialog :value="true" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Project</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="project.repoUrl" label="Repo Url" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="project.userIds"
                :items="items"
                outlined
                dense
                chips
                small-chips
                label="Project members"
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveProject">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api'

export default {
  name: 'AddProjectDialog',
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    project: {
      repoUrl: '',
      userIds: [],
    },
  }),
  computed: {
    items() {
      return this.users.map(({ email: text, id: value }) => ({ text, value }))
    },
  },
  methods: {
    saveProject() {
      api()
        .post('/create-project', this.project)
        .then(() => {
          this.$emit('close')
        })
    },
  },
}
</script>
