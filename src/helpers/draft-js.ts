import type { JSONValue, ImageInfo } from '../types/common'
import { GCS_BUCKET } from '../constants/config'

function getItemIdsByType(
  content: JSONValue,
  typeKey: string,
  itemKey: string,
) {
  const ENTITY_KEY = 'entityMap'
  const ids: string[] = []

  if (
    typeof content === 'object' &&
    content !== null &&
    Object.hasOwn(content, ENTITY_KEY) &&
    typeof content[ENTITY_KEY] === 'object'
  ) {
    const entities = content[ENTITY_KEY]

    if (entities === null) return ids

    Object.entries(entities).forEach(([, entity]) => {
      if (
        typeof entity === 'object' &&
        entity !== null &&
        Object.hasOwn(entity, 'type') &&
        String(entity['type']).toLowerCase() === typeKey
      ) {
        const data = entity['data']

        if (data === null) return

        if (
          typeof data === 'object' &&
          Object.hasOwn(data, itemKey) &&
          Array.isArray(data[itemKey])
        ) {
          ;(data[itemKey] as JSONValue[]).forEach(item => {
            if (
              typeof item === 'object' &&
              item !== null &&
              Object.hasOwn(item, 'id') &&
              typeof item['id'] === 'string'
            ) {
              ids.push(item['id'])
            }
          })
        }
      }
    })
  }

  return ids
}

function getImageIdsInSlideshowV2(content: JSONValue) {
  return getItemIdsByType(content, 'slideshow-v2', 'images')
}

function getVideoIdsInVideo(content: JSONValue) {
  return getItemIdsByType(content, 'video', 'video')
}

function appendAttributesToImagesInSlideshowV2(
  content: JSONValue,
  imageInfoes: ImageInfo,
): [boolean, JSONValue] {
  const ENTITY_KEY = 'entityMap'
  const TYPE_KEY = 'slideshow-v2'
  const ITEM_KEY = 'images'
  let updated = false

  if (
    typeof content === 'object' &&
    content !== null &&
    Object.hasOwn(content, ENTITY_KEY) &&
    typeof content[ENTITY_KEY] === 'object'
  ) {
    const entities = content[ENTITY_KEY]

    if (entities === null) return [updated, content]

    Object.entries(entities).forEach(([, entity]) => {
      if (
        typeof entity === 'object' &&
        entity !== null &&
        Object.hasOwn(entity, 'type') &&
        String(entity['type']).toLowerCase() === TYPE_KEY
      ) {
        const data = entity['data']

        if (data === null) return

        if (
          typeof data === 'object' &&
          Object.hasOwn(data, ITEM_KEY) &&
          Array.isArray(data[ITEM_KEY])
        ) {
          data[ITEM_KEY].forEach(image => {
            if (
              typeof image === 'object' &&
              image !== null &&
              Object.hasOwn(image, 'id') &&
              typeof image['id'] === 'string' &&
              Object.hasOwn(imageInfoes, image['id']) &&
              Object.hasOwn(image, 'imageFile') &&
              typeof image['imageFile'] === 'object' &&
              image['imageFile'] !== null &&
              !Array.isArray(image['imageFile'])
            ) {
              const info = imageInfoes[image['id']]
              image['imageFile']['width'] = info.width
              image['imageFile']['height'] = info.height
              updated = true
            }
          })
        }
      }
    })
  }

  return [updated, content]
}

function appendUrlOriginalToVideosInVideo(
  content: JSONValue,
): [boolean, JSONValue] {
  const ENTITY_KEY = 'entityMap'
  const TYPE_KEY = 'video'
  const ITEM_KEY = 'video'
  let updated = false

  if (
    typeof content === 'object' &&
    content !== null &&
    Object.hasOwn(content, ENTITY_KEY) &&
    typeof content[ENTITY_KEY] === 'object'
  ) {
    const entities = content[ENTITY_KEY]

    if (entities === null) return [updated, content]

    Object.entries(entities).forEach(([, entity]) => {
      if (
        typeof entity === 'object' &&
        entity !== null &&
        Object.hasOwn(entity, 'type') &&
        String(entity['type']).toLowerCase() === TYPE_KEY
      ) {
        const data = entity['data']

        if (data === null) return

        if (
          typeof data === 'object' &&
          Object.hasOwn(data, ITEM_KEY) &&
          typeof data[ITEM_KEY] === 'object' &&
          data[ITEM_KEY] !== null
        ) {
          const video = data[ITEM_KEY]
          if (
            typeof video === 'object' &&
            video !== null &&
            Object.hasOwn(video, 'file') &&
            typeof video['file'] === 'object' &&
            video['file'] !== null &&
            Object.hasOwn(video['file'], 'filename') &&
            typeof video['file']['filename'] === 'string' &&
            video['file']['filename'].length > 0 &&
            !video['urlOriginal']
          ) {
            video['urlOriginal'] = getUrlOrignalOfVideo(
              GCS_BUCKET,
              video['file']['filename'],
            )
            updated = true
          }
        }
      }
    })
  }

  return [updated, content]
}

function getUrlOrignalOfVideo(bucket: string, filename: string) {
  const GCS_BASE = 'https://storage.googleapis.com/'

  return `${GCS_BASE}/${bucket}/files/${filename}`
}

export {
  getImageIdsInSlideshowV2,
  getVideoIdsInVideo,
  appendAttributesToImagesInSlideshowV2,
  appendUrlOriginalToVideosInVideo,
  getUrlOrignalOfVideo,
}
