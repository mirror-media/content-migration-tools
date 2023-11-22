import { constants } from 'node:fs'
import { mkdir, access, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
async function ensureDirectory(dir: string) {
  try {
    await access(dir, constants.W_OK)
  } catch (e) {
    await mkdir(dir)
  }
}

async function setupEmptyDirectory(dir: string) {
  await ensureDirectory(dir)

  const nodes = await readdir(dir)

  if (nodes.length) {
    const tasks = []

    for (let node of nodes) {
      const path = join(dir, node)
      tasks.push(rm(path))
    }

    await Promise.allSettled(tasks)
  }
}
export { ensureDirectory, setupEmptyDirectory }
