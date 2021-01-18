<template>
  <v-dialog :value="value" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Bug</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="bug.description" label="Description" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                v-model="bug.commitUrl"
                label="Commit URL"
                required
                hint="Enter the commit that has the issue"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <span class="mr-2" style="width: 50px; display: inline-block">Severity</span>
              <v-rating
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                dense
                style="display: inline-block"
                half-icon="mdi-star-half-full"
                hover
                length="5"
                size="32"
                v-model="bug.severity"
              ></v-rating>
            </v-col>
            <v-col cols="12">
              <span class="mr-2" style="width: 50px; display: inline-block">Priority</span>
              <v-rating
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                half-icon="mdi-star-half-full"
                hover
                style="display: inline-block"
                dense
                label="Priority"
                length="5"
                size="32"
                v-model="bug.priority"
              ></v-rating>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('close')">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="saveBug">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api'

export default {
  name: 'AddBugDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    bug: {
      severity: 1,
      priority: 1,
      description: '',
      commitUrl: '',
    },
  }),
  methods: {
    saveBug() {
      api()
        .post('/register-bug', { ...this.bug, projectId: this.projectId })
        .then(() => {
          this.$emit('close')
        })
    },
  },
}
</script>
