import gql from 'graphql-tag'

export type RawImageFile = {
  width: number
  height: number
}

export type RawPhoto = {
  id: string
  imageFile: RawImageFile | null
}

export const GetImageInfoes = gql`
  query getImageInfoes($ids: [ID!]) {
    photos(where: { id: { in: $ids } }) {
      id
      imageFile {
        width
        height
      }
    }
  }
`
