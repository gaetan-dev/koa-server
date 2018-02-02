const app = require('../../src/boot').default
const request = require('supertest').agent(app.listen())

describe('routes : index', () => {
  describe('GET /', () => {
    it('should return json', async () => {
      const response = await request.get('/')
      expect(response.status).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body.status).toBe('success')
      expect(response.body.message).toBe('hello world')
    })
  })
})
