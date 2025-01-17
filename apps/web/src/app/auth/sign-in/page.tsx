import Image from 'next/image'
import Link from 'next/link'

import gitHubIcon from '@/assets/github-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>

      <Link
        href="/auth/forgot-password"
        className="text-xs font-medium text-foreground hover:underline"
      >
        Forgot your password?
      </Link>

      <Button type="submit" className="w-full">
        Sign in with e-mail
      </Button>

      <Button variant="link" className="w-full" asChild size="sm">
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button type="submit" variant={'outline'} className="w-full">
        <Image src={gitHubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign in with github
      </Button>
    </form>
  )
}
