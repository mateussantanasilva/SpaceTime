import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import authService from '../services/auth'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)
    const user = await authService(code)

    const token = app.jwt.sign(
      {
        // publi infos
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id, // identifier
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
