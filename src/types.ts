export interface Childcare {
  id: number
  name: string
  creator: User
}

export interface User {
  id: number
  email: string
  username: string
}

export interface Child {
  id: number
  firstname: string
  lastname: string
  creator: User
}
