'use server'

import { cache } from 'react'
import { auth } from '.'
import { headers } from 'next/headers'

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  return session
})
