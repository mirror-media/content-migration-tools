import type {
  JSONValue,
  GenericGQLData,
  ContentModificationFunction,
  ContentModificationFunctionWithDeps,
} from '../types/common'
import axios from 'axios'
import { CMS_API_URL } from '../constants/config'
import { RawPost } from '../graphql/post'

async function fireGqlRequest<T, U extends string>(
  query: string,
  variables: undefined | Record<string, JSONValue>,
) {
  const { data: result } = await axios.post<GenericGQLData<T, U>>(
    CMS_API_URL,
    {
      query,
      variables,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    },
  )

  if (result.errors) {
    throw new Error('GraphQL errors: ' + JSON.stringify(result.errors))
  }

  return result
}

function getFormattedTime() {
  return new Date().toISOString()
}

function log(...content: any[]) {
  console.log(getFormattedTime(), ...content)
}

function errorLog(...content: any[]) {
  console.error(getFormattedTime(), ...content)
}

function uniq<T>(arr: T[]) {
  const set = new Set()

  return arr.filter(item => {
    if (set.has(item)) {
      return false
    } else {
      set.add(item)
      return true
    }
  })
}

function wrapFunctionWithDeps(
  fn: ContentModificationFunction,
  ...deps: any
): ContentModificationFunctionWithDeps {
  const f = (post: RawPost) => fn(post, ...deps)
  // set function name
  Object.defineProperty(f, 'name', {
    value: fn.name,
    configurable: true,
  })
  return f
}

export { fireGqlRequest, log, errorLog, uniq, wrapFunctionWithDeps }
