import { Request, Response, NextFunction } from 'express'
import { findSession } from './sessions'
import { findUserByID } from './user'

const auth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization')
  if (!auth) return res.sendStatus(403)

  const token = auth.split(' ')[1]

  const session = findSession(token)
  if (!session) return res.sendStatus(401)

  const user = findUserByID(session)
  if (!user) return res.sendStatus(403)

  res.locals.user = user
  next()
}

export { auth }
