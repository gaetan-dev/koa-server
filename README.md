# Koa Server
___

## Folder and file structure

To begin with, the important parts of the structure for now are:

```
├──  build/
│
├──  doc/
│
├──  node_modules/
│
├──  src/
│   ├──  db/
│   │   ├── migrations
│   │   ├── queries
│   │   ├── seeds
│   │   └── connection.js
│   │
│   ├──  routes/
│   │
│   ├──  views/
│   │
│   ├──  app.js
│   ├──  auth.js
│   ├──  boot.js
│   └──  server.js
│
├──  test/
│   ├──  fixtures
│   ├──  integrations
│   ├──  services
│   └──  units
│
├──  views/
│    
├──  .gitignore
├──  jsdoc.conf
├──  nodemon.json
├──  package.json
├──  README.md
└──  webpack.config.js
```

* **build/**: Our output folder.
* **node_modules/**: All modules described in `package.json` will be automatically placed here using `npm` commands.
* **doc/**: All documentation generate by JsDoc
* **src/**: Our source code base folder.
* **src/app.js**: Our App entry.
* **src/boot.js**: boot.js is used to transcompile ES6 code. Like this we don't need a task runner to transcompile our javascript. The configuration of babel-core is done in package.json.
* **src/server.js**: Create and launch our server.
* **jsdoc.conf**: Default JsDoc configuration file.
* **nodemon.json**: Default Nodemon configuration file.
* **package.json**: Holds project configuration.
* **webpack.config.json**: Default Webpack configuration file.

## Simple Node RESTful API
Simple Node RESTful API, with the following routes:

| URL	             | HTTP Verb | Authenticated?  | Action                   |
|--------------------|-----------|-----------------|--------------------------|
| /auth/register	 | GET	     | No	           | Render the register view |
| /auth/register	 | POST	     | No	           | Register a new user      |
| /auth/login	     | GET	     | No	           | Render the login view    |
| /auth/login	     | POST	     | No	           | Log a user in            |
| /auth/status	     | GET	     | Yes	           | Render the status page   |
| /auth/logout	     | GET	     | Yes	           | Log a user out           |

| URL                | HTTP Verb | Action                |
|--------------------|-----------|-----------------------|
| /api/v1/movies     | GET       | Return ALL movies     |
| /api/v1/movies/:id | GET       | Return a SINGLE movie |
| /api/v1/movies     | POST      | Add a movie           |
| /api/v1/movies/:id | PUT       | Update a movie        |
| /api/v1/movies/:id | DELETE    | Delete a movie        |

## Knex
Knex.js is a "batteries included" SQL query builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle designed to be flexible portable, and fun to use.
___

```
├──  src/
│   └──  bd/
│       ├──  migrations/
│       ├──  seeds/
│       └── connection.js
│    
└── knexfile.js

```

* **src/bd/migrations/**: Contains database schemas.
* **src/bd/seeds/**: Contains files to populate db.
* **src/bd/connection.js**: Connection to db.
* **knexfile.js**:  Config file to Knex.


Create a new migration to define the database schema:
```
knex migrate:make movies
```

Apply the migration to the development database:
```
knex migrate:latest --env development
```

Create a seed file to populate the database with some initial data:
 ```
knex seed:make movies
```

Apply the seed:
```
knex seed:run --env development
```

Finally, go back into mysql to ensure the database has been updated:
```
+----+------------------+------------+--------+----------+
| id | name             | genre      | rating | explicit |
+----+------------------+------------+--------+----------+
|  1 | The Land Before  | Fantasy    |      7 |        0 |
|  2 | Jurassic Park    | Science Fi |      9 |        1 |
|  3 | Ice Age: Dawn of | Action/Rom |      5 |        0 |
+----+------------------+------------+--------+----------+
```

## Component

```
├──  src/
│   ├──  db/
│   │   ├──  migrations/
│   │   └──  queries/
│   │
│   ├──  routes/
│   │ 
│   └── app.js    
```


### Routes
In src/routes/ create a new file for each component.

```javascript
/* src/routes/movies.js */

import Router from 'koa-router'
import queries from '../db/queries/movies'

const router = new Router()
const BASE_URL = `/api/v1/movies`

// GET ALL
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

...
```

### Migration

Create a new migration to define the database schema (cf knex).

### Queries
In src/db/queries/ create a new file for each component.

```javascript
/* src/db/queries/movies.js */

import knex from '../connection'

// GET ALL
function getAllMovies () {
  return knex('movies')
    .select('*')
}

export default { getAllMovies }
```

### Add to app.js

```javascript
/* src/app.js */

// Routes
import movieRoutes from './routes/movies'

// Add routes
app.use(movieRoutes.routes())
```

## Test
### Integration

```javascript
const knex = require('../../src/db/connection')
const server = require('../../src/boot').default
const request = require('supertest')

describe('routes : [NAME]', () => {
    // Before each test
    beforeEach(() => {
        // Rollback the last batch of migrations
        return knex.migrate.rollback()
        // Apply the database schema
        .then(() => { return knex.migrate.latest() })
        // Populate the database
        .then(() => { return knex.seed.run() })
    })

    // After each test
    afterEach(() => {
        // Stop the server
        server.close()
        // Rollback the last batch of migrations
        return knex.migrate.rollback()
    })

    describe('[VERB] [URL]', () => {
    it('[SHOULD]', async () => {
      const response = await request(server).get('[URL]')
      expect(response.status).toBe(200)
      /* ... */
    })
  })
})
```

## User Authentication
### Passport
Passport is a library that provides a simple authentication middleware for Node.js.
### Session
Sessions are stored in a cookie by default on the client-side, unencrypted.
### Password Hashing (bcrypt)
Start by adding a helper method called **comparePassword** to *src/auth.js*:

```js
function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}
```

This helper can now be used when we pull a user from the database and check that the passwords are equal:

```js
passport.use(new Strategy(options, (username, password, done) => {
  knex('users').where({ username }).first()
  .then((user) => {
    if (!user) return done(null, false)
    if (!comparePass(password, user.password)) return done(null, false)
    else return done(null, user)
  })
  .catch((err) => { return done(err) })
}))
```

Next, update the **addUser** function in *src/db/queries/users.js*:

```js
function addUser (user) {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(user.password, salt)
  return knex('users')
  .insert({
    username: user.username,
    password: hash
  })
}
```

Do the same for the user seed in src/db/seeds/users.js:

```js
exports.seed = (knex, Promise) => {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync('johnson', salt)
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'John',
        password: hash
      })
    )
  })
}
```

Now, instead of adding a plain text password to the database, we salt and hash it first.

Drop and recreate the **koa** database, apply the migrations, and then run the server and manually test everything out.