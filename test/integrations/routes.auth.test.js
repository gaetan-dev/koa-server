const knex = require('../../src/db/connection')
const app = require('../../src/boot').default
const request = require('supertest').agent(app.listen())

beforeEach(() => {
  return knex.migrate.rollback()
  .then(() => { return knex.migrate.latest() })
  .then(() => { return knex.seed.run() })
})

afterEach(() => {
  return knex.migrate.rollback()
})

describe('routes : auth', () => {
  describe('GET /auth/register', () => {
    it('should render the register view', async () => {
      const response = await request.get('/auth/register')
      expect(response.status).toBe(200)
      expect(response.redirect).toBeFalsy()
      expect(response.type).toBe('text/html')
      expect(response.text).toContain('<h1>Register</h1>')
      expect(response.text).toContain('<p><button type="submit">Register</button></p>')
    })
  })

  describe('GET /auth/login', () => {
    it('should render the login view', async () => {
      const response = await request.get('/auth/login')
      expect(response.status).toBe(200)
      expect(response.redirect).toBeFalsy()
      expect(response.type).toBe('text/html')
      expect(response.text).toContain('<h1>Login</h1>')
      expect(response.text).toContain('<p><button type="submit">Log In</button></p>')
    })
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request
      .post('/auth/register')
      .send({
        username: 'Michael',
        password: 'Jordan'
      })
      expect(response.status).toBe(302)
      expect(response.redirect).toBeTruthy()
      expect(response.header.location).toContain('/auth/status')
    })
  })

  describe('POST /auth/login', () => {
    it('should login a user', async () => {
      const response = await request
      .post('/auth/login')
      .send({
        username: 'John',
        password: 'Doe'
      })
      expect(response.status).toBe(302)
      expect(response.redirect).toBeTruthy()
      expect(response.header.location).toContain('/auth/status')
    })
  })
})
