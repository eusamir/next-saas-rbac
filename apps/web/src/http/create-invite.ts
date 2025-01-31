import { api } from './api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: string
}

type CreateInviteResponse = never

export async function createInvite({
  org,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  const result = await api
    .post(`organization/${org}/invites`, {
      json: {
        email,
        role,
      },
    })
    .json<CreateInviteResponse>()

  return result
}
