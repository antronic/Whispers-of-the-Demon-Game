import express, { Router } from 'express'

// Import the router from the controllers
import OpenAIRouter from './controllers/openai'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const Api = Router()
Api.use('/openai', OpenAIRouter)

app.use('/api', Api)

app.listen(PORT, () => {
  // print the port the server is running on
  console.log(`Server is running on port ${PORT}`)
})

