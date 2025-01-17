import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { auth } from '../../middlewares/auth'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { BadRequestError } from '../_erros/bad-request-error'
import { createSlug } from '../../utils/create-slug'
import { roleSchema } from '@saas/auth'
import { getUserPermissions } from '../../utils/get-users-permissions'
import { UnauthorizedError } from '../_erros/unauthorized-error'

export async function getInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/invites/:inviteId',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get a invite',
          params: z.object({
            inviteId: z.string().uuid()
          }),
          response: {
            200: z.object({
              invite: z.object({
                id: z.string().uuid(),
                createdAt: z.date(),
                role: roleSchema,
                email: z.string().email(),
                organization: z.object({
                  name: z.string()
                }),
                author: z.object({
                  name: z.string().nullable(),
                  id: z.string(),
                  avatarUrl: z.string().url().nullable(),
                }).nullable()
              })
            }),
          },
        },
      },
      async (request) => {
        const {inviteId} = request.params

        const invite = await prisma.invite.findUnique({
          where:{
            id: inviteId
          },
          select:{
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author:{
              select:{
                id: true,
                name: true,
                avatarUrl: true
              }
            },
            organization:{
              select:{
                name: true
              }
            }
          }
        })
        
        if(!invite){
          throw new BadRequestError('Invite not found')
        }

        return {invite}
      })
}
