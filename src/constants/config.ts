import 'dotenv/config'
import { env, cwd } from 'node:process'
import { join } from 'node:path'

export const CMS_API_URL = env.CMS_API_URL ?? ''

export const SHOULD_GET_AUTH = env.SHOULD_GET_AUTH === 'true'

export const USER_NAME = env.USER_NAME ?? ''

export const PASSWORD = env.PASSWORD ?? ''

export const BEGIN_DATE_TIME = env.BEGIN_DATE_TIME ?? new Date().toISOString()

export const END_DATE_TIME = env.END_DATE_TIME ?? new Date().toISOString()

export const OUTDIR_BASE_PATH = join(cwd(), 'files')
