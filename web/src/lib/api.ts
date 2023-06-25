import axios from 'axios'

export const api = axios.create({
  // baseURL: 'http://localhost:3333', // : only use in development environment
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})
