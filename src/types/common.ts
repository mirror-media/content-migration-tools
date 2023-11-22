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
