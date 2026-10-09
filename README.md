# EV Log

Track how much electricity your EV takes on every charge, and what it costs at home or at SPKLU.

- Enter the charge date, location (Home / SPKLU), and start and finish battery %.
- kWh added = `(finish% - start%) / 100 × battery capacity`.
- Cost = `kWh added × price per kWh` for the chosen location.
- Every session stores the battery capacity and price that were in effect when it was recorded, so changing prices later doesn't rewrite history.
- Dashboard with monthly, yearly, custom-range, and all-time summaries, split by Home vs SPKLU.

Stack: Nuxt 4, Drizzle ORM, Neon Postgres, `nuxt-auth-utils` (single-password login).

## Local setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NUXT_APP_PASSWORD, NUXT_SESSION_PASSWORD
npm run db:push        # create tables in the database
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In the Vercel project, go to **Storage → Create Database → Neon** and connect it. This adds `DATABASE_URL` automatically.
3. Add environment variables:
   - `NUXT_APP_PASSWORD`: the password you'll log in with.
   - `NUXT_SESSION_PASSWORD`: a random string of at least 32 characters (`openssl rand -base64 32`).
4. Create the tables once from your machine, using the Neon connection string:
   ```bash
   DATABASE_URL="postgresql://..." npm run db:push
   ```
5. Deploy.

## Database scripts

| Script | Purpose |
| --- | --- |
| `npm run db:push` | Sync the schema directly to the database |
| `npm run db:generate` | Generate SQL migration files into `server/db/migrations` |
| `npm run db:migrate` | Apply generated migrations |
| `npm run db:studio` | Browse data with Drizzle Studio |
