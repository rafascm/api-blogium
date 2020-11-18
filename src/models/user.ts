import joi from 'joi'
import { readDB, updateDB, USER_DATA_FILE } from '../utils/utils'

type User = Object & {
  username?: string
  email?: string
  password?: string
  passwordConfirmation?: string
  avatarUrl?: string
  biography?: string
  id?: number
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

const insertUser = (user: User) => {
  users.push(user)
  updateDB(USER_DATA_FILE, users)
}

const findUser = (user: User) => {
  return users.find(
    u =>
      (u.password === user.password && u.email === user.email) ||
      u.id === user.id ||
      u.username === user.username ||
      u.email === user.email
  )
}

const getLastID = () => {
  return (users[users.length - 1] && users[users.length - 1].id) || 0
}

export {
  userCreationSchema,
  userSignInSchema,
  users,
  User,
  findUser,
  getLastID,
  insertUser
}
