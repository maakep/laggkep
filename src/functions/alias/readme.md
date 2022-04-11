# ALIAS

Service for storing & retrieving aliases. Always returns json.

# POST /alias

Creates or adds aliases to id

```json
{
  "id": "string, ex <@123123123>",
  "aliases": ["array"]
}
```

# GET /alias

Gets id(s) based on alias(es)

```json
{
  "id": "string, ex <@123123123>",
  "aliases": ["array"]
}
```

# GET /alias/query

Executes custom query. [Query documentation here.](https://firebase.google.com/docs/firestore/query-data/queries)

```json
{
  "args": ["aliases", "array-contains-any", ["foo", "bar"]]
}
```

# GET /alias/all

Gets all users & aliases

```json
{
  /* no body needed */
}
```

# DELETE /alias

Deletes specified aliases from id

```json
{
  "id": "string, ex <@123123123>",
  "aliases": ["array", "of", "aliases"]
}
```

# DELETE /alias/id

Deletes entire user and all aliases

```json
{
  "id": "string, ex <@123123123>"
}
```
