import express from 'express'
import cors from 'cors'
import auth from './controllers/authController'
import posts from './controllers/postController'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', auth)
app.use('/posts', posts)

app.listen(3000)
