import { execSync } from 'node:child_process'

import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../src/app'

describe('Create Transaction', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction.', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 2000, type: 'credit' })
      .expect(201)
  })

  it('should be able to validate the title field if it has less than 3 characters.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ title: 'Ne', amount: 2000, type: 'credit' })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({
      message: 'Title must have 3 characters.',
    })
  })

  it('should be able to validate the title if not passed.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ amount: 2000, type: 'credit' })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({ message: 'Title is required.' })
  })

  it('should be able to validate the amount if not passed.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', type: 'credit' })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({
      message: 'Amount is required.',
    })
  })

  it('should be able to validate the amount if value is less than 0.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 0, type: 'credit' })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({
      message: 'Amount must be less than 0.',
    })
  })

  it('should be able to validate the type.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 100 })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({
      message: 'Type is required.',
    })
  })

  it('should be able to validate the type.', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({ title: 'New Transaction', amount: 100, type: 'not' })
      .expect(400)

    expect(JSON.parse(response.text)).toEqual({
      message:
        "Invalid enum value. Expected 'credit' | 'debit', received 'not'",
    })
  })
})
