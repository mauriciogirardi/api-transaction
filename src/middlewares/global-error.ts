import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function globalError(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: error.errors[0].message,
    })
  } else {
    console.error(error)
    reply.status(500).send({
      message: 'Internal server error.',
    })
  }
}
