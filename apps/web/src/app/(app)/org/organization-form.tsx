'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { useFormState } from '@/app/hooks/use-form-state'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  createOrganizationAction,
  type OrganizationSchema,
  updateOrganizationAction,
} from './actions'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  const [{ erros, message, success }, handleSubmit, isPending] =
    useFormState(formAction)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save in failed</AlertTitle>
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
        <Label htmlFor="name">Organization name</Label>
        <Input
          name="name"
          type="name"
          id="name"
          defaultValue={initialData?.name}
        />
        {erros?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="example.com"
          defaultValue={initialData?.domain ?? undefined}
        />
        {erros?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {erros.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y1">
        <div className="flex items-baseline space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
            className="translate-y-0.5"
            defaultChecked={initialData?.shouldAttachUsersByDomain}
          />
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span>Auto joint new members</span>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same e-mail domain
              to this organization
            </p>
          </label>
        </div>
      </div>
      {erros?.shouldAttachUsersByDomain && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400">
          {erros.shouldAttachUsersByDomain[0]}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 /> : 'Save organization'}
      </Button>
    </form>
  )
}
