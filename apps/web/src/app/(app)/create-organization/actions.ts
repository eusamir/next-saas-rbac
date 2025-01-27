'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createOrganization } from '@/http/create-organizations'

const createOrganizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please include at least 4 characteres.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please enter a valid domain.' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is requeired when auto-join is enabled.',
      path: ['domain'],
    },
  )

export async function createOrganizationAction(data: FormData) {
  const result = createOrganizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const erros = result.error.flatten().fieldErrors

    return { success: false, message: null, erros }
  }

  const { domain, name, shouldAttachUsersByDomain } = result.data

  try {
    await createOrganization({
      domain,
      name,
      shouldAttachUsersByDomain,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, erros: null }
    }

    return {
      success: false,
      message: 'Error saving the organization.',
      erros: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the organization.',
    erros: null,
  }
}
