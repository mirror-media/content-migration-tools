import 'dotenv/config'
import { env } from 'node:process'
import { join } from 'node:path'
import {
  OUTDIR_BASE_PATH,
  SHOULD_GET_AUTH,
  USER_NAME,
  PASSWORD,
} from './constants/config'
import { errorLog, log, askQuestion } from './helpers/utils'
import { constants } from 'node:fs'
import { access, readdir } from 'node:fs/promises'
import { readJson } from './helpers/fs'
import type { RawPost } from './graphql/post'
import type { JSONValue } from './types/common'
import updatePostDataToCMS from './operations/update-post-data-to-cms'
import { getAuth } from './helpers/requests'
import axios from 'axios'

const migrationName = env.MIGRATION_NAME ?? ''
const postContentDir = env.POST_CONTENT_DIR ?? ''
const postContentDirPath = join(OUTDIR_BASE_PATH, migrationName, postContentDir)

async function updateToCMSFromFIles() {
  if (SHOULD_GET_AUTH) {
    const authResult = await getAuth(USER_NAME, PASSWORD)

    log('auth result is: ', authResult[0])
    if (authResult[0]) {
      log('auth token is: ', authResult[1])
      axios.defaults.headers.common['Cookie'] =
        `keystonejs-session=${authResult[1]}`
    } else {
      log('failed message is: ', authResult[1])
    }
  }

  // check if directory could be accessed
  try {
    await access(postContentDirPath, constants.R_OK)
  } catch (err) {
    errorLog("postContentDirPath can't be accessed: ", postContentDirPath)
    process.exit(1)
  }

  log('postContentDirPath is accessed: ', postContentDirPath)

  const createPostFromFile = async (dir: string, file: string) => {
    const [psotId] = file.split('.')
    const filePath = join(dir, file)
    const content = await readJson<JSONValue>(filePath)
    const post: RawPost = {
      id: psotId,
      content,
    }

    return post
  }

  // read content jsons from files
  const nodes = await readdir(postContentDirPath)
  log(`There are ${nodes.length} nodes in postContentDirPath.`)
  const tasks = await nodes.map(node =>
    createPostFromFile(postContentDirPath, node),
  )

  const taskResults = await Promise.allSettled(tasks)
  const posts: RawPost[] = []
  taskResults.forEach(result => {
    if (result.status === 'fulfilled') {
      posts.push(result.value)
    }
  })
  log(`There are ${posts.length} of posts.`)

  // update post data to CMS
  const ans = await askQuestion(
    'About to update post data in CMS.  Press (Y/y) to confirm: ',
  )
  if (ans.toLowerCase() === 'y') {
    await updatePostDataToCMS(posts)
  }
  log('Finished update post data to CMS from files.')
}

updateToCMSFromFIles()
