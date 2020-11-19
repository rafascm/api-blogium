import joi from 'joi'
import _ from 'lodash'
import { readDB, updateDB, POSTS_DATA_FILE } from '../utils/utils'

type Post = {
  id: number
  title: string
  coverUrl: string
  contentPreview: string
  content: string
  publishedAt: string
  authorID: number
}

let posts: Array<Post> = readDB(POSTS_DATA_FILE)

const postCreationSchema = joi.object({
  coverUrl: joi.string().uri().required(),
  title: joi.string().min(10).required(),
  content: joi.string().min(100).required()
})

const insertPost = (post: Post) => {
  posts.push(post)
  updateDB(POSTS_DATA_FILE, posts)
}
const deletePost = (id: number) => {
  posts = posts.filter(o => o.id !== id)
  updateDB(POSTS_DATA_FILE, posts)
}
const findPost = (post: Post) => _.find(posts, _.matches(post))

const findPostByID = (id: number, userID?: number) => {
  if (!userID) return _.find(posts, ['id', id])
  return _.find(posts, _.matches({ id: id, 'author[id]': userID }))
}
const findPostsByUserID = (id: number) => _.filter(posts, ['author[id]', id])

const getLastPostID = () => {
  const last = _.last(posts)
  return last ? last.id : 0
}

export {
  posts,
  postCreationSchema,
  insertPost,
  findPost,
  getLastPostID,
  findPostsByUserID,
  findPostByID,
  deletePost
}
