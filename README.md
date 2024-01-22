## Nest.js auth skeleton

This is the nest.js back-end group chat project.

### To start the project
- clone the project
- create .env file
 - ##### Set up the env variables
   - DB_URL(postgres)
   - JWT_ACCESS_TOKEN_SECRET
   - JWT_REFRESH_TOKEN_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GITHUB_CLIENT_ID
   - GITHUB_CLIENT_SECRET
   - run `pnpm install`
   - run `pnpm push` to load the postgresql
   - run `pnpm start:dev`

#### Optionally
- run `pnpm studio` to access drizzle studio

### Apis
  - `/auth/signup`
  - `/auth/login`
  - `/auth/refresh`
  - `/auth/google`
  - `/auth/github`
  - `/users/me`
