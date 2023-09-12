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
