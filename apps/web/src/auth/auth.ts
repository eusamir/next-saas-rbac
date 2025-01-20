'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export async function IsAuthenticated() {
  const cookie = await cookies()
  return !!cookie.get('token')?.value
}

export async function auth() {
  const cookie = await cookies()
  const token = cookie.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}
  redirect('/api/auth/sign-out')
}
