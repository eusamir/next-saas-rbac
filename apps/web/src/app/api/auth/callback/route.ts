import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code not found.' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({ code })

  const storeCookie = await cookies()

  storeCookie.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const inviteId = storeCookie.get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)

      storeCookie.delete('inviteId')
    } catch {}
  }

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'

  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
