import type { RawPost } from '../graphql/post'
import { setupEmptyDirectory } from '../helpers/fs'
import { OUTDIR_BASE_PATH } from '../constants/config'
import { join } from 'node:path'
import getImageInfoesInSlideshowV2 from '../operations/get-image-infoes-in-slideshow-v2'
import writePostsToFiles from '../operations/writePostsToFiles'
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

  const ROOT_DIR = 'migration01'
  const BACKUP_DIR = 'backup'
  const PREPARE_DIR = 'prepare'
  const rootDirPath = join(OUTDIR_BASE_PATH, ROOT_DIR)
  const backupDirPath = join(rootDirPath, BACKUP_DIR)
  const prepareDirPath = join(rootDirPath, PREPARE_DIR)
  if (initial) {
    await setupEmptyDirectory(rootDirPath)
    log(`rootDirPath: ${rootDirPath} exists.`)
    await setupEmptyDirectory(backupDirPath)
    log(`backupDirPath: ${backupDirPath} exists.`)
    await setupEmptyDirectory(prepareDirPath)
    log(`backupDirPath: ${prepareDirPath} exists.`)
  }

  // back up posts before operations
  {
    const { ok, fail } = await writePostsToFiles(backupDirPath, posts)

    if (fail !== 0) {
      errorLog(`There are ${fail} errors while backing up posts.`)
      return
    }
  }

  // get used image infoes
  const imageInfoes = await getImageInfoesInSlideshowV2(posts)
  const imageInfoCount = Object.keys(imageInfoes).length
  log(`Got ${imageInfoCount} image infoes.`)

  const { modifiedPostIds, modifiedPosts } = modifyContentData(posts, [
    wrapFunctionWithDeps(appendAttributesToImagesInSlideshowV2, imageInfoes),
    appendUrlOriginalToVideosInVideo,
  ])

  log('Finished migration01')
}
