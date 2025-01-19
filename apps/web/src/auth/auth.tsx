import { cookies } from 'next/headers'

export async function IsAuthenticated() {
  const cookie = await cookies()

  return !!cookie.get('token')?.value
}
