'use server'

import { randomInt } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ensureDbUser } from '@/lib/ensure-user'

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const SESSION_CODE_LENGTH = 8
const SESSION_CODE_PATTERN = /^[A-Z0-9]{4,8}$/

function normalizeSessionCode(value: unknown) {
  if (typeof value !== 'string') throw new Error('Invalid session code')
  const code = value.trim().toUpperCase()
  if (!SESSION_CODE_PATTERN.test(code)) throw new Error('Invalid session code')
  return code
}

function createSessionCode() {
  return Array.from({ length: SESSION_CODE_LENGTH }, () =>
    CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  ).join('')
}

export async function createSession() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await ensureDbUser(userId)

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = createSessionCode()
    try {
      await db.watchSession.create({
        data: {
          code,
          hostId: userId,
          members: { create: { userId } },
        },
      })
      revalidatePath(`/swipe/${code}`)
      return { code }
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error
      }
    }
  }
  throw new Error('Could not create a unique session code')
}

export async function joinSession(value: unknown) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const code = normalizeSessionCode(value)
  await ensureDbUser(userId)

  const session = await db.watchSession.findUnique({
    where: { code },
    select: {
      id: true,
      code: true,
      status: true,
      members: { select: { userId: true } },
    },
  })

  if (!session || session.status !== 'active') throw new Error('Session not found')

  const isMember = session.members.some(m => m.userId === userId)
  if (!isMember) {
    await db.watchSessionMember.create({
      data: {
        sessionId: session.id,
        userId
      }
    })
  }

  revalidatePath(`/swipe/${session.code}`)
  return { code: session.code }
}

export async function getSessionMembers(value: unknown) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const code = normalizeSessionCode(value)

  const session = await db.watchSession.findUnique({
    where: { code },
    select: {
      id: true,
      members: {
        select: {
          userId: true,
          user: { select: { name: true, imageUrl: true } },
        },
      },
    },
  })
  if (!session || !session.members.some((member) => member.userId === userId)) {
    throw new Error('Session not found')
  }

  return session.members
}
