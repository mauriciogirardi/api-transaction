import { Knex, knex as setupKnex } from 'knex'

import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_NAME,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
