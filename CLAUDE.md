# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

React Native mobile app for Family Vault — personal finance management and transaction tracking, paired with the `Family-Vault-Api` (.NET 8) backend. Built with Expo SDK 57 (React Native 0.86, React 19, TypeScript strict mode). Architecture is modeled on a separate reference project (`hubmob-app`) but uses **bottom tabs** instead of drawer navigation, and has no IoT/camera/maps dependencies (not relevant to a finance app).

## Commands

- `npm start` — start the Expo dev server (Metro)
- `npm run android` — start dev server and open on Android
- `npm run ios` — start dev server and open on iOS
- `npm run web` — start dev server and open in a browser
- `npx tsc --noEmit` — typecheck against the strict TypeScript config in `tsconfig.json`
- `npx expo export --platform android` — bundle-only build check (useful to verify Babel/Metro/NativeWind config without a device/emulator)

There is no configured lint or test script yet.

## Architecture notes

- Entry point is `index.ts` → `App.tsx` (imports `global.css`, wraps the app in `GestureHandlerRootView` → `QueryClientProvider` → `Routes` → `PortalHost` for rn-primitives overlays).
- Path alias `@/*` → `./src/*` (configured in both `tsconfig.json` and `babel.config.js` via `babel-plugin-module-resolver`).
- **Navigation** (`src/navigation/`): `Routes.tsx` picks `PublicStack` (native-stack: login/register) or `PrivateTabs` (bottom-tabs: home/transactions/categories/profile) based on `useAuthStore`'s token, gated on `restoreSession()` having run. Each tab wraps its own nested native-stack (`<feature>-stack/`) so screens can be added under a tab without touching the tab bar. Each route group has a paired `<feature>Routes.ts` (typed route map) + `<Feature>Stack.tsx` (navigator).
- **Screens** (`src/screens/`): mirrors `navigation/`'s `public-routes/`/`private-routes/` split, one folder per feature with `{components,containers,screens}` — `screens/` is the route-level wrapper, `containers/` owns form/query state, `components/` is presentational. Simple placeholder screens (no state yet) skip the container split until they need one — see `login/` for the full pattern in use.
- **State**: Zustand for global/client state (`src/store/authStore.ts`), persisted through `src/lib/mmkv/` (react-native-mmkv v4 — API is `createMMKV({id})` + `.remove()`, not the old `new MMKV()`/`.delete()`). `authStoreHelpers` (plain functions reading `useAuthStore.getState()`) let non-React code — notably the Axios interceptor — read/update auth state.
- **Server state**: TanStack React Query (`src/lib/react-query/react-query-client.ts`); each `src/services/<domain>/*.ts` file pairs one Axios call with one `useQuery`/`useMutation` hook.
- **API client** (`src/api/api.ts`): single Axios instance targeting `Family-Vault-Api`. `baseURL` is hardcoded to `http://localhost:5090/api` and not committed as an env var — swap it for the machine's LAN IP when testing on a physical device (`localhost` from the phone means the phone itself). Login/refresh use the API's mobile-specific routes (`/app/login`, `/app/refreshtoken`), which are body-based (not cookie-based like `/web/*`) — but `/app/refreshtoken` still reads the *expired* access token from the `Authorization` header and only the refresh token from the body, so the refresh interceptor must resend the old header explicitly. 401s queue concurrent requests during a single in-flight refresh (`isRefreshing`/`failedQueue`).
- **Forms/validation**: react-hook-form + zod, schemas under `src/schemas/services/<domain>/`.
- **UI**: `react-native-reusables` (shadcn/ui port for RN) + NativeWind, scaffolded via `npx @react-native-reusables/cli@latest add <component>` (reads `components.json`; generates into `src/components/ui/`, aliases `cn()` from `src/lib/react-native-reusables/utils.ts`). `src/lib/react-native-reusables/theme.ts` bridges the same color tokens into React Navigation's `NAV_THEME`.
- `app.json` holds Expo config. Native `ios/`/`android/` folders are gitignored — not prebuilt/ejected, so native config changes go through `app.json`.
- Expo SDK 57 is a recent major version with breaking changes from prior SDKs. Per `AGENTS.md`, always check the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-related code rather than relying on older training data. The same applies to fast-moving libraries in this stack — e.g. `react-native-mmkv` v4's API changed significantly from v2/v3 (nitro-modules rewrite); verify against installed `node_modules` types rather than assuming older docs/examples still apply.
