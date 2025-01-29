import { api } from './api-client'

interface UpdateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  org: string
}

type UpdateOrganizationResponse = never

export async function updateOrganization({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationRequest> {
  const result = await api
    .put(`organization/${org}`, {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<UpdateOrganizationResponse>()

  return result
}
