import gql from 'graphql-tag'

export type RawAuthResult = {
  sessionToken?: string
  message?: string
}

export const GetAuthMutation = gql`
  mutation ($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`
