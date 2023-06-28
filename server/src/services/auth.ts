import axios from 'axios'
import { z } from 'zod'
import authRepository from '../repositories/auth'

export default async function authService(code: string) {
  const repository = authRepository()

  const accessTokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    null, // body
    {
      // configs
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        // metadatas
        Accept: 'application/json',
      },
    },
  )
  const { access_token } = accessTokenResponse.data

  const userResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  const userSchema = z.object({
    id: z.number(),
    login: z.string(),
    name: z.string(),
    avatar_url: z.string().url(),
  })
  const userInfo = userSchema.parse(userResponse.data)

  let user = await repository.getUserById(userInfo.id)
  if (!user) user = await repository.createUser(userInfo)

  return user
}
