# Email & password example with Lucia and SvelteKit

This example uses SQLite3 with `remult`.

```bash
# install dependencies
pnpm i

# run dev server
pnpm dev
```

## User schema # TODO

| id               | type                    | unique |
| ---------------- | ----------------------- | :----: |
| `id`             | `string`                |        |
| `email`          | `string`                |   ✓    |
| `email_verified` | `number` (as `boolean`) |   ✓    |

<!-- TODO roles -->
<!-- TODO user_id -->
<!-- TODO Check with prisma cadb -->
<!-- TODO Check with another app (PWA) -->
<!-- TODO GUIDE
	1/ alias $auth
-->
