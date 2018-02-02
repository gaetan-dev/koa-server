import Router from 'koa-router'
import queries from '../db/queries/movies'

const router = new Router()
const BASE_URL = `/api/v1/movies`

router.get(BASE_URL, async (ctx) => {
  try {
    const movies = await queries.getAllMovies()
    ctx.body = {
      status: 'success',
      data: movies
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const movie = await queries.getSingleMovie(ctx.params.id)
    if (movie.length) {
      ctx.body = {
        status: 'success',
        data: movie[0]
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        'message': 'That movie does not exist.'
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const movie = await queries.addMovie(ctx.request.body)
    if (movie.length) {
      ctx.status = 201
      ctx.body = {
        status: 'success',
        data: movie[0]
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const movie = await queries.updateMovie(ctx.params.id, ctx.request.body)
    if (movie) {
      ctx.status = 200
      ctx.body = {
        status: 'success',
        data: movie
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.'
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const movie = await queries.deleteMovie(ctx.params.id)
    if (movie) {
      ctx.status = 200
      ctx.body = {
        status: 'success',
        data: movie
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'error',
        message: 'That movie does not exist.'
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    }
  }
})

export default router
