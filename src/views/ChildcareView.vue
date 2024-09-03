<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="exportAllChildren">Exporter toutes les données enfant</v-btn>

      </v-col>
    </v-row>
    <v-row>
      <v-col> <v-btn color="primary" @click="openCreateDialog">Ajouter une crèche</v-btn> </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="childcares" item-key="id">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Liste de crèches</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon @click="viewDetails(item.id)" class="mr-2">mdi-eye</v-icon>
        <v-icon @click="deleteChildcare(item.id)" class="mr-2">mdi-delete</v-icon>
        <v-btn @click="exportChildrenForChildcare(item.id)">Exporter</v-btn>

      </template>
    </v-data-table>
    <v-dialog v-model="createDialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Ajouter une nouvelle crèche</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newChildcare.name" label="Name" outlined required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="createChildcare">Create</v-btn>
          <v-btn @click="createDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useChildcareStore } from '../stores/childcare'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const childcareStore = useChildcareStore()
    const userStore = useUserStore()
    const router = useRouter()

    const createDialog = ref(false)
    const newChildcare = ref({ name: '' })
    const headers = [
      { title: 'Name', value: 'name' },
      { title: 'Actions', value: 'action', sortable: false }
    ]
    const childcares = ref(childcareStore.childcares)
    const fetchChildcares = async () => {
      const response = await childcareStore.fetchChildcares()
      if (response) {
        childcares.value = response
      }
    }

    const openCreateDialog = () => {
      createDialog.value = true
    }

    const createChildcare = async () => {
      if (!userStore.username) {
        throw new Error('User not logged in')
      }
      if (newChildcare.value.name && userStore.username) {
        await childcareStore.createChildCare(newChildcare.value.name, userStore.username)
        createDialog.value = false
        await fetchChildcares()
      }
    }

    const deleteChildcare = async (id: number) => {
      if (!userStore.username) {
        throw new Error('User not logged in')
      }
      await childcareStore.deleteChildcare(id, userStore.username)
      await fetchChildcares()
    }

    const viewDetails = (id: number) => {
      router.push(`/childcare/${id}/children`)
    }

    const exportAllChildren = async () => {
      try{
      await childcareStore.exportChildren(undefined)
      } catch (error) {
        console.error('Error exporting all children:', error);
      }
    }

    const exportChildrenForChildcare = (id: number) => {
      childcareStore.exportChildren(id)
    }

    onMounted(fetchChildcares)

    return {
      createDialog,
      newChildcare,
      headers,
      childcares,
      openCreateDialog,
      createChildcare,
      deleteChildcare,
      viewDetails,
      exportAllChildren,
      exportChildrenForChildcare
    }
  }
})
</script>
