'use server'

import { env } from '@saas/env'
import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githSignInUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  )
  githSignInUrl.searchParams.set('scope', 'user')

  redirect(githSignInUrl.toString())
}
