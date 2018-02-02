import fs from 'fs'
import passport from 'koa-passport'
import queries from '../db/queries/users'
import Router from 'koa-router'

const router = new Router()

router.get('/auth/register', async (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('./src/views/register.html')
})

router.get('/auth/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('./src/views/status.html')
  } else {
    ctx.redirect('/auth/login')
  }
})

router.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('./src/views/login.html')
  } else {
    ctx.redirect('/auth/status')
  }
})

router.get('/auth/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout()
    ctx.redirect('/auth/login')
  } else {
    ctx.body = { success: false }
    ctx.throw(401)
  }
})

router.post('/auth/register', async (ctx) => {
  await queries.addUser(ctx.request.body)
  return passport.authenticate('local', (_, user, info, status) => {
    if (user) {
      ctx.login(user)
      ctx.redirect('/auth/status')
    } else {
      ctx.status = 400
      ctx.body = { status: 'error' }
    }
  })(ctx)
})

router.post('/auth/login', async (ctx) => {
  return passport.authenticate('local', (_, user, info, status) => {
    if (user) {
      ctx.login(user)
      ctx.redirect('/auth/status')
    } else {
      ctx.status = 400
      ctx.body = { status: 'error' }
    }
  })(ctx)
})

module.exports = router
