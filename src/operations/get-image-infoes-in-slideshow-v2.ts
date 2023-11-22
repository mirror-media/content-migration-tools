import { print } from 'graphql'
import { fireGqlRequest, log, uniq } from '../helpers/utils'
import type { RawPost } from '../graphql/post'
import { getImageIdsInSlideshowV2 } from '../helpers/draft-js'
import { GetImageInfoes, type RawPhoto } from '../graphql/photos'
import type { ImageInfo } from '../types/common'

export default async function getImageInfoesInSlideshowV2(posts: RawPost[]) {
  const imageInfoes: ImageInfo = {}
  const imageIdList: string[] = []
  posts.forEach(post => {
    imageIdList.push(...getImageIdsInSlideshowV2(post.content))
  })

  const uniqImageIdList = uniq(imageIdList)
  log(`There are ${uniqImageIdList.length} unique images`)

  const { data } = await fireGqlRequest<RawPhoto[], 'photos'>(
    print(GetImageInfoes),
    {
      ids: uniqImageIdList,
    },
  )

  if (!data) return imageInfoes

  data.photos.forEach(photo => {
    if (photo.imageFile) {
      const id = photo.id
      imageInfoes[id] = photo.imageFile
    }
  })

  return imageInfoes
}
