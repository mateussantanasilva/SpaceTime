import axios from 'axios'

export const api = axios.create({
  // baseURL: 'http://localhost:3333', // : only use in development environment
  baseURL: 'https://spacetimeapp.onrender.com',
})
