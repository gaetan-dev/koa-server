import knex from '../connection'

function getAllMovies () {
  return knex('movies')
    .select('*')
}

function getSingleMovie (id) {
  return knex('movies')
    .select('*')
    .where({ id: parseInt(id) })
}

function addMovie (movie) {
  return knex('movies')
  .insert(movie)
}

function updateMovie (id, movie) {
  return knex('movies')
  .update(movie)
  .where({ id: parseInt(id) })
}

function deleteMovie (id) {
  return knex('movies')
  .del()
  .where({ id: parseInt(id) })
}

export default { getAllMovies, getSingleMovie, addMovie, updateMovie, deleteMovie }
