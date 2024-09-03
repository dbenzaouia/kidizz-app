<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Kiddiz</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      density="compact"
      v-if="isLoggedIn"
      @click="logout"
      color="white"
      icon="mdi-logout"
    ></v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    const isLoggedIn = computed(() => !!userStore.username)
    const router = useRouter()

    const logout = () => {
      router.push('/')
    }

    return {
      logout,
      isLoggedIn
    }
  }
})
</script>

<style scoped></style>
