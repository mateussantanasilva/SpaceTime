import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import authRoutes from './routes/auth'
import memoriesRoutes from './routes/memories'
import uploadRoutes from './routes/upload'
import { resolve } from 'node:path'

const app = fastify()

app.register(multipart)
app.register(require('@fastify/static'), {
  // Make upload folder public for browsers
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true, // every frontend has permission to access our backend
})
app.register(jwt, {
  secret: 'spacetime', // signature to differentiate the generated token
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333

app.listen({ port }).then(() => {
  console.log(`🚀 HTTP server running on port ${port}`)
})
