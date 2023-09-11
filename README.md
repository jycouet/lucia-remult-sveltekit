# Email & password example with Lucia and SvelteKit

This example uses SQLite3 with `better-sqlite3`.

```bash
# install dependencies
pnpm i

# run dev server
pnpm dev
```

## User schema

| id               | type                    | unique |
| ---------------- | ----------------------- | :----: |
| `id`             | `string`                |        |
| `email`          | `string`                |   ✓    |
| `email_verified` | `number` (as `boolean`) |   ✓    |

```
CREATE TABLE auth_user (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    email_verified integer NOT NULL
);

CREATE TABLE user_key (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    hashed_password TEXT
);

CREATE TABLE user_session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);
```
