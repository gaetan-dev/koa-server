import bcrypt from 'bcryptjs'
import knex from '../connection'

function addUser (user) {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(user.password, salt)
  return knex('users')
  .insert({
    username: user.username,
    password: hash
  })
}

export default { addUser }
