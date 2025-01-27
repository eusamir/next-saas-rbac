import { api } from './api-client'

interface CreateProjectWithPasswordRequest {
  name: string
  description: string
  org: string
}

type CreateProjectWithPasswordResponse = never

export async function createProject({
  org,
  name,
  description,
}: CreateProjectWithPasswordRequest): Promise<CreateProjectWithPasswordResponse> {
  const result = await api
    .post(`organizations/${org}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<CreateProjectWithPasswordResponse>()

  return result
}
