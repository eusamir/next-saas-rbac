import { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}

export async function getMembership(slug: string) {
  const result = await api
    .get(`organization/${slug}/auth`)
    .json<GetMembershipResponse>()

  // console.log(result)

  return result
}
