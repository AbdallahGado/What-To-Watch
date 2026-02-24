'use server'

import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createSession() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Generate a random 6-character room code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const session = await db.watchSession.create({
    data: {
      code,
      hostId: userId,
      members: {
        create: { userId }
      }
    }
  })

  revalidatePath(`/swipe/${code}`)
  return session
}

export async function joinSession(code: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const session = await db.watchSession.findUnique({
    where: { code: code.toUpperCase() },
    include: { members: true }
  })

  if (!session) throw new Error('Session not found')

  // Check if already a member
  const isMember = session.members.some(m => m.userId === userId)
  if (!isMember) {
    await db.watchSessionMember.create({
      data: {
        sessionId: session.id,
        userId
      }
    })
  }

  revalidatePath(`/swipe/${code}`)
  return session
}

export async function getSessionMembers(code: string) {
  const session = await db.watchSession.findUnique({
    where: { code: code.toUpperCase() },
    include: { 
      members: {
        include: { user: true }
      }
    }
  })
  
  return session?.members || []
}
