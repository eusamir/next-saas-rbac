'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

import { useFormState } from '@/app/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/lib/react-query'

import { createProjectAction } from './actions'

export function ProjectForm() {
  const { slug: orgs } = useParams<{ slug: string }>()

  const [{ erros, message, success }, handleSubmit, isPending] = useFormState(
    createProjectAction,
    () => {
      queryClient.invalidateQueries({
        queryKey: [orgs, 'projects'],
      })
    },
  )
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" type="name" id="name" />
        {erros?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Project description</Label>
        <Textarea name="description" id="description" />
        {erros?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Save project'}
      </Button>
    </form>
  )
}
