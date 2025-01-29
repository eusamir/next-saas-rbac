import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { OrganizationForm } from '../../organization-form'
import { Billing } from './billings'
import { ShutdownOrganizationButton } from './shudown-organization-button'

export default async function Settings() {
  const currentOrg = await getCurrentOrg()
  const permission = await ability()

  const canUpdateOrganization = permission?.can('update', 'Organization')
  const canGetBillings = permission?.can('get', 'Billing')
  const canShutdownOrganization = permission?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrg!)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      {canUpdateOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Organization settings</CardTitle>
            <CardDescription>Update your oganization details</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationForm
              isUpdating={true}
              initialData={{
                name: organization.name,
                domain: organization.domain,
                shouldAttachUsersByDomain:
                  organization.shouldAttachUsersByDomain,
              }}
            />
          </CardContent>
        </Card>
      )}
      {canGetBillings && <Billing />}
      {canShutdownOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown organization</CardTitle>
            <CardDescription>
              This will delete all organization data including all projects. You
              cannot undo this action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
