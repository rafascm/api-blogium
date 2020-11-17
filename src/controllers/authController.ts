import { Router, Request, Response } from 'express'
import { userSchema } from '../models/user'
import path from 'path'
import fs from 'fs'

const USER_DATA_FILE = path.resolve('./src/data/users.json')
const router = Router()

const isNotAvailable = (
  arr: Array<any>,
  item: { username: string; email: string }
) => arr.some(e => e.username === item.username || e.email === item.email)

const users: Array<any> = JSON.parse(fs.readFileSync(USER_DATA_FILE).toString())

let countID = (users[users.length - 1] && users[users.length - 1].id) || 0

router.post('/sign-up', (req: Request, res: Response) => {
  if (userSchema.validate(req.body).error) return res.sendStatus(422)

  const newUser = { ...req.body, id: ++countID }
  delete newUser.passwordConfirmation

  if (isNotAvailable(users, newUser)) return res.sendStatus(409)

  users.push(newUser)

  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(users))

  res.send(
    JSON.stringify({
      ...Object.fromEntries(
        Object.entries(newUser).filter(key => key[0] !== 'password')
      )
    })
  )
})
export default router
