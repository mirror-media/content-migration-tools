import type { RawPost } from '../graphql/post'
import { log, fireGqlRequest } from '../helpers/utils'
import { UpdatePostsMutation } from '../graphql/post'
import { print } from 'graphql'

function createUpdateData(post: RawPost) {
  return {
    data: {
      content: post.content,
    },
    where: {
      id: post.id,
    },
  }
}

async function batchUpdatePosts(posts: RawPost[], first?: boolean) {
  const mutationDatas = posts.map(createUpdateData)

  if (first) {
    log('Sample mutation data: ', mutationDatas[0])
  }

  const { data } = await fireGqlRequest<RawPost[], 'updatePosts'>(
    print(UpdatePostsMutation),
    {
      data: mutationDatas,
    },
  )

  if (data?.updatePosts) {
    return data.updatePosts.map(post => post.id)
  }

  return []
}

export default async function updatePostDataToCMS(posts: RawPost[]) {
  const BATCH_SIZE = 100
  const postCount = posts.length
  const updatedPosts: string[] = []

  log(`There are ${postCount} posts to be updated.`)
  let begin = 0
  while (begin < postCount) {
    const batchPosts = posts.slice(begin, begin + BATCH_SIZE)
    const updated = await batchUpdatePosts(batchPosts, begin === 0)
    updatedPosts.push(...updated)

    begin += BATCH_SIZE
  }
  log(`There are ${updatedPosts.length} posts updateded.`)

  return updatedPosts
}
