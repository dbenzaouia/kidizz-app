import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Childcare } from '@/types'

export const useChildcareStore = defineStore('childcare', () => {
  const childcares = ref<Childcare[]>([])

  const fetchChildcares = async () => {
    try {
      const response = await axios.get('http://localhost:3000/child-cares')
      childcares.value = response.data
      console.log('fetching', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching childcares:', error)
    }
  }

  const createChildCare = async (name: string, username: string) => {
    await axios.post(
      'http://localhost:3000/child-care',
      { name },
      { headers: { 'X-Auth': username } }
    )
    await fetchChildcares()
  }

  const deleteChildcare = async (id: number, username: string) => {
    await axios.delete(`http://localhost:3000/child-care/${id}`, {
      headers: { 'X-Auth': username }
    })
    await fetchChildcares()
  }

  const exportChildren = async (childcareId?: number) => {
    const url = childcareId
      ? `http://localhost:3000/children/export.csv?childCareId=${childcareId}`
      : 'http://localhost:3000/children/export.csv'

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'blob'
    })

    const urlObject = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = urlObject
    link.setAttribute('download', 'children.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    childcares,
    fetchChildcares,
    createChildCare,
    deleteChildcare,
    exportChildren
  }
})
