import { FastifyRequest } from 'fastify/types/request'
import { FastifyReply } from 'fastify/types/reply'
import path, { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export default async function uploadService(
  request: FastifyRequest,
  reply: FastifyReply,
  uploadedFile: any,
) {
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
}
