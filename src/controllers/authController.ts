import { Router, Request, Response } from 'express'
import { loadSession } from '../models/sessions'
import { v4 as uuid } from 'uuid'
import {
  userCreationSchema,
  userSignInSchema,
  findUser,
  insertUser,
  getLastUserID
} from '../models/user'
import { posts, findPostsByUserID } from '../models/posts'
import { filterByOffsetLimit } from '../utils/utils'

const router = Router()

let countID = getLastUserID()

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

router.get('/:id/posts', (req: Request, res: Response) => {
  const arr = findPostsByUserID(Number(req.params.id))

  res.status(200).send({
    count: posts.length,
    posts: filterByOffsetLimit(arr, req.query.offset, req.query.limit)
  })
})

export default router
