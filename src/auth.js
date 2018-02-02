import bcrypt from 'bcryptjs'
import knex from './db/connection'
import Strategy from 'passport-local'
import passport from 'koa-passport'

const options = {}

passport.serializeUser((user, done) => { done(null, user.id) })

passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user) })
  .catch((err) => { done(err, null) })
})

passport.use(new Strategy(options, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false)
    if (!comparePass(password, user.password)) return done(null, false)
    else return done(null, user)
  })
  .catch((err) => { return done(err) })
}))

function comparePass (userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword)
}
