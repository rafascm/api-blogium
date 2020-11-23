import { Request } from 'express'
import joi from 'joi'
import _ from 'lodash'
import { readDB, updateDB, USER_DATA_FILE } from '../utils/utils'
import { Session } from './sessions'

type User = Session & {
  username?: string
  email?: string
  password?: string
  passwordConfirmation?: string
  avatarUrl?: string
  biography?: string
  id: number
}

const users: Array<User> = readDB(USER_DATA_FILE)

const usernameRegex = /^([a-z]+[\d]*[.]?[\da-z]+){2,}$/
const pwdRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%&+]).{6,10}$/

const userCreationSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  username: joi.string().pattern(usernameRegex).required(),
  password: joi.string().pattern(pwdRegex).required(),
  passwordConfirmation: joi.ref('password'),
  avatarUrl: joi.string().uri(),
  biography: joi.string().min(50).max(2048)
})

const userSignInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})

const userEditSchema = joi.object({
  username: joi.string().pattern(usernameRegex).required(),
  avatarUrl: joi.string().uri(),
  biography: joi.string().min(50).max(2048)
})

const insertUser = (user: any) => {
  users.push(user)
  updateDB(USER_DATA_FILE, users)
}

const findUser = (user: User) => _.find(users, ['email', user.email])
const findUserByID = (user: User) => _.find(users, ['id', user.id])
const matchUser = (user: User) =>
  _.find(users, { email: user.email, password: user.password })

const editUser = (user: User, req: Request) => {
  const index = _.findIndex(users, findUserByID(user))
  users[index] = {
    ...users[index],
    ...req.body
  }
  updateDB(USER_DATA_FILE, users)
}

const getLastUserID = () => {
  const last = _.last(users)
  return last ? last.id : 0
}

export {
  userCreationSchema,
  userSignInSchema,
  userEditSchema,
  users,
  User,
  findUser,
  getLastUserID,
  insertUser,
  matchUser,
  findUserByID,
  editUser
}
