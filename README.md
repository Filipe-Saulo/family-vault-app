# Family Vault

A personal finance and transaction-tracking mobile app, built with **React Native (Expo SDK 57)** and **TypeScript**. Family Vault is the mobile client for [`Family-Vault-Api`](https://github.com/Filipe-Saulo/Family-Vault-Api), a .NET 8 backend — together they form a full-stack portfolio project covering authentication, role-based access, CRUD flows, and data visualization.

> 📱 Built as a portfolio project to demonstrate production-oriented mobile architecture: typed forms, token-refresh auth, query caching, and reusable native UI components built from scratch (no third-party UI kit beyond primitives).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) (React Native 0.86, React 19) |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation (bottom tabs + nested native-stacks) |
| Server state | [TanStack React Query](https://tanstack.com/query) |
| Client state | [Zustand](https://github.com/pmndrs/zustand) |
| Forms & validation | React Hook Form + Zod |
| HTTP | Axios (single instance, JWT refresh interceptor with request queueing) |
| Persistence | `react-native-mmkv` (secure token storage) |
| Styling | NativeWind (Tailwind for React Native) + `react-native-reusables` |
| Icons | `lucide-react-native` |

## Features

- **Authentication** — login by e-mail or phone number, registration flow, JWT access + refresh tokens with automatic silent refresh and concurrent-request queueing on 401.
- **Role/permission-aware UI** — claims decoded from the JWT (`Administrator` / `User`) gate what a screen allows (e.g. who can filter transactions by another user).
- **Transactions** — paginated list, create/edit with category → transaction-type auto-fill (derived from the category's purpose), a Nubank-style masked currency input, a native date picker (Android/iOS), and delete with confirmation.
- **Categories** — full CRUD, scoped by category "purpose" (income/expense).
- **Dashboard** — income/expense/balance summary and a per-category breakdown, with a period filter that defaults to the current month and supports either month-by-month navigation or an arbitrary custom date range.
- **Phone input with country picker** — a hand-built component (flag + dial code + searchable country list, ~190 countries, no network dependency) shared between Login and Register, defaulting to Brazil.
- **Profile** — view/edit personal info, light/dark theme toggle.
- **Cache-consistent mutations** — every create/update/delete invalidates every TanStack Query cache entry it affects (including derived/aggregate ones like the dashboard summary), so screens stay in sync without manual reloads.

## Project structure

```
src/
├── api/            # Axios instance + auth-refresh interceptor
├── components/ui/  # Reusable primitives (Button, Input, Select, DateField, PhoneField, Dialog, ...)
├── lib/             # Framework-agnostic helpers (countries, month-range/date math, permissions, MMKV)
├── navigation/       # Public (auth) stack + private bottom-tabs, one nested stack per tab
├── schemas/          # Zod request schemas, one per service
├── screens/          # screens/ (route) → containers/ (state) → components/ (presentational), per feature
├── services/         # One Axios call + one React Query hook per file, grouped by domain
├── store/            # Zustand stores (auth)
└── types/            # Shared entity/DTO types
```

Each screen feature follows the same three-layer split: a thin `screens/` wrapper reads route params, a `containers/` component owns form/query state, and `components/` holds presentational pieces — kept consistent across Login, Register, Transactions, Categories, and the Dashboard.

## Getting started

### Prerequisites

- Node.js, npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- A running instance of [`Family-Vault-Api`](https://github.com/Filipe-Saulo/Family-Vault-Api) (the mobile app expects it at a local/LAN address — see `src/api/api.ts`)
- Android Studio / Xcode (or a physical device) for a native build — this project uses `expo-dev-client`, so it is **not** compatible with plain Expo Go

### Install & run

```bash
npm install

# point src/api/api.ts's baseURL at your running Family-Vault-Api instance

npm run android   # or: npm run ios / npm run web
```

### Other useful commands

```bash
npx tsc --noEmit                        # type-check
npx expo export --platform android      # bundle-only build check
```

## Related project

- **Backend API**: [Family-Vault-Api](https://github.com/Filipe-Saulo/Family-Vault-Api) — .NET 8, issues the JWTs this app consumes and implements the transaction/category/dashboard domain logic.

## License

MIT
