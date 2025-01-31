import { api } from './api-client'
interface RemoveMemeberRequest {
  org: string
  memberId: string
}
export async function removeMember({ org, memberId }: RemoveMemeberRequest) {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
