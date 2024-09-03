<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col class="text-center">
        <div :class="['text-h2', 'pa-2']" class="mt-5">Welcome to Kidizz</div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" >
      <v-col cols="12" md="6" class="d-flex justify-center">
        <v-form @submit.prevent="handleSubmit" class="login-form">
          <v-text-field
            v-model="username"
            label="Enter your username"
            required
            outlined
          ></v-text-field>

          <v-btn type="submit" color="primary">Login</v-btn>

          <!-- Dialog for Email Registration -->
          <v-dialog v-model="emailDialog" max-width="400">
            <v-card>
              <v-card-title>
                <span class="headline">User Not Found</span>
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="email"
                  label="Enter your email to register"
                  required
                  outlined
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="handleRegister">Register</v-btn>
                <v-btn @click="emailDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const username = ref('')
    const email = ref('')
    const emailDialog = ref(false)

    const handleSubmit = async () => {
      const user = await userStore.fetchUser(username.value)
      if (user) {
        console.log('User found:', user)
        router.push('/childcare')
      } else {
        emailDialog.value = true
      }
    }

    const handleRegister = async () => {
      if (email.value) {
        await userStore.registerUser(username.value, email.value)
        emailDialog.value = false
        router.push('/childcare')
      }
    }

    return {
      username,
      email,
      emailDialog,
      handleSubmit,
      handleRegister
    }
  }
})
</script>
<style scoped>
.v-container.fill-height {
  min-height: 100vh;
  padding: 0;
}

.v-row.fill-height {
  min-height: 100vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
  margin-top: 8rem;
}

.v-typography.mt-5 {
  margin-top: 2rem;
}
</style>
