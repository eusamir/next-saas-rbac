'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { acceptInvite } from '@/http/accept-invite'
import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail adress.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const erros = result.error.flatten().fieldErrors

    return { success: false, message: null, erros }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const setCookie = await cookies()

    setCookie.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    const inviteId = setCookie.get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
      } catch {}
    }
    setCookie.delete('inviteId')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, erros: null }
    }

    console.log(err)

    return {
      success: false,
      message: 'Unexpected error, please try again in a few minutes.',
      erros: null,
    }
  }

  redirect('/')
}
