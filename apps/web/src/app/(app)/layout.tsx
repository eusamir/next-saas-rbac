import { redirect } from 'next/navigation'

import { IsAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await IsAuthenticated())) {
    redirect('/auth/sign-in')
  }
  return <>{children}</>
}
