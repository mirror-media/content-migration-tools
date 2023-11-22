import { constants } from 'node:fs'
import { mkdir, access } from 'node:fs/promises'
async function ensureDirectory(dir: string) {
  try {
    await access(dir, constants.W_OK)
  } catch (e) {
    await mkdir(dir)
  }
}
export { ensureDirectory }
