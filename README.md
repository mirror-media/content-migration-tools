# Content Migration Tools

該專案用於將 draft-js json 進行轉換處理，並將轉換後的結果寫入 CMS

## Environment Variables

| 變數名稱        | 資料型態 | 初始值                          | 變數說明                                                                          |
| --------------- | -------- | ------------------------------- | --------------------------------------------------------------------------------- |
| CMS_API_URL     | string   | ''                              | CMS GraphQL API 網址                                                              |
| SHOULD_GET_AUTH | boolean  | `false`                         | CMS API 連接是否需要登入驗證，為 `true` 的情況下，搭配 USER_NAME 和 PASSWORD 使用 |
| USER_NAME       | string   | ''                              | CMS API 登入用戶名稱                                                              |
| PASSWORD        | string   | ''                              | CMS API 登入用戶密碼                                                              |
| BEGIN_DATE_TIME | string   | `<今日日期>`                    | 過濾文章的起始時間（ISO 8601 格式）                                               |
| END_DATE_TIME   | string   | `<今日日期>`                    | 過濾文章的截止時間（ISO 8601 格式）                                               |
| GCS_BUCKET      | string   | 'v3-statics-dev.mirrormedia.mg' | GCS bucket 名稱                                                                   |

## Environment Variables (only used by `update-cms` script)

| 變數名稱         | 資料型態 | 初始值 | 變數說明                                          |
| ---------------- | -------- | ------ | ------------------------------------------------- |
| MIGRATION_NAME   | string   | ''     | migration 輸出的根目錄名稱                        |
| POST_CONTENT_DIR | string   | ''     | migration 輸出的 draft-js json content 的目錄名稱 |

## Usage Guide

### Project Setup

1. 安裝依賴

```
yarn install
```

2. 設定環境變數，在專案根目錄建立 `.env`，並將環境變數寫至該檔案

### Generate backups and update data to CMS

```
yarn start
```

### Update data to CMS with previous generated files

- 該方法適用於還原或更新的情境

```
yarn run update-cms
```

### Project Direcotry Explanation

```
/src            - root directory for source codes
/src/constants  - config files, shared constant variables
/src/types      - shared type definitions
/src/migrations - migrations (sets of operations)
/src/operations - operations (each for only one purpose)
/src/graphql    - graphql queries
/src/helpers    - helper funcitons
/files          - root directory for files generated during migration process
```
