import { print } from 'graphql'
import {
  SHOULD_GET_AUTH,
  USER_NAME,
  PASSWORD,
  BEGIN_DATE_TIME,
  END_DATE_TIME,
  OUTDIR_BASE_PATH,
} from './constants/config'
import { GetAuthMutation, type RawAuthResult } from './graphql/auth'
import { GetPostCountQuery, GetPostsQuery, type RawPost } from './graphql/post'
import { fireGqlRequest, log } from './helpers/utils'
import { ensureDirectory } from './helpers/fs'

let AUTH_TOKEN: string

async function getAuth(): Promise<[boolean, string]> {
  const { data } = await fireGqlRequest<
    RawAuthResult,
    'authenticateUserWithPassword'
  >(print(GetAuthMutation), {
    email: USER_NAME,
    password: PASSWORD,
  })

  if (data?.authenticateUserWithPassword) {
    const { sessionToken, message } = data.authenticateUserWithPassword

    if (sessionToken) return [true, sessionToken]
    else if (message) return [false, message]
  }

  return [false, '']
}

async function getPostCount() {
  const { data } = await fireGqlRequest<number, 'count'>(
    print(GetPostCountQuery),
    {
      beginDate: BEGIN_DATE_TIME,
      endDate: END_DATE_TIME,
    },
    AUTH_TOKEN,
  )

  if (data?.count) {
    return data.count
  }

  return 0
}

async function getPosts(take: number = 1000, skip: number = 0) {
  const { data } = await fireGqlRequest<RawPost[], 'posts'>(
    print(GetPostsQuery),
    {
      beginDate: BEGIN_DATE_TIME,
      endDate: END_DATE_TIME,
      take: take,
      skip: skip,
    },
    AUTH_TOKEN,
  )

  if (data?.posts) {
    return data.posts
  }

  return []
}

async function main() {
  // setup base output directory
  await ensureDirectory(OUTDIR_BASE_PATH)
  log(`OUTPUT_BASE_PATH: ${OUTDIR_BASE_PATH} exists.`)

  if (SHOULD_GET_AUTH) {
    const authResult = await getAuth()

    log('auth result is: ', authResult[0])
    if (authResult[0]) {
      AUTH_TOKEN = authResult[1]
      log('auth token is: ', AUTH_TOKEN)
    } else {
      log('failed message is: ', authResult[1])
    }
  }

  // get total count of posts
  const totalCount = await getPostCount()

  log('total count of posts: ', totalCount)

}

main()
