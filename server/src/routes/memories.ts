import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import memoriesRepository from '../repositories/memories'

export default async function memoriesRoutes(app: FastifyInstance) {
  const repository = await memoriesRepository()

  app.addHook('preHandler', async (request) => {
    await request.jwtVerify() // before request, check the jwt
  })

  app.get('/memories', async (request) => {
    const memories = await repository.getMemoriesByUser(request.user.sub)

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        content: memory.content.substring(0, 115).concat('...'), // limit amount of characters
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await repository.getMemoryById(id)

    if (!memory.isPublic && memory.userId !== request.user.sub)
      return reply.status(401).send('Unauthorized for reading memory')

    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), // transform to boolean
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    const userId = request.user.sub

    const memory = await repository.createMemory({
      content,
      coverUrl,
      isPublic,
      userId,
    })

    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await repository.getMemoryById(id)

    if (memory.userId !== request.user.sub)
      return reply.status(401).send('Unauthorized for reading memory')

    memory = await repository.updateMemory(
      {
        content,
        coverUrl,
        isPublic,
        userId: '',
      },
      id,
    )

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await repository.getMemoryById(id)

    if (memory.userId !== request.user.sub)
      return reply.status(401).send('Unauthorized for reading memory')

    await repository.getMemoryById(id)
  })
}
