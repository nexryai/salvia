# Salvia Next.js Application

This file is a handoff artifact for the separate Salvia repository. Copy it to
the Salvia repository root as `AGENTS.md` before implementing Salvia. Paths and
commands in this file refer to that repository unless explicitly stated
otherwise.

Do not add Salvia application code to the Rosmarinus repository. Do not modify
Rosmarinus as part of a Salvia task unless the task explicitly covers both
repositories and each repository receives its own coherent commit.

## Engineering Rules

- Write focused tests whenever practical.
- Avoid comments that narrate self-evident code line by line. Add concise
  comments where the rationale is not apparent from the code, especially at
  security boundaries, across data-ownership boundaries, and for intentional
  compatibility exceptions.
- Keep source files using LF line endings.

## Product Scope

Salvia is the browser application and Next.js backend for Rosmarinus. Salvia is
responsible for:

- authenticating local users and maintaining their application sessions;
- mapping each local account to one stable Ably `clientId`;
- issuing short-lived, narrowly scoped Ably credentials to authenticated
  browsers;
- presenting and updating browser UI state;
- reading federation state written by Rosmarinus;
- publishing authenticated commands to Rosmarinus over Ably; and
- consuming Rosmarinus result and domain events over Ably.

Salvia is not an ActivityPub server. It must not implement ActivityPub inboxes,
outboxes, HTTP Signatures, federation delivery, remote object resolution, or
local Actor key management.

## Rosmarinus Responsibilities

Rosmarinus is an ActivityPub microservice with no frontend and no public
Misskey-compatible API. It owns:

- ActivityPub protocol endpoints and federation compatibility;
- inbound ActivityPub parsing and HTTP Signature verification;
- outbound ActivityPub signing, delivery, retries, and queue processing;
- resolution and persistence of remote Actors and other remote objects;
- lifecycle and key material of local Actors;
- federation state such as notes, follows, reactions, blocks, and delivery
  records;
- authorization of every Salvia command against the authenticated Ably
  `clientId`, its local account, and the selected Actor; and
- command receipts, command results, and federation-related UI events.

Rosmarinus does not authenticate a browser user or create a Salvia session. It
accepts an Ably message identity only after resolving `clientId` through the
Salvia-owned account collection and checking Actor ownership itself.

## Integration Boundary

Salvia and Rosmarinus communicate only through:

1. their shared MongoDB database; and
2. Ably Pub/Sub.

Do not add direct HTTP, RPC, or gRPC calls between the two applications. Public
ActivityPub HTTP traffic terminates at Rosmarinus and is not a Salvia-to-
Rosmarinus application API.

MongoDB is the durable source of truth. Ably carries authenticated commands and
low-latency notifications; it is not the canonical store. After a reconnect,
missed event, or ambiguous command result, rebuild the UI from MongoDB.

## MongoDB Collection Ownership

Every collection has exactly one writer. Sharing a database does not grant
shared write ownership.

Salvia may:

- write only Salvia-owned collections, conventionally prefixed `salvia_`;
- create and manage indexes only on Salvia-owned collections; and
- read the documented Rosmarinus collections through narrow repository
  projections needed by the UI.

Salvia must never write, repair, migrate, or create indexes on Rosmarinus-owned
Actor, note, follow, reaction, block, federation, delivery, queue, or command
receipt collections. A requested UI mutation of federation state must be an
Ably command, not a MongoDB update.

At minimum, Salvia owns `salvia_accounts` with this cross-service projection:

```text
_id             stable local account ID
ablyClientId    stable, opaque, URL-safe Ably identity; unique
status          "active" | "suspended" | "deleted"
authzRevision   monotonically increasing integer
createdAt       creation time
updatedAt       last update time
deletedAt       deletion time, null or absent while not deleted
```

Additional authentication-provider fields may exist, but Rosmarinus must not
depend on them. Create unique indexes for `_id` and `ablyClientId` in Salvia.
Prefer soft deletion so historical ownership and federation records retain a
valid account reference.

Use separate MongoDB credentials for Salvia and Rosmarinus. Salvia's database
role should have write access only to Salvia-owned collections and read access
only to the Rosmarinus collections the UI needs.

Typical Salvia-only collections include `salvia_ui_settings` and
`salvia_actor_settings`. UI preferences for a Rosmarinus Actor belong there;
do not add UI-only fields to the Rosmarinus Actor document.

## Account and Actor Identity

An Ably `clientId` identifies one authenticated local account. It does not
identify an Actor, a browser tab, or an authentication-provider identity.

One local account may own any number of local Actors:

```text
Salvia account (_id, ablyClientId)
  -> Rosmarinus Actor A (ownerAccountId)
  -> Rosmarinus Actor B (ownerAccountId)
  -> Rosmarinus Actor C (ownerAccountId)
```

Actor selection is command data. Commands that act as an existing Actor carry
`actor_id`; Rosmarinus verifies that the Actor is local and that
`ownerAccountId` matches the account resolved from the Ably message
`clientId`. Never treat the browser's selected Actor or a payload account ID as
proof of authorization.

`actor.create` is account-scoped and therefore omits `actor_id`. Rosmarinus
assigns the authenticated account as the new Actor's owner.

## UI and Application Architecture

- Use the sibling `./misskey` directory as the visual reference and make the
  UI components look and behave close to their Misskey counterparts. Do not
  copy federation or backend behavior merely because it exists in Misskey.
- Aim for a substantially simplified Misskey experience. Do not implement
  advanced features such as widgets or Deck unless they are separately added
  to the product scope.
- Use Tailwind CSS for application styling.
- Use a yellow-based color theme by default. Allow each authenticated user to
  select another supported theme in settings, and persist that preference in a
  Salvia-owned UI settings collection rather than a Rosmarinus document.
- Use Tabler Icons for interface icons. Reuse icons from the Tabler set instead
  of drawing project-specific SVG icons when an appropriate Tabler icon exists.
- Extract reusable UI primitives into `./src/components/ui` and reusable
  application components into `./src/components` whenever a component has a
  coherent responsibility. Avoid leaving reusable components embedded in
  pages or feature routes.
- Name React component files in PascalCase, for example `HogeFuge.tsx`. Keep
  framework-mandated Next.js filenames such as `page.tsx`, `layout.tsx`,
  `loading.tsx`, `error.tsx`, and `route.ts` as the only naming exceptions.
- Use Next.js server-side rendering for initial, session-aware, and
  MongoDB-backed views. Add client components only where browser APIs or
  interactive state require them, and keep those client boundaries narrow.
- Update visible timelines in real time from account-scoped Ably events. Treat
  events as invalidation hints, reconcile against MongoDB as the source of
  truth, and preserve the currently visible timeline during reconnects.
- Display Misskey-style custom emoji reactions on notes. Do not reduce the
  reaction UI to a generic like, heart, or favorite count.
- Use `pnpm` commands to add, remove, or update packages and commit the
  resulting `pnpm-lock.yaml` changes.

The sibling `./rosmarinus` directory may be inspected to understand data and
integration contracts, but it must not be edited as part of Salvia work.
Rosmarinus Users/Salvia accounts and Rosmarinus Actors are distinct concepts:
an authenticated user account may own multiple Actors. UI naming, routes,
session state, and authorization checks must preserve that distinction.

## Passkey-Only Authentication

- Authenticate users exclusively with passkeys (WebAuthn). Do not implement
  passwords, password reset flows, password-derived credentials, or TOTP.
- When no user account exists, expose a one-time initial administrator setup.
  After the administrator chooses a username, immediately require successful
  passkey registration before completing account creation and establishing the
  session.
- Enforce initial-setup eligibility and account creation on the server with an
  atomic uniqueness/initialization guard so concurrent requests cannot create
  multiple initial administrators.
- Once at least one user is registered, close public registration and expose
  login only. Do not rely on a hidden client-side registration route for this
  restriction.
- Keep WebAuthn challenges short-lived, single-use, bound to the intended
  ceremony and session, and verified server-side. Derive relying-party and
  origin settings from validated server configuration.
- Store passkey credential material in Salvia-owned collections. Never place
  authentication credential data on a Rosmarinus Actor document.

## Ably Authentication and Authorization

Only the Salvia backend may issue browser Ably credentials. The token endpoint
must:

- authenticate the existing Salvia session;
- load the corresponding `salvia_accounts` row;
- reject suspended, deleted, or missing accounts;
- fix the token identity to the stored `ablyClientId`;
- issue a short-lived token or JWT;
- grant only the capabilities below; and
- return `Cache-Control: no-store`.

For account `{accountId}`, browser capability is limited to:

```json
{
  "rosmarinus:commands": ["publish"],
  "rosmarinus:accounts:{accountId}:events": ["subscribe"]
}
```

Do not accept `clientId`, account ID, Actor ID, or channel names from the token
request. Derive them from the authenticated session and database. Never expose
an Ably API key or signing secret to browser code. Keep browser-token signing
credentials separate from the server credential that publishes account
authorization control messages.

Use the Ably SDK's `authUrl` or `authCallback` renewal flow. Subscribe to the
account event channel before publishing a command whenever the UI needs its
result.

## Command Contract

Publish commands to `rosmarinus:commands`. The Ably message `clientId` is the
authenticated account identity. The JSON payload envelope is:

```json
{
  "version": 1,
  "request_id": "stable unique request ID",
  "actor_id": "local Actor ID; omitted only where documented",
  "data": {}
}
```

Use these Ably message names and payloads:

- `actor.create`: omit `actor_id`; `data` contains `username`, and may contain
  `name` and `type`.
- `post.create`: `data` contains `note_id` and `text`, and may contain
  `visibility`, `content_warning`, `sensitive`, `in_reply_to_uri`, `quote_uri`,
  `mention_uris`, and `hashtags`.
- `follow.approve`: `data` contains `follower_id`; top-level `actor_id` is the
  local followee Actor.
- `follow.reject`: the same addressing rules as `follow.approve`.

Generate `request_id` in Salvia before the first publish. A retry of the same
logical operation must reuse it. Do not insert account IDs or user IDs into
command payloads as an authorization mechanism.

## Event Contract

Subscribe only to `rosmarinus:accounts:{accountId}:events`. Events use:

```json
{
  "version": 1,
  "type": "event type",
  "request_id": "present for correlated commands",
  "actor_id": "present when applicable",
  "occurred_at": "RFC 3339 timestamp",
  "data": {}
}
```

Handle at least `command.succeeded`, `command.failed`, `actor.created`,
`post.created`, `notification.created`, `follow.approval.requested`,
`follow.approval.completed`, and `follow.approval.rejected`.
`command.succeeded.data` contains `command` and optional `result`;
`command.failed.data` contains `command` and `code`. Multiple tabs for the same
account can receive the same event, so event handlers and UI notifications must
be idempotent. Use `request_id` to correlate a response, but do not assume that
receiving an event means the browser's local state is canonical.

The current Rosmarinus handler can reject malformed, unauthenticated, or
unauthorized commands before it creates a receipt and publishes a result. A
browser timeout is therefore an ambiguous outcome, not a machine-readable
authorization result. Refresh canonical state and retry the same logical
request with the same `request_id` when appropriate. If the UI requires typed
pre-execution failures, add that as a versioned Rosmarinus contract change.

## Account Lifecycle

When suspending, deleting, or otherwise changing account authorization:

1. update `salvia_accounts.status` and increment `authzRevision` atomically;
2. stop issuing browser tokens immediately; and
3. publish `account.authorization.changed` to
   `rosmarinus:control:accounts` with:

```json
{
  "account_id": "account ID",
  "authz_revision": 2
}
```

The database write must happen first. The control message is only an
invalidation hint; Rosmarinus re-reads the Salvia-owned row and periodically
reconciles it. Retrying the same revision is safe. Salvia must not modify or
delete the account's Actors as part of this flow.

## Engineering Rules

- Follow modern Next.js and TypeScript practices already established in the
  Salvia repository.
- Keep authentication, repositories, Ably clients, clocks, ID generators, and
  loggers behind focused interfaces where dependency injection improves tests.
- Validate environment configuration at startup and load all runtime
  configuration from environment variables.
- Keep credentials and token issuance code in server-only modules.
- Validate all database documents, command inputs, and event envelopes at
  runtime; TypeScript types alone are not a trust boundary.
- Log meaningful lifecycle and command-correlation events without logging
  sessions, JWTs, API keys, or sensitive command content.
- Write focused unit and integration tests whenever practical.
- Keep source files using LF line endings.

## Git Workflow

- Commit changes frequently at small, appropriate implementation boundaries.
  Do not accumulate multiple independently verifiable changes into one large
  commit when they can be reviewed and committed separately.
- Each commit must remain coherent and complete: include its focused tests and
  related documentation, and do not commit a knowingly broken intermediate
  state merely to increase commit frequency.
- Make commits at coherent implementation checkpoints after verification
  passes. Do not mix unrelated or unfinished changes into a commit.
- Before every Salvia commit, run these commands in this exact order:

  ```sh
  pnpm format
  pnpm lint
  pnpm build
  ```

- If any command fails, fix the failure and rerun the sequence before
  committing.
- Always create signed git commits.
- If commit signing fails, do not create an unsigned commit. Stop and notify
  the user that the commit could not be signed.
