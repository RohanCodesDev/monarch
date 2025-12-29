# Monarch

Next.js 14 starter using the Pages Router (no React Compiler). Includes TypeScript, ESLint, and Prettier.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Run the dev server
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Scripts

- `npm run dev` – start development server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – lint with Next.js + Prettier config
- `npm run format` – format with Prettier

## Project Structure

- `pages/` – pages router entries (`index`, `about`, `api/hello`)
- `pages/_app.tsx` and `pages/_document.tsx` – app and document shells
- `styles/globals.css` – global styling

## Notes

- Pages Router only; no app directory or React Compiler features are enabled.
- Adjust ESLint/Prettier config as needed for your team conventions.
