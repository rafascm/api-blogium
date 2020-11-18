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

const findPost = (post: Post) => _.find(posts, _.matches(post))

const getLastPostID = () => {
  const last = _.last(posts)
  return last ? last.id : 0
}

export { posts, postCreationSchema, insertPost, findPost, getLastPostID }
