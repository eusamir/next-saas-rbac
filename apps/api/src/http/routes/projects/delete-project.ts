import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { auth } from '../../middlewares/auth'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'
import { getUserPermissions } from '../../utils/get-users-permissions'
import { projectSchema } from '@saas/auth'

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organization/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Delete a project',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid()
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const project = await prisma.project.findUnique({
          where:{
            id: projectId,
            organizationId: organization.id
          }
        })

        const authProject = projectSchema.parse({
          project,
        })

        if(!project){
          throw new BadRequestError('Project not found')
        }

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to delete this project.'
          )
        }
        
        await prisma.project.delete({
          where: {
            id: project.id,
          },
        })
        return reply.status(204).send()
      }
    )
}
