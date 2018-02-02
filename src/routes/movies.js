import Router from 'koa-router'
import queries from '../db/queries/movies'

const router = new Router()
const BASE_URL = `/api/v1/movies`

router.get(BASE_URL, async (ctx) => {
  try {
    const movies = await queries.getAllMovies()
    ctx.body = {
      movies: movies
    }
  } catch (err) {
    ctx.throw(err.message, 500)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  const movie = await queries.getSingleMovie(ctx.params.id)
  if (movie.length) {
    ctx.body = {
      movie: movie[0]
    }
  } else {
    ctx.throw(404, 'That movie does not exist.')
  }
})

router.post(`${BASE_URL}`, async (ctx) => {
  const movie = await queries.addMovie(ctx.request.body)
  if (movie.length) {
    ctx.status = 201
    ctx.body = {
      id: movie[0]
    }
  } else {
    ctx.throw(400)
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  const movie = await queries.updateMovie(ctx.params.id, ctx.request.body)
  if (movie) {
    ctx.status = 200
    ctx.body = { }
  } else {
    ctx.throw(404, 'That movie does not exist.')
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  const movie = await queries.deleteMovie(ctx.params.id)
  if (movie) {
    ctx.status = 200
    ctx.body = { }
  } else {
    ctx.throw(404, 'That movie does not exist.')
  }
})

export default router
