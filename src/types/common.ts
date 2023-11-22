import { RawImageFile } from '../graphql/photos'

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>

export type GenericGQLData<T, U extends string> = {
  data?: Record<U, T>
  errors?: JSONValue
}

export type ImageInfo = Record<string, RawImageFile>

export type VideoInfo = Record<string, string>

export type ContentModificationFunction = (
  content: JSONValue,
  ...deps: any[]
) => [boolean, JSONValue]

export type ContentModificationFunctionWithDeps = (
  content: JSONValue,
) => [boolean, JSONValue]
