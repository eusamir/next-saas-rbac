'use server'

import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githSignInUrl.searchParams.set('client_id', 'Ov23liSXDbL4WbHCjMte')
  githSignInUrl.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  githSignInUrl.searchParams.set('scope', 'user')

  redirect(githSignInUrl.toString())
}
