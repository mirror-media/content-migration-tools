import type {
  JSONValue,
  GenericGQLData,
} from '../types/common'
import axios from 'axios'
import { CMS_API_URL } from '../constants/config'
async function fireGqlRequest<T, U extends string>(
  query: string,
  variables: undefined | Record<string, JSONValue>,
  authToken?: string,
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
        Cookie: `keystonejs-session=${authToken}`,
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
export { fireGqlRequest, log, errorLog }
