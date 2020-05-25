import express, { Application } from 'express'
import { routes } from './routes'

const PORT = process.env.PORT || 5000

const app: Application = express()
app.use(express.json())

routes(app)

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Express Running on port: ${PORT} 🚀`)
  })

  // shut down server
  const shutdown = (): void => {
    // NOTE: server.close is for express based apps
    // If using hapi, use `server.stop`
    server.close((err) => {
      if (err) {
        console.error(err)
        process.exitCode = 1
      }
      process.exit()
    })
  }

  // quit on ctrl-c when running docker in terminal
  process.on('SIGINT', () => {
    console.info(
      'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
      new Date().toISOString()
    )
    shutdown()
  })

  // quit properly on docker stop
  process.on('SIGTERM', () => {
    console.info(
      'Got SIGTERM (docker container stop). Graceful shutdown ',
      new Date().toISOString()
    )
    shutdown()
  })
}

export default app
