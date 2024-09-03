import axios, { type AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

interface User {
  id: number;
  username: string;
  email: string;
}

export default {
  getUser(username: string): Promise<AxiosResponse<User>> {
    return apiClient.get(`/user?username=${username}`);
  },
  createUser(email: string, username: string): Promise<AxiosResponse<User>> {
    return apiClient.put('/user', { email, username });
  },
};
