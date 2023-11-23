import type { RawPost } from '../graphql/post'
import { setupEmptyDirectory, writeJson } from '../helpers/fs'
import { OUTDIR_BASE_PATH } from '../constants/config'
import { join } from 'node:path'
import getImageInfoesInSlideshowV2 from '../operations/get-image-infoes-in-slideshow-v2'
import {
  askQuestion,
  errorLog,
  getMigrationRootDirName,
  log,
  wrapFunctionWithDeps,
} from '../helpers/utils'
import writePostsToFiles from '../operations/writePostsToFiles'
import modifyContentData from '../operations/modify-content-data'
import { writeFile, appendFile } from 'node:fs/promises'
import {
  appendAttributesToImagesInSlideshowV2,
  appendUrlOriginalToVideosInVideo,
} from '../helpers/draft-js'
import updatePostDataToCMS from '../operations/update-post-data-to-cms'

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

  const ROOT_DIR = getMigrationRootDirName('migration01')
  const BACKUP_DIR = 'original'
  const PREPARE_DIR = 'modified'
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

  // get used image infoes
  const imageInfoes = await getImageInfoesInSlideshowV2(posts)
  const imageInfoCount = Object.keys(imageInfoes).length
  log(`Got ${imageInfoCount} image infoes.`)
  const imageInfoesFilePath = join(rootDirPath, 'image-infoes.json')
  await writeJson(imageInfoesFilePath, imageInfoes)

  const { modifiedPostIds, modifiedPosts } = modifyContentData(posts, [
    wrapFunctionWithDeps(appendAttributesToImagesInSlideshowV2, imageInfoes),
    appendUrlOriginalToVideosInVideo,
  ])

  // back up posts before operations
  {
    const originalPosts = posts.filter(post =>
      modifiedPostIds.includes(post.id),
    )
    const { ok, fail } = await writePostsToFiles(backupDirPath, originalPosts)

    if (fail !== 0) {
      errorLog(`There are ${fail} errors while backing up posts.`)
      process.exit(1)
    }
  }

  // write modified posts to files for debugging
  const modifiedPostIdsStr = modifiedPostIds.join(',')
  log(
    `There are ${modifiedPostIds.length} post's content got modified: `,
    modifiedPostIdsStr,
  )
  const modifiedPostIdsFilePath = join(rootDirPath, 'modified-post-ids.txt')
  if (initial) {
    await writeFile(modifiedPostIdsFilePath, modifiedPostIdsStr, {
      encoding: 'utf-8',
      flag: 'w+',
    })
  } else {
    await appendFile(modifiedPostIdsFilePath, `,${modifiedPostIdsStr}`, 'utf-8')
  }

  {
    const { ok, fail } = await writePostsToFiles(prepareDirPath, modifiedPosts)

    if (fail !== 0) {
      errorLog(`There are ${fail} errors while backing up modified posts.`)
      process.exit(1)
    }
  }

  const ans = await askQuestion(
    'About to update post data in CMS.  Press (Y/y) to confirm: ',
  )
  if (ans.toLowerCase() === 'y') {
    await updatePostDataToCMS(modifiedPosts)
  }

  log('Finished migration01')
}
