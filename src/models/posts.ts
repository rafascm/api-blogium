import joi from 'joi'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Request } from 'express'
import stripHtml from 'string-strip-html'
import { readDB, updateDB, POSTS_DATA_FILE } from '../utils/utils'

type Post = {
  id: number
  title: string
  coverUrl: string
  contentPreview: string
  content: string
  publishedAt: string
  author: any
}

const posts: Array<Post> = readDB(POSTS_DATA_FILE)

const postCreationSchema = joi.object({
  coverUrl: joi.string().uri().required(),
  title: joi.string().min(10).required(),
  content: joi.string().min(100).required()
})

const insertPost = (post: Post) => {
  posts.push(post)
  updateDB(POSTS_DATA_FILE, posts)
}
const editPost = (id: number, p: Post) => {
  const index = _.findIndex(posts, findPostByID(id))
  posts[index] = {
    ...posts[index],
    ...p,
    contentPreview: getContentPreview(p.content)
  }
  updateDB(POSTS_DATA_FILE, posts)
}
const deletePost = (id: number) => {
  _.remove(posts, ['id', id])
  updateDB(POSTS_DATA_FILE, posts)
}
const findPost = (post: Post) => _.find(posts, _.matches(post))

const findPostByID = (id: number, userID?: number) => {
  if (!userID) return _.find(posts, ['id', id])
  // return _.find(posts, { id: id, 'author[id]': userID }) didnt work
  return posts.find(p => p.id === id && p.author.id === userID)
}
const findPostsByUserID = (id: number) => _.filter(posts, ['author[id]', id])

const getLastPostID = () => {
  const last = _.last(posts)
  return last ? last.id : 0
}
const getContentPreview = (str: string) => {
  return _.truncate(stripHtml(str).result, { length: 300 })
}

const createPost = (req: Request) => {
  let countID = getLastPostID()
  const user = req.res && req.res.locals.user
  const post = {
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
  return post
}

export {
  posts,
  postCreationSchema,
  insertPost,
  findPost,
  getLastPostID,
  findPostsByUserID,
  findPostByID,
  deletePost,
  editPost,
  getContentPreview,
  createPost
}
