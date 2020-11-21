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

/* const resetSessions = () => {
  _.remove(sessions, (e) => e)
  updateDB(SESSIONS_DATA_FILE, sessions)
  console.log('Sessions has been reset')
} */

export { sessions, loadSession, findSession, Session }

// setInterval(resetSessions, 600000)
