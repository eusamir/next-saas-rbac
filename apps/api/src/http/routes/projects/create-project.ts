import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { auth } from '../../middlewares/auth'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { createSlug } from '../../utils/create-slug'
import { getUserPermissions } from '../../utils/get-users-permissions'
import { UnauthorizedError } from '../_erros/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organization/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a new project',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            `You're not allowed to create a new project.`
          )
        }

        const { description, name } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            slug: createSlug(slug),
            description,
            organizationId: organization.id,
            ownerId: userId,
          },
        })
        return reply.status(201).send({
          projectId: project.id,
        })
      }
    )
}
