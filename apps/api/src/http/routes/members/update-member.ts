import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middlewares/auth'
import { getUserPermissions } from '../../utils/get-users-permissions'
import { UnauthorizedError } from '../_erros/unauthorized-error'
import { prisma } from '../../lib/prisma'
import { roleSchema } from '@saas/auth'

export async function updateMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            `You're not allowed to see update this member.`
          )
        }

        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
          data: {
            role,
          },
        })

        return reply.status(204).send()
      }
    )
}
