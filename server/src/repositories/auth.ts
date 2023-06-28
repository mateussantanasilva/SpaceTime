import { prisma } from '../lib/prisma'

export default function authRepository() {
  interface UserSchema {
    id: number
    login: string
    name: string
    avatar_url: string
  }

  async function getUserById(githubId: number) {
    const user = await prisma.user.findUnique({
      where: {
        githubId,
      },
    })

    return user
  }

  async function createUser({ id, name, login, avatar_url }: UserSchema) {
    const user = await prisma.user.create({
      data: {
        githubId: id,
        login,
        name,
        avatarUrl: avatar_url,
      },
    })

    return user
  }

  return {
    getUserById,
    createUser,
  }
}
