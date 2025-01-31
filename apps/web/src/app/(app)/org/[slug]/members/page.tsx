import { ability } from '@/auth/auth'

import { Invites } from './invites'
import MemberList from './members-list'

export default async function MemberPage() {
  const permission = await ability()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>

      <div className="space-y-4">
        {permission?.can('get', 'Invite') && <Invites />}
        {permission?.can('get', 'Invite') && <MemberList />}
      </div>
    </div>
  )
}
