import { filterByOffsetLimit } from '../utils/utils'
import { Router, Request, Response } from 'express'
import { auth } from '../models/middlewares'

import {
  postCreationSchema,
  insertPost,
  posts,
  findPostByID,
  deletePost,
  editPost,
  getContentPreview,
  createPost
} from '../models/posts'

const router = Router()

router.post('/', auth, (req: Request, res: Response) => {
  const error = postCreationSchema.validate(req.body).error
  if (error) return res.sendStatus(422)

  const newPost = createPost(req)

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

router.put('/:id', auth, (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const user = req.res && req.res.locals.user

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

router.delete('/:id', auth, (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = req.res && req.res.locals.user

  const post = findPostByID(id, user.id)
  if (!post) return res.sendStatus(401)

  deletePost(id)

  res.sendStatus(200)
})

export default router
