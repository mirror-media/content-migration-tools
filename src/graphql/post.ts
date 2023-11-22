import gql from 'graphql-tag'
import type { JSONValue } from '../types/common'

export type RawPost = {
  id: string
  title: string
  slug: string
  publishedDate: string
  createdAt: string
  updatedAt: string
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
      title
      slug
      publishedDate
      createdAt
      updatedAt
      content
    }
  }
`
