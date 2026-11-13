# Good Sports Quest: Club Champions

**[Play the live game](https://jasonschmidt1983-ai.github.io/good-sports-quest-club-champions/)**

Good Sports Quest is an interactive browser adventure for community sports clubs. Explore the grounds in a top-down pixel-art RPG, talk with club teammates and officials, and work through the Good Sports questionnaire, action plan, and training activities.

## Run locally

**Prerequisite:** Bun 1.3.8 or a current Node.js and npm installation.

With Bun:

```sh
bun install --frozen-lockfile
bun run dev
```

Or with npm:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:3000`).

## Checks

```sh
bun run lint
bun run build
```

## Deployment

GitHub Actions deploys the production build to GitHub Pages whenever `main` is updated. The workflow is also available for manual dispatch under the repository’s Actions tab.
