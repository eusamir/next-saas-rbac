import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-id' })

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user-id' })

// const userCanInvateSomeoneElse = ability.can('invite', 'User')
// const userCanDeleteOtherUsers = ability.can('invite', 'User')

// console.log(userCanInvateSomeoneElse)
// console.log(userCanDeleteOtherUsers)

console.log(ability.can('delete', project))
