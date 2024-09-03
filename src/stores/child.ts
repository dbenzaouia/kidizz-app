import { defineStore } from 'pinia'
import axios from 'axios'
import type { Child } from '@/types'

export const useChildStore = defineStore('child', {
  state: () => ({
    children: [] as Array<Child>
  }),
  actions: {
    async fetchChildren(childcareId: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/child-care/${childcareId}/children`
        )
        this.children = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching children:', error)
      }
    },

    async createChild(firstname: string, lastname: string, childcareId: string, username: string) {
      try {
        const response = await axios.post(
          'http://localhost:3000/child',
          {
            firstname,
            lastname,
            childcareId
          },
          {
            headers: {
              'X-Auth': username
            }
          }
        )
        this.children.push(response.data)
      } catch (error) {
        console.error('Error creating child:', error)
      }
    },

    async removeChild(childcareId: string, childId: number, username: string) {
      try {
        await axios.delete(`http://localhost:3000/child-care/${childcareId}/child/${childId}`, {
          headers: {
            'X-Auth': username
          }
        })
        this.children = this.children.filter((child) => child.id !== childId)
      } catch (error) {
        console.error('Error deleting child assignment:', error)
      }
    },
  }
})
