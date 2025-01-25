import { api } from './api-client'

interface SignUpWithPasswordRequest {
  name: string
  email: string
  password: string
}

type SignUpWithPasswordResponse = never

export async function signUp({
  name,
  email,
  password,
}: SignUpWithPasswordRequest): Promise<SignUpWithPasswordResponse> {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<SignUpWithPasswordResponse>()

  return result
}
