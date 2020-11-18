import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import {
  userCreationSchema,
  userSignInSchema,
  findUser,
  insertUser,
  getLastID
} from '../models/user'
import { readDB, SESSIONS_DATA_FILE, updateDB } from '../utils/utils'

const router = Router()

const sessions = readDB(SESSIONS_DATA_FILE)

let countID = getLastID()

router.post('/sign-up', (req: Request, res: Response) => {
  const error = userCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const newUser = { ...req.body, id: ++countID }
  delete newUser.passwordConfirmation

  if (findUser(newUser)) return res.sendStatus(409)

  insertUser(newUser)

  delete newUser.password
  res.send(JSON.stringify(newUser))
})

router.post('/sign-in', (req: Request, res: Response) => {
  const error = userSignInSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const user = findUser(req.body)
  if (!user) return res.sendStatus(404)

  const token = uuid()
  loadSession({ token: token, id: user.id })

  delete user.password
  res.status(200).send({ ...user, token })
})

export default router

const loadSession = (session: { token: string; id: number | undefined }) => {
  sessions.push(session)
  updateDB(SESSIONS_DATA_FILE, sessions)
}
