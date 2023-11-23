import { fireGqlRequest } from './utils'
import { print } from 'graphql'
import type { RawAuthResult } from '../graphql/auth'
import { GetAuthMutation } from '../graphql/auth'

async function getAuth(
  username: string,
  password: string,
): Promise<[boolean, string]> {
  const { data } = await fireGqlRequest<
    RawAuthResult,
    'authenticateUserWithPassword'
  >(print(GetAuthMutation), {
    email: username,
    password: password,
  })

  if (data?.authenticateUserWithPassword) {
    const { sessionToken, message } = data.authenticateUserWithPassword

    if (sessionToken) return [true, sessionToken]
    else if (message) return [false, message]
  }

  return [false, '']
}

export { getAuth }
