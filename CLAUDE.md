# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

React Native mobile app for Family Vault — personal finance management and transaction tracking. Built with Expo SDK 57 (React Native 0.86, React 19, TypeScript strict mode). The project is currently a fresh Expo scaffold: `App.tsx` still contains the default placeholder screen and no app-specific source structure, navigation, or state management has been added yet.

## Commands

- `npm start` — start the Expo dev server (Metro)
- `npm run android` — start dev server and open on Android
- `npm run ios` — start dev server and open on iOS
- `npm run web` — start dev server and open in a browser

There is no configured lint, test, or typecheck script yet; run `npx tsc --noEmit` to typecheck against the strict TypeScript config in `tsconfig.json`.

## Architecture notes

- Entry point is `index.ts`, which calls `registerRootComponent(App)` from `expo`; `App.tsx` is the root component.
- `app.json` holds Expo config (app name/slug, icons, Android adaptive icon layers, web favicon). Native `ios/` and `android/` folders are gitignored — this project is not prebuilt/ejected, so native config changes go through `app.json`.
- Expo SDK 57 is a recent major version with breaking changes from prior SDKs. Per `AGENTS.md`, always check the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-related code rather than relying on older training data.
