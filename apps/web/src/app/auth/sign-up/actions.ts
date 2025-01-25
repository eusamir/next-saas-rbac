'use server'

import { HTTPError } from 'ky'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please enter your full name.',
    }),
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail adress.' }),
    password: z
      .string()
      .min(6, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match.',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const erros = result.error.flatten().fieldErrors

    return { sucess: false, message: null, erros }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { sucess: false, message, erros: null }
    }

    console.log(err)

    return {
      sucess: false,
      message: 'Unexpected error, please try again in a few minutes.',
      erros: null,
    }
  }

  redirect('/auth/sign-in')
}
