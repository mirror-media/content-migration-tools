import gql from 'graphql-tag'

export type RawVideoFile = {
  filename: string
}

export type RawVideo = {
  id: string
  file: RawVideoFile | null
}

export const GetVideoInfoes = gql`
  query getVideoInfos($ids: [ID!]) {
    videos(where: { id: { in: $ids } }) {
      id
      file {
        filename
      }
    }
  }
`
