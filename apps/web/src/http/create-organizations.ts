import { api } from './api-client'

interface CreateOrganizationWithPasswordRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateOrganizationWithPasswordResponse = never

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationWithPasswordRequest): Promise<CreateOrganizationWithPasswordResponse> {
  const result = await api
    .post('organization', {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<CreateOrganizationWithPasswordResponse>()

  return result
}
