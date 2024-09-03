import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref<string | null>(null)
  const email = ref<string | null>(null)

  const setUser = (user: { username: string; email: string }) => {
    username.value = user.username
    email.value = user.email
  }

  const clearUser = () => {
    username.value = null
    email.value = null
  }

  const fetchUser = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:3000/user?username=${username}`)
      if (response.ok) {
        const user = await response.json()
        setUser(user)
        return user
      } else if (response.status === 404) {
        return null
      } else {
        throw new Error('Unexpected response')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  const registerUser = async (username: string, email: string) => {
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          username
        })
      })
      if (response.ok) {
        const user = await response.json()
        setUser(user)
        return user
      } else {
        throw new Error('Failed to register user')
      }
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }

  return {
    username,
    email,
    fetchUser,
    registerUser,
    clearUser
  }
})
