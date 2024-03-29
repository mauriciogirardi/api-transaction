import { app } from './app'
import { env } from './env'

app.listen({ port: env.PORT }).then(() => {
  console.info(`Server is running at, http://localhost:${env.PORT}`)
})
