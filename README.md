# Blueprint to creating a Map Application

---

## Setting up basic React application with Vite and TS

First off you want to set up your project, initializing git and adding a `.gitignore` file.

The .gitignore file should contain:

```.gitignore
/.idea/
dist/
/dist
/node_modules/
```

Then you want to run these commands:

```bash
npm install --save-dev vite typescript prettier
npm install react react-dom
npm pkg set scripts.dev=vite
```

And create a index.html file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Map Application Blueprint</title>
  </head>
  <body>
  <div id="root"></div>
  </body>
  <script src="./src/main.tsx" type="module"></script>
</html>

```

Install React and React-DOM types for TypeScript:

```bash
npm install --save-dev @types/react @types/react-dom
npx tsc --init --jsx react
```

Optional: Adding this to your package.json file to enable TS watch mode:

```bash
"dev:watch": "tsc --watch"
```

Install Husky:

```bash
npm install --save-dev husky
npx husky init
```

Run Prettier to clean up the code:

```bash
npx prettier --write .
```

Add a test script to your package.json file & create a tsconfig.json file:

```bash
npm install --save-dev typescript prettier
npm install --save-dev @types/react @types/react-dom
npx tsc --init --jsx react
npx prettier --write .
npm pkg set scripts.test="prettier --check . && tsc --noEmit"
```

I prefer to keep my package.json file something like this:

```json
{
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "husky": "^9.0.11",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5",
    "vite": "^5.2.10"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "npm test && vite build",
    "start": "node dist",
    "format": "prettier --write .",
    "test": "prettier --check . && tsc --noEmit",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,html, md}": "prettier --write"
  }
}
```

Setting up Github Actions:

Create a `.github/workflows` directory and add a `publish.yml` file:

```yml
on:
  push:
    branches:
      - main
jobs:
  publish:
    runs-on: ubuntu-latest

    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
      id-token: write # to verify the deployment originates from an appropriate
      pages: write # to deploy to Pages
      contents: read # to checkout private repositories
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

Remember to enable Github Pages in your repository settings. You also need to create a `vite.config.js file in the root folder:

```js
export default {
  base: "/<your repo name>",
};
```

And that's it! You have a basic React application set up with Vite and TypeScript. You can now start building your map application.

---

## Setting up a Map Application with OL

First off you want to install OpenLayers:

```bash
npm install ol
```

Then you want to create a `src` directory with a `main.tsx` file:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<h1>Hello React</h1>);
```

In the `src` dir you want to add `modules/app/`:

```bash
app.tsx
app.css
```

In the `app.tsx` file you want to add:

```tsx
import React from "react";
import "./app.css";
```
