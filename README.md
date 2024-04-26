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
import * as React from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { MutableRefObject, useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import "ol/ol.css";
import "./app.css";

// Enable geographic coordinates for OpenLayers
useGeographic();

export function Application() {
  // Create a ref for the map container div
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    // Create a new map
    const map = new Map({
      // Set the view with center coordinates and zoom level
      view: new View({ center: [10, 60], zoom: 8 }),
      layers: [
        // Add a tile layer with OpenStreetMap as the source
        new TileLayer({ source: new OSM() }),
        // Add a vector layer with a point feature
        new VectorLayer({
          source: new VectorSource({
            features: new GeoJSON().readFeatures({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [10, 60] },
                },
              ],
            }),
          }),
        }),
      ],
    });

    // Set the target of the map to the map container div
    map.setTarget(mapRef.current);

    // Clean up on unmount
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Render the map container div
  return <div ref={mapRef}></div>;
}
```

And in the `app.css` file you want to add:

```css
:root {
  --main-color: #333; /* Define a main color for the application */
  --secondary-color: #f3f3f3; /* Define a secondary color for the application */
  --gap: 1em; /* Define a standard gap size for the application */
}

* {
  margin: 0;
  height: 100vh; /* Set the height of all elements to the full viewport height */
  box-sizing: border-box; /* Include padding and border in an element's total width and height */
}

#root {
  display: grid; /* Use CSS grid layout for the root element */
  grid-template-rows: auto auto 1fr; /* Define the size of the rows in the grid */
  height: 100vh; /* Set the height of the root element to the full viewport height */
  background-color: var(
    --main-color
  ); /* Set the background color of the root element to the main color */
}

.nav {
  display: flex; /* Use CSS flexbox layout for the navigation */
  gap: var(
    --gap
  ); /* Set the gap between navigation items to the standard gap size */
  background-color: var(
    --secondary-color
  ); /* Set the background color of the navigation to the secondary color */
}

.main {
  display: grid; /* Use CSS grid layout for the main content */
  grid-template-columns: 1fr auto auto; /* Define the size of the columns in the grid */
  background-color: var(
    --secondary-color
  ); /* Set the background color of the main content to the secondary color */
}

.main aside {
  display: grid; /* Use CSS grid layout for the aside element */
  grid-template-columns: 0; /* Define the size of the columns in the grid */
  transition: grid-template-columns 0.5s ease-in-out; /* Add a transition effect when changing the size of the columns */
  overflow-x: clip; /* Clip any content that overflows the x-axis */
  max-height: calc(
    100vh - 100px
  ); /* Set the maximum height of the aside element */
  overflow-y: auto; /* Add a scrollbar if the content overflows the y-axis */
  background-color: var(
    --secondary-color
  ); /* Set the background color of the aside element to the secondary color */
}
```

In the `main.tsx` file you want to change it to this:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/app/app";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Application />);
```

Now the map should display and the application should be deployed to Github Pages.
