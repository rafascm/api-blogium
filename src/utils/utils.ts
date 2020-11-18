import fs from 'fs'
import path from 'path'

const USER_DATA_FILE = path.resolve('./src/data/users.json')
const POSTS_DATA_FILE = path.resolve('./src/data/posts.json')
const SESSIONS_DATA_FILE = path.resolve('./src/data/sessions.json')

const readDB = (filename: string) => {
  return JSON.parse(fs.readFileSync(filename).toString())
}

const updateDB = (filename: string, array: any[]) => {
  fs.writeFileSync(filename, JSON.stringify(array))
}

export { USER_DATA_FILE, POSTS_DATA_FILE, SESSIONS_DATA_FILE, readDB, updateDB }
