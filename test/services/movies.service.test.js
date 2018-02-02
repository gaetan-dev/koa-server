const movies = require('../fixtures/movies.json')
const request = require('request')
const sinon = require('sinon')

const base = 'http://localhost:3000'

const that = {}

describe('movie service', () => {
  /**
   * WHEN NOT STUBBED
   */
  describe.skip('when not stubbed', () => {
    describe('GET /api/v1/movies/', () => {
      it('should return all movies', async () => {
        request.get(`${base}/api/v1/movies`, (_, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('success')
          expect(body.data.length).toBe(3)
          expect(Object.keys(body.data[0])).toEqual(
            expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
          )
          expect(body.data[0].id).toBe(1)
          expect(body.data[0].name).toBe('The Land Before Time')
        })
      })
    })
    describe('GET /api/v1/movies/:id', () => {
      it('should return single movie', async () => {
        request.get(`${base}/api/v1/movies/1`, (_, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('success')
          expect(Object.keys(body.data)).toEqual(
            expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
          )
          expect(body.data.id).toBe(1)
          expect(body.data.name).toBe('The Land Before Time')
        })
      })
      it('should throw an error if the movie does not exist', async () => {
        request.get(`${base}/api/v1/movies/1`, (_, res, body) => {
          expect(res.statusCode).toBe(404)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('error')
          expect(body.message).toBe('That movie does not exist.')
        })
      })
    })
    describe('POST /api/v1/movies', () => {
      it('should return the movie\'s id that was added', async () => {
        const options = {
          method: 'post',
          body: {
            name: 'Titanic',
            genre: 'Drama',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/movies`
        }
        request(options, (_, res, body) => {
          expect(res.status).toBe(201)
          expect(res.type).toBe('application/json')
          expect(res.body.status).toBe('success')
          expect(res.body.data).toBe(4)
        })
      })
    })
  })

  /**
   * WHEN STUBBED
   */
  describe('when stubbed', () => {
    beforeEach(() => {
      that.get = sinon.stub(request, 'get')
      that.post = sinon.stub(request, 'post')
    })
    afterEach(() => {
      request.get.restore()
      request.post.restore()
    })
    describe('GET /api/v1/movies/', () => {
      it('should return all movies', async () => {
        that.get.yields(null, movies.all.success.res, JSON.stringify(movies.all.success.body))
        request.get(`${base}/api/v1/movies`, (_, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('success')
          expect(body.data.length).toBe(3)
          expect(Object.keys(body.data[0])).toEqual(
            expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
          )
          expect(body.data[0].id).toBe(4)
          expect(body.data[0].name).toBe('The Land Before Time')
        })
      })
    })
    describe('GET /api/v1/movies/:id', () => {
      it('should return a single movie', async () => {
        const obj = movies.single.success
        that.get.yields(null, obj.res, JSON.stringify(obj.body))
        request.get(`${base}/api/v1/movies/4`, (_, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('success')
          expect(Object.keys(body.data)).toEqual(
            expect.arrayContaining(['id', 'name', 'genre', 'rating', 'explicit'])
          )
          expect(body.data.id).toBe(4)
          expect(body.data.name).toBe('The Land Before Time')
        })
      })
      it('should throw an error if the movie does not exist', async () => {
        const obj = movies.single.failure
        that.get.yields(null, obj.res, JSON.stringify(obj.body))
        request.get(`${base}/api/v1/movies/999`, (_, res, body) => {
          expect(res.statusCode).toBe(404)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('error')
          expect(body.message).toBe('That movie does not exist.')
        })
      })
    })
    describe('POST /api/v1/movies', () => {
      it('should return the movie\'s id that was added', async () => {
        const options = {
          method: 'post',
          body: {
            name: 'Titanic',
            genre: 'Drama',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/movies`
        }
        const obj = movies.add.success
        that.post.yields(null, obj.res, JSON.stringify(obj.body))
        request.post(options, (_, res, body) => {
          expect(res.statusCode).toBe(201)
          expect(res.headers['content-type']).toBe('application/json')
          body = JSON.parse(body)
          expect(body.status).toBe('success')
          expect(body.data).toBe(4)
        })
      })
    })
  })
})
