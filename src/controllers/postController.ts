import { Router, Request, Response } from 'express'
import { postCreationSchema, getLastPostID, insertPost } from '../models/posts'
import { findSession } from '../models/sessions'
import { findUser } from '../models/user'
import stripHtml from 'string-strip-html'
import dayjs from 'dayjs'
// import _ from 'lodash'

const router = Router()

let countID = getLastPostID()

router.post('/', (req: Request, res: Response) => {
  const auth = req.header('Authorization')
  if (!auth) return res.sendStatus(403)

  const token = auth.substring(0, auth.lastIndexOf(' '))

  const session = findSession(token)
  if (!session) return res.sendStatus(403)

  const user = findUser(session)
  if (!user) return res.sendStatus(403)

  const error = postCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const newPost = {
    ...req.body,
    publishedAt: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    contentPreview: stripHtml(
      req.body.content.substring(300, req.body.content.length)
    ),
    authorID: user.id,
    id: ++countID
  }

  insertPost(newPost)

  delete newPost.authorID
  const author = {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    biography: user.biography
  }

  res.status(201).send({ ...newPost, author })
})

export default router
