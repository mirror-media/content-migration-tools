import { ContentModificationFunctionWithDeps } from '../types/common'
import type { RawPost } from '../graphql/post'

export default function modifyContentData(
  posts: RawPost[],
  modificationFns: ContentModificationFunctionWithDeps[],
) {
  const modifiedPostIds: string[] = []
  const newPosts = posts.map(post => {
    const [isUpdated, modifiedContent] = modificationFns.reduce(
      ([oldUpdated, oldContent], fn) => {
        const [newUpdated, newContent] = fn(oldContent)

        return [oldUpdated || newUpdated, newContent]
      },
      [false, post.content],
    )

    if (isUpdated) modifiedPostIds.push(post.id)
    post.content = modifiedContent

    return post
  })

  return {
    modifiedPostIds,
    modifiedPosts: newPosts.filter(post => modifiedPostIds.includes(post.id)),
  }
}
