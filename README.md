This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment variables

Copy the checked-in example before starting Salvia:

```bash
cp .env.example .env.local
```

The required configuration is grouped as follows:

- `MONGODB_URI` and `MONGODB_DATABASE` connect Salvia to the shared database
  using Salvia-specific, collection-scoped credentials.
- `WEBAUTHN_RP_ID`, `WEBAUTHN_RP_NAME`, and `WEBAUTHN_ALLOWED_ORIGINS` define
  the passkey relying party and accepted browser origins.
- `SESSION_SECRET`, `SESSION_COOKIE_NAME`, and `SESSION_TTL` configure Salvia
  application sessions. `SESSION_SECRET` must contain at least 32 random bytes
  encoded as base64url.
- `ABLY_BROWSER_TOKEN_API_KEY` issues narrowly scoped browser credentials;
  `ABLY_CONTROL_API_KEY` publishes account authorization invalidations. Keep
  the keys separate and server-only.
- `ABLY_TOKEN_TTL`, `ABLY_COMMAND_CHANNEL`,
  `ABLY_ACCOUNT_EVENT_NAMESPACE`, and `ABLY_ACCOUNT_CONTROL_CHANNEL` configure
  the versioned Rosmarinus Ably contract. The channel values in
  `.env.example` are the required defaults.

Never put a Rosmarinus MongoDB credential, an Ably API key, or the session
secret in a `NEXT_PUBLIC_` variable.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
