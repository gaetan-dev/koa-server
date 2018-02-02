import {} from './auth'
import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import logger from 'koa-logger'
import passport from 'koa-passport'
import session from 'koa-session'

// Routes
import indexRoutes from './routes/index'
import authRoutes from './routes/auth'
import movieRoutes from './routes/movies'

const app = new Koa()

// logs
if (process.env.NODE_ENV !== 'test') {
  app.use(logger())
}

// parser
app.use(bodyParser())

// sessions
app.keys = ['cWuPCXHBEx7e7SStQTV2wRPKmZRyYL4']
app.use(session(app))

// authentication
app.use(passport.initialize())
app.use(passport.session())

// Add routes
app.use(indexRoutes.routes())
app.use(authRoutes.routes())
app.use(movieRoutes.routes())

export default app
