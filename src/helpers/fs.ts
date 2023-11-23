import { constants } from 'node:fs'
import { mkdir, access, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { JSONValue } from '../types/common'
import { errorLog } from './utils'

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

async function writeJson(path: string, json: JSONValue) {
  try {
    const content = await readFile(path, 'utf-8')
    const oldJson = JSON.parse(content)
    const newJson = Object.assign({}, oldJson, json)
    await writeFile(path, JSON.stringify(newJson), {
      encoding: 'utf-8',
      flag: 'w',
    })

    return
  } catch (err) {}

  try {
    await writeFile(path, JSON.stringify(json), {
      encoding: 'utf-8',
      flag: 'w+',
    })
  } catch (err) {
    errorLog('Error on writeJson: ', path)
    errorLog(err)
  }
}

export { ensureDirectory, setupEmptyDirectory, writeJson }
