'use server'

import { type Role, roleSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid e-mail adress.' }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const erros = result.error.flatten().fieldErrors

    return { success: false, message: null, erros }
  }

  const { email, role } = result.data

  try {
    await createInvite({
      email,
      role,
      org: currentOrg!,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, erros: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      erros: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite.',
    erros: null,
  }
}

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await removeMember({ memberId, org: currentOrg! })

  revalidateTag(`${currentOrg}/members`)
}
export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = await getCurrentOrg()

  await updateMember({ memberId, org: currentOrg!, role })

  revalidateTag(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = await getCurrentOrg()

  await revokeInvite({ inviteId, org: currentOrg! })

  revalidateTag(`${currentOrg}/invites`)
}
