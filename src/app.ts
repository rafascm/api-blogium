import express from 'express'
import cors from 'cors'
import auth from './controllers/authController'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', auth)

app.listen(3000)
