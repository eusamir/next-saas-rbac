import type { Role } from '@saas/auth'

import { api } from './api-client'
interface UpdateMemeberRequest {
  org: string
  memberId: string
  role: Role
}
export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemeberRequest) {
  await api.put(`organizations/${org}/members/${memberId}`, { json: { role } })
}
