import { filterByOffsetLimit } from '../utils/utils'
import { Router, Request, Response } from 'express'
import { findSession } from '../models/sessions'
import { findUser } from '../models/user'
import dayjs from 'dayjs'
import {
  postCreationSchema,
  getLastPostID,
  insertPost,
  posts,
  findPostByID,
  deletePost,
  editPost,
  getContentPreview
} from '../models/posts'

const router = Router()

let countID = getLastPostID()

router.post('/', (req: Request, res: Response) => {
  const auth = req.header('Authorization')
  if (!auth) return res.sendStatus(403)

  const token = auth.split(' ')[1]

  const session = findSession(token)
  if (!session) return res.sendStatus(401)

  const user = findUser(session)
  if (!user) return res.sendStatus(403)

  const error = postCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const newPost = {
    ...req.body,
    publishedAt: dayjs().format('DD/MM/YYYY-HH:mm:ss'),
    contentPreview: getContentPreview(req.body.content),
    id: ++countID,
    author: {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      biography: user.biography
    }
  }

  insertPost(newPost)
  res.status(201).send(newPost)
})

router.get('/', (req: Request, res: Response) => {
  res
    .send({
      count: posts.length,
      posts: filterByOffsetLimit(posts, req.query.offset, req.query.limit)
    })
    .status(200)
})

router.get('/:id', (req: Request, res: Response) => {
  const post = findPostByID(Number(req.params.id))
  if (!post) return res.sendStatus(404)

  res.send(post).status(200)
})

router.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const auth = req.header('Authorization')
  if (!auth) return res.sendStatus(403)

  const token = auth.split(' ')[1]

  const session = findSession(token)
  if (!session) return res.sendStatus(401)

  const user = findUser(session)
  if (!user) return res.sendStatus(403)

  const post = findPostByID(id, user.id)
  if (!post) return res.sendStatus(401)

  const error = postCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const eddited = {
    ...req.body,
    contentPreview: getContentPreview(req.body.content)
  }
  editPost(id, eddited)

  res.send(findPostByID(id)).status(200)
})

router.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const auth = req.header('Authorization')
  if (!auth) return res.sendStatus(403)

  const token = auth.split(' ')[1]

  const session = findSession(token)
  if (!session) return res.sendStatus(401)

  const user = findUser(session)
  if (!user) return res.sendStatus(403)

  const post = findPostByID(id, user.id)
  if (!post) return res.sendStatus(401)

  deletePost(id)

  res.sendStatus(200)
})

export default router
