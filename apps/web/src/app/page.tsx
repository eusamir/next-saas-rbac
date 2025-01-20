import { auth } from '@/auth/auth'

export default async function Home() {
  const { user } = await auth()
  return <p>{JSON.stringify(user, null, 2)}</p>
}
