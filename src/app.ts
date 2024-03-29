import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastify from 'fastify'

import { globalError } from './middlewares/global-error'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()
app.register(cookie)
app.register(cors)

app.setErrorHandler(globalError)
app.register(transactionsRoutes, { prefix: 'transactions' })
