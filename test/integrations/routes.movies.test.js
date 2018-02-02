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

describe('routes : movies', () => {
  describe('GET /api/v1/movies', () => {
    it('should return all movies', async () => {
      const response = await request.get('/api/v1/movies')
      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(response.body.data.length).toBe(3)
      expect(Object.keys(response.body.data[0])).toEqual(
        expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
      )
    })
  })

  describe('GET /api/v1/movies/:id', () => {
    it('should return a single movie', async () => {
      const response = await request.get('/api/v1/movies/1')
      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(Object.keys(response.body.data)).toEqual(
        expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
      )
      expect(response.body.data.id).toEqual(1)
    })
    it('should throw an error if the movie does not exist', async () => {
      const response = await request.get('/api/v1/movies/-1')
      expect(response.status).toBe(404)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('That movie does not exist.')
    })
  })

  describe('POST /api/v1/movies', () => {
    it('should return the movie\'s id that was added', async () => {
      const response = await request.post('/api/v1/movies')
      .send({
        name: 'Titanic',
        genre: 'Drama',
        rating: 8,
        explicit: true
      })
      expect(response.status).toBe(201)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(response.body.data).toBe(4)
    })
    it('should throw an error if the payload is malformed', async () => {
      const response = await request.post('/api/v1/movies')
        .send({
          name: 'Titanic'
        })
      expect(response.status).toBe(500)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('error')
      expect(Boolean(response.body.message)).toBe(true)
    })
  })

  describe('PUT /api/v1/movies', () => {
    it('should return the movie\'s id that was updated', async () => {
      const response = await request.put('/api/v1/movies/1')
      .send({
        rating: 10
      })
      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(response.body.data).toBe(1)
    })
    it('should throw an error if the movie does not exist', async () => {
      const response = await request.put('/api/v1/movies/-1')
      .send({
        rating: 10
      })
      expect(response.status).toBe(404)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('That movie does not exist.')
    })
  })
  describe('DELETE /api/v1/movies/:id', () => {
    it('should return the movie\'s id that was deleted', async () => {
      const response = await request.delete('/api/v1/movies/1')
      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(response.body.data).toBe(1)
    })
    it('should throw an error if the movie does not exist', async () => {
      const response = await request.delete('/api/v1/movies/-1')
      expect(response.status).toBe(404)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('error')
      expect(response.body.message).toBe('That movie does not exist.')
    })
  })
})
