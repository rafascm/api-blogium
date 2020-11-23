import { posts, findPostsByUserID } from '../models/posts'
import { filterByOffsetLimit } from '../utils/utils'
import { Router, Request, Response } from 'express'
import { loadSession } from '../models/sessions'
import { auth } from '../models/middlewares'
import { v4 as uuid } from 'uuid'
import {
  userCreationSchema,
  userSignInSchema,
  userEditSchema,
  findUser,
  insertUser,
  matchUser,
  getLastUserID,
  editUser
} from '../models/user'
import _ from 'lodash'

const router = Router()

let countID = getLastUserID()

router.post('/sign-up', (req: Request, res: Response) => {
  const error = userCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const newUser = { ...req.body, id: ++countID }

  if (findUser(newUser)) return res.sendStatus(409)

  insertUser({ ..._.omit(newUser, ['passwordConfirmation']) })

  res.send(
    JSON.stringify(_.omit(newUser, ['password', 'passwordConfirmation']))
  )
})

router.post('/sign-in', (req: Request, res: Response) => {
  const error = userSignInSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const user = matchUser(req.body)
  if (!user) return res.sendStatus(404)

  const token = uuid()
  loadSession({ token: token, id: user.id })

  res.status(200).send({ ..._.omit(user, ['password']), token })
})

router.put('/', auth, (req: Request, res: Response) => {
  const user = req.res && req.res.locals.user

  const error = userEditSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  editUser(user, req)

  res.send(_.omit(user, ['password'])).status(200)
})

router.get('/:id/posts', (req: Request, res: Response) => {
  const arr = findPostsByUserID(Number(req.params.id))

  res.status(200).send({
    count: posts.length,
    posts: filterByOffsetLimit(arr, req.query.offset, req.query.limit)
  })
})

export default router
