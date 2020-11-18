import _ from 'lodash'
import { readDB, updateDB, SESSIONS_DATA_FILE } from '../utils/utils'

type Session = { token: string, id: number }

const sessions: Array<Session> = readDB(SESSIONS_DATA_FILE)

const loadSession = (session: Session) => {
  sessions.push(session)
  updateDB(SESSIONS_DATA_FILE, sessions)
}

const findSession = (token: string) =>
  _.find(sessions, ['token', token])

export { sessions, loadSession, findSession, Session }
