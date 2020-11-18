import fs from 'fs'
import path from 'path'

const USER_DATA_FILE = path.resolve('./data/users.json')
const POSTS_DATA_FILE = path.resolve('./data/posts.json')
const SESSIONS_DATA_FILE = path.resolve('./data/sessions.json')

const readDB = (filename: string) => {
  return JSON.parse(fs.readFileSync(filename, 'utf-8').toString())
}

const updateDB = (filename: string, array: any[]) => {
  fs.writeFileSync(filename, JSON.stringify(array, null, 2))
}

export { USER_DATA_FILE, POSTS_DATA_FILE, SESSIONS_DATA_FILE, readDB, updateDB }
