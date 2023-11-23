import gql from 'graphql-tag'
import type { JSONValue } from '../types/common'

export type RawPost = {
  id: string
  content: JSONValue | null
}

export const GetPostCountQuery = gql`
  query ($beginDate: DateTime!, $endDate: DateTime!) {
    count: postsCount(
      where: {
        AND: [
          { createdAt: { gte: $beginDate } }
          { createdAt: { lt: $endDate } }
        ]
      }
    )
  }
`

export const GetPostsQuery = gql`
  query (
    $beginDate: DateTime!
    $endDate: DateTime!
    $skip: Int = 0
    $take: Int = 100
  ) {
    posts(
      where: {
        AND: [
          { createdAt: { gte: $beginDate } }
          { createdAt: { lt: $endDate } }
        ]
      }
      orderBy: { createdAt: asc }
      take: $take
      skip: $skip
    ) {
      id
      content
    }
  }
`

export const UpdatePostsMutation = gql`
  mutation ($data: [PostUpdateArgs!]!) {
    updatePosts(data: $data) {
      id
      content
    }
  }
`
