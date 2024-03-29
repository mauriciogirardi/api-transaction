import { execSync } from 'node:child_process'

import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../src/app'

describe('List all Transactions', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  it('should be able to list all transactions.', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 2000, type: 'credit' })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    expect(listTransactionResponse.body).toEqual({
      transactions: [
        expect.objectContaining({
          title: 'New Transaction',
          amount: 2000,
        }),
      ],
      currentPage: 1,
      totalPages: 1,
      totalTransactions: 1,
      perPage: 10,
    })
  })
})
