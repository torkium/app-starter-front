# app-starter-front

Production-minded Next.js 16 frontend foundation built for JWT + refresh-token applications, centered on `User`, with SSR auth, API proxying, runtime config, and a neutral UI foundation.

This repo is designed to be reusable on its own, or as part of a full application stack with:
- `app-starter-back`: the companion Symfony backend foundation
- `app-starter-infra`: the companion Docker/CI-CD/operations foundation

## Purpose

Use `app-starter-front` when you want a frontend foundation that already solves the non-business layer:

- SSR-safe authentication flows
- protected and public routes
- backend proxying
- runtime environment exposure
- realtime client wiring
- cookie consent and PWA setup
- neutral design system primitives
- design-system hierarchy with primitives, molecules, organisms, and app feature wrappers

The foundation intentionally contains no product-specific business UI and no project-specific domain pages.

## What Is Included

- Next.js 16 App Router
- React 19
- Node 24 runtime contract
- SSR auth with httpOnly cookies
- public routes for login, register, forgot/reset password, verify email
- private route shell for authenticated pages
- generic API client stack with client/server/proxy services
- propagated `X-Request-Id` across middleware, proxy, and API calls
- hardened Next proxy for backend calls
- billing shell
- media shell with direct upload flow
- PWA install and push-notification foundations
- Mercure client wiring
- runtime public config endpoint
- Storybook sandbox for design-system primitives
- Vitest tests
- Docker local setup and Make targets

## Prerequisites

- Docker Engine with Docker Compose support
- GNU Make

## Companion Repositories

- `app-starter-back`
  Use it if you want the matching backend that already exposes auth, account, billing, realtime, media, and outbox foundations expected by this frontend.

- `app-starter-infra`
  Use it if you want the full stack orchestrator with Nginx, Mercure, Compose, CI/CD, observability, and deployment automation.

Typical combinations:
- `app-starter-front` alone: bring your own compatible backend and infrastructure
- `app-starter-front` + `app-starter-back`: application layer only, with your own infra
- `app-starter-front` + `app-starter-back` + `app-starter-infra`: full application platform

## Quick Start

For the full My App stack, prefer `app-starter-infra` and its `make dev-up` flow. The Compose file in this repository is intended for frontend-only work, Storybook, and isolated local debugging.

```bash
make init
make up
```

Design-system sandbox in local dev:

```bash
make storybook
```

To initialize this repository for a named project, run:

```bash
./scripts/init-project.sh \
  --project-name my-app \
  --back-repo my-app-back \
  --front-repo my-app-front \
  --infra-repo my-app-infra
```

Local application:

```text
http://localhost:3000
http://localhost:6006
```

## Core Runtime Variables

- `API_BASE_URL`: backend base URL used by server-side flows
- `NEXT_PUBLIC_APP_NAME`: runtime public application name
- `NEXT_PUBLIC_APP_URL`: public application URL
- `NEXT_PUBLIC_MERCURE_URL`: Mercure public URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `NEXT_PUBLIC_MEDIA_BASE_URL`: exposed media base URL
- `NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL`: direct-upload target origin
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: VAPID public key for web push

## Local Validation

```bash
make lint
make typecheck
make test
make validate-public-runtime
make build
make storybook-build
make check
```

## Useful Commands

```bash
make ps
make config
make restart
make health
make logs
make logs-storybook
make sh
make tooling-sh
```

## Expected Backend Contracts

This frontend does not require `app-starter-back`, but it expects a backend with equivalent capabilities.

Billing:
- `GET API_BILLING_PLANS_PATH`
- `GET API_BILLING_SUBSCRIPTION_PATH`
- `GET API_BILLING_HISTORY_PATH`
- `POST API_BILLING_CHECKOUT_PATH`

Media:
- `POST API_MEDIA_UPLOAD_PREPARE_PATH`
- `POST API_MEDIA_UPLOAD_COMPLETE_PATH`
- `GET API_MEDIA_LIBRARY_PATH`

Push:
- `GET/POST/DELETE API_PUSH_SUBSCRIPTIONS_PATH`

Auth/account:
- login, register, refresh, logout
- password reset flows
- email verification flows
- current user endpoint

## Suggested Workflow With The Companion Repositories

If you use the full trio:

1. Initialize `app-starter-back`
2. Initialize `app-starter-front`
3. Initialize `app-starter-infra`
4. Start the integrated stack from `app-starter-infra`

For full-stack environment bootstrap and deployment wiring, see the related documentation in `app-starter-infra`.
