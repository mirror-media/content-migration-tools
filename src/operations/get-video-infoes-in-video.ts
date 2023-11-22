import { print } from 'graphql'
import { fireGqlRequest, log, uniq } from '../helpers/utils'
import type { RawPost } from '../graphql/post'
import { getVideoIdsInVideo } from '../helpers/draft-js'
import type { VideoInfo } from '../types/common'
import { GetVideoInfoes, type RawVideo } from '../graphql/video'

export default async function getVideoInfoesInVideo(posts: RawPost[]) {
  const videoInfoes: VideoInfo = {}
  const videoIdList: string[] = []
  posts.forEach(post => {
    videoIdList.push(...getVideoIdsInVideo(post.content))
  })

  const uniqVideoIdList = uniq(videoIdList)
  log(`There are ${uniqVideoIdList.length} unique videos`)

  const { data } = await fireGqlRequest<RawVideo[], 'videos'>(
    print(GetVideoInfoes),
    {
      ids: uniqVideoIdList,
    },
  )

  if (!data) return videoInfoes

  data.videos.forEach(video => {
    if (video.file) {
      const id = video.id
      videoInfoes[id] = video.file.filename
    }
  })

  return videoInfoes
}
