import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { auth } from '../../middlewares/auth'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { BadRequestError } from '../_erros/bad-request-error'
import { UnauthorizedError } from '../_erros/unauthorized-error'
import { getUserPermissions } from '../../utils/get-users-permissions'
import { projectSchema } from '@saas/auth'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organization/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Update a project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string()
          }),
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

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'You are not allowed to update this project.'
          )
        }

        const { description, name } = request.body
        
        await prisma.project.update({
          where: {
            id: project.id,
          },
          data: {
            name,
            description
          }
        })
        return reply.status(204).send()
      }
    )
}
