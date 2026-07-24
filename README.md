# Countries Explorer

![Storybook](image-1.png)
![Tests](image-2.png)
![alt text](image-3.png)

## Stack

Nuxt 3 · Vue 3 · Pinia · Tailwind CSS · Leaflet · Vitest + vitest-axe · Storybook

## How it works

**List page (`/`)** — `server/api/countries` fetches the full country list from the REST Countries API server-side (keeps the API key private) and maps it to a simpler view-model. The Pinia store (`stores/countries.ts`) loads that list once and does all filtering, sorting and pagination client-side, so the list page itself just renders store state.

**Detail page (`/country/[id]`)** — fetches a single country independently via `useAsyncData`, keyed by the route param, with its own loading skeleton and error state. No dependency on the list page's data.

Both pages share the same error handling: `services/api.ts` turns failed requests into a typed `ApiError` (timeout / not-found / server / network), rendered by `ApiErrorBanner` with a retry action.

## Styling

Tailwind utilities, composed into component classes (`.hero`, `.btn`, `.stat-card`, …) under `@layer components` in `main.css`, so templates stay short. Design tokens (colors, shadow) are CSS custom properties shared between `main.css` and `tailwind.config.ts`.

## Accessibility

`eslint-plugin-vuejs-accessibility` lints on save, `@storybook/addon-a11y` checks each story visually, and `vitest-axe` asserts zero violations per component in the test suite — three layers, so a regression has to slip past all of them.

## Running locally

```bash
npm install
npm run dev         # http://localhost:3000
npm run test         # vitest
npm run typecheck     # nuxt typecheck
npm run storybook    # http://localhost:6006
```

Requires a `.env` file with:

```
NUXT_REST_COUNTRIES_API_KEY=your_key_here
```
