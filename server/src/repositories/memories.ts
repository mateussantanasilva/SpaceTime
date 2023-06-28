import { prisma } from '../lib/prisma'

export default function memoriesRepository() {
  interface MemorySchema {
    userId: string
    content: string
    coverUrl: string
    isPublic: boolean
  }

  async function getMemoriesByUser(userId: string) {
    const memories = await prisma.memory.findMany({
      where: {
        userId, // jwt identifier present in any request - specified in auth.d.ts
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories
  }

  async function getMemoryById(id: string) {
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  }

  async function createMemory({
    content,
    coverUrl,
    isPublic,
    userId,
  }: MemorySchema) {
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId,
      },
    })

    return memory
  }

  async function updateMemory(
    { content, coverUrl, isPublic }: MemorySchema,
    id: string,
  ) {
    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  }

  async function deleteMemory(id: string) {
    await prisma.memory.delete({
      where: {
        id,
      },
    })
  }

  return {
    getMemoriesByUser,
    getMemoryById,
    createMemory,
    updateMemory,
    deleteMemory,
  }
}
