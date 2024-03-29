import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'

import { knex } from '../database'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

const ITEMS_PER_PAGE = '10'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async () => [checkSessionIdExist])

  app.get('/:id', async (request, reply) => {
    const sessionId = request.cookies.sessionId
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    if (!transaction) {
      return reply.send({ message: 'Not found transaction!' })
    }

    return reply.status(200).send({ transaction })
  })

  app.put('/:id', async (request, reply) => {
    const schemaBody = z.object({
      title: z
        .string({
          required_error: 'Title is required.',
        })
        .min(3, 'Title must have 3 characters.'),
      amount: z.coerce
        .number({
          required_error: 'Amount is required.',
          invalid_type_error: 'Amount is required.',
        })
        .min(1, 'Amount must be less than 0.'),
      type: z.enum(['credit', 'debit'], {
        required_error: 'Type is required.',
      }),
    })

    const sessionId = request.cookies.sessionId
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(request.params)
    const { amount, title, type } = schemaBody.parse(request.body)

    const response = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .update({
        ...(amount &&
          type && { amount: type === 'credit' ? amount : amount * -1 }),
        title,
      })

    if (response === 0) {
      return reply.status(401).send({ message: 'Unauthorized!' })
    }

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const sessionId = request.cookies.sessionId
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(request.params)

    const response = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .delete()

    if (response === 0) {
      return reply.status(401).send({ message: 'Unauthorized!' })
    }

    return reply.status(204).send()
  })

  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId
    const schemaQuery = z.object({
      page: z.string().default('1'),
      perPage: z
        .string()
        .default(ITEMS_PER_PAGE)
        .transform((item) => Number(item)),
    })

    const { page: pageQuery, perPage } = schemaQuery.parse(request.query)

    const page = parseInt(pageQuery) || 1
    const offset = (page - 1) * perPage

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()
      .limit(perPage)
      .offset(offset)

    const totalCount = await knex('transactions')
      .where('session_id', sessionId)
      .count({ count: '*' })
      .first()

    const totalTransactions = parseInt(String(totalCount?.count))

    const totalPages = Math.ceil(totalTransactions / perPage)

    return reply.status(200).send({
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions,
      perPage,
    })
  })

  app.post('/', async (request, reply) => {
    const schemaBody = z.object({
      title: z
        .string({
          required_error: 'Title is required.',
        })
        .min(3, 'Title must have 3 characters.'),
      amount: z.coerce
        .number({
          required_error: 'Amount is required.',
          invalid_type_error: 'Amount is required.',
        })
        .min(1, 'Amount must be less than 0.'),
      type: z.enum(['credit', 'debit'], {
        required_error: 'Type is required.',
      }),
    })

    const { title, amount, type } = schemaBody.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.get('/summary', async (request, reply) => {
    const sessionId = request.cookies.sessionId
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return reply.status(200).send({ summary })
  })
}
