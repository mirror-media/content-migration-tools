import type { RawPost } from '../graphql/post'
import { writeJson } from '../helpers/fs'
import { join } from 'node:path'

export default async function writePostsToFiles(
  outDir: string,
  posts: RawPost[],
) {
  const tasks = posts.map(post => {
    const filePath = join(outDir, `${post.id}.json`)

    return writeJson(filePath, post.content)
  })

  const count = {
    ok: 0,
    fail: 0,
  }

  const taskResults = await Promise.allSettled(tasks)

  for (let result of taskResults) {
    if (result.status === 'fulfilled') count.ok += 1
    else count.fail += 1
  }

  return count
}
