import { FastifyInstance } from 'fastify'
import uploadService from '../services/upload'

export default async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const uploadedFile = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    })
    if (!uploadedFile) return reply.status(400).send('File not uploaded')

    const fileUrl = await uploadService(request, reply, uploadedFile)
    console.log(fileUrl)
    return fileUrl
  })
}
