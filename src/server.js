import app from './app'
import 'colors'

const options = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
}

if (!module.parent.parent) {
  app.listen(options, () => {
    console.log('✔ Server listening on port'.green, String(options.port).cyan)
  })
}
