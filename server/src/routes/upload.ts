import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import path, { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export default async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const uploadedFile = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    })

    if (!uploadedFile) return reply.status(400).send('File not uploaded')

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(uploadedFile.mimetype)

    if (!isValidFileFormat)
      return reply.status(400).send('File has no valid format')

    const fileId = randomUUID() // create code for image
    const extension = extname(uploadedFile.filename)
    const fileName = fileId.concat(extension)

    const uploadsDirectory =
      process.env.UPLOADS_DIRECTORY || path.resolve(__dirname, '../../uploads')
    const writeStream = createWriteStream(
      resolve(uploadsDirectory, fileName), // standardizes the path for all operating systems
    )

    await pump(uploadedFile.file, writeStream) // Streams are collections of data that are not loaded all at once.

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return fileUrl
  })
}
