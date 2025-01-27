'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useFormState } from '@/app/hooks/use-form-state'
import gitHubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithGithub } from '../actions'
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const [{ erros, message, success }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
  )
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
        </div>

        {erros?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.email[0]}
          </p>
        )}

        <div className="space-y1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />
        </div>

        {erros?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <p> Sign in with e-mail</p>
          )}
        </Button>

        <Button variant="link" className="w-full" asChild size="sm">
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>
      <Separator />
      <form action={signInWithGithub}>
        <Button type="submit" variant={'outline'} className="w-full">
          <Image src={gitHubIcon} alt="" className="mr-2 size-4 dark:invert" />
          Sign in with github
        </Button>
      </form>
    </div>
  )
}
