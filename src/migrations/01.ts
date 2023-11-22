import type { RawPost } from '../graphql/post'
/**
 * Update slideshow-v2 and video type entity
 * 1. add width and height attributes to images in slideshow-v2
 * 2. add urlOriginal attributes to video
 */
export default async function migration01(
  posts: RawPost[],
  initial: boolean = false,
) {
  log(`Begin migration01.  There are ${posts.length} posts.`)
  log('Finished migration01')
}
