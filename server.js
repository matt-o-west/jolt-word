import { createRequestHandler } from '@remix-run/express'
import * as express from 'express'

let app = express()

app.all(
  '*',
  createRequestHandler({
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders.
    },
  })
)

let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
