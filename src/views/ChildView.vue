<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openCreateDialog">Ajouter un enfant</v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="children" item-key="id">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Liste des enfants</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon @click="removeChild(item.id)" class="mr-2">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="createDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Ajouter un nouvel enfant</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newChild.firstname"
            label="Prénom de l'enfant"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="newChild.lastname"
            label="Nom de l'enfant"
            outlined
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="createChild">Ajouter</v-btn>
          <v-btn @click="createDialog = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useChildStore } from '@/stores/child'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const childStore = useChildStore()
    const userStore = useUserStore()
    const route = useRoute()
    const createDialog = ref(false)
    const newChild = ref({ firstname: '', lastname: '' })
    const childcareId = String(route.params.id)
    const children = ref(childStore.children)
    const fetchChildren = async () => {
      const response = await childStore.fetchChildren(childcareId)
      if (response) {
        children.value = response
      }
    }
    const headers = [
      { title: 'Prénom', value: 'firstName' },
      { title: 'Nom', value: 'lastName' },
      { title: 'Actions', value: 'action', sortable: false }
    ]

    onMounted(fetchChildren)

    const openCreateDialog = () => {
      createDialog.value = true
    }

    const createChild = async () => {
      if (!userStore.username) {
        console.error('User not logged in')
        return
      }

      if (newChild.value.firstname && newChild.value.lastname) {
        await childStore.createChild(
          newChild.value.firstname,
          newChild.value.lastname,
          childcareId,
          userStore.username
        )
        createDialog.value = false
        newChild.value = { firstname: '', lastname: '' }
      }
    }

    const removeChild = async (childId: number) => {
      if (!userStore.username) {
        console.error('User not logged in')
        return
      }

      await childStore.removeChild(childcareId, childId, userStore.username)
      await fetchChildren()
    }

    return {
      createDialog,
      newChild,
      children,
      headers,
      openCreateDialog,
      createChild,
      removeChild
    }
  }
})
</script>
