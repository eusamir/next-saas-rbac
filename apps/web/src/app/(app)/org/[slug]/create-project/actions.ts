'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const createProjectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please include at least 4 characteres.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = createProjectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const erros = result.error.flatten().fieldErrors

    return { success: false, message: null, erros }
  }

  const { description, name } = result.data

  const org = (await getCurrentOrg()) as string

  try {
    await createProject({
      org,
      description,
      name,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, erros: null }
    }

    return {
      success: false,
      message: 'Error saving the Project.',
      erros: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the Project.',
    erros: null,
  }
}
