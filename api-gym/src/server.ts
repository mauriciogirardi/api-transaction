import { app } from './app'
import { env } from './env'
const { HOST, PORT } = env
app
  .listen({ host: HOST, port: PORT })
  .then(() => console.info(`🚀 Server is ruining at http://localhost:${PORT}`))
  .catch((error) => console.error('Error Server: ', error))
