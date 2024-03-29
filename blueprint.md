# Blueprint for manually setting up a map application

Take note that I am mainly an OSX user and I use the terminal for most things. Here are some useful commands if you need them:

<details>
    <summary>Useful bash commands</summary>

- To change directory: `cd <directory path>`
- Navigate to a parent directory: `cd .`
- List files and directories: `ls`
- Create a file: `touch <filename>`
- Remove a file : `rm <filename>`
- Go to home directory : `cd ~`
- To create a directory `mkdir <directory name>`
- Delete a directory: `rm -r <directory name`
- Copy files/directories: `cp <source path> <destination path>`
- Move files/directories: `mv <source path> <destination path>`
</details>

## Setting up your local directory and git repo

<details>
    <summary>Toggle me if you need a guide to set up git</summary>
    
First things first, we wan't to set up a [git](https://git-scm.com/) repo for the best undestructive workflow. To do this you want to start with creating a project folder in your preferred local location. _i.e._ _KWS2100/\*_ or similar for this course.

Then you want to open this directory in IntelliJ or VSCODE and open a terminal. **Make sure that you are in the project's root directory.** Run the following command:

    git init

Then you want to create a `.gitignore` file that looks like this:

    /.idea/
    /dist/
    /node_modules/

This makes sure that you don't add unecesarry files to git later on when you commit and push your project. You can also add additional files or directories if you want to exlude them as well.

Now you want to stage and commit your files before you continue the actual setup of the application, and to do this you run :

    git add .
    git commit -m "Initial commit"

The `.` tells git to add all new/edited files to git.

Now we want to setup a remote repo on Github! To do this you want to go to [github.com](https://github.com/) and create a new repository. Name it according to your project and/or file structure.

It does not have to be the same name as your local directory but it's important to be consistent!

Then you want to copy the link that appears when you toggle the `<>Code` button. Go back to your code editor and use the following command:

    git remote add origin <repository url>

Replace `<repository url>` with the URL of your remote repository.

![Finding the link to your github repo](<Screenshot 2024-02-28 at 03.06.42.png>)

    A tip is to maybe use these instructions to create a project you can clone in the future to save yourself some time!

    This is me doing that..

Then use this command instead of the one above :

    git clone <repository url>

Now we are ready to push the local changes made so far!

    git push -u origin main

### Now the project is set up with Git and we can go on to creating the map application!

</details>

## Initial setup and installs for the application to run and deploy

Inside your directory/repo open up the bash terminal and run these commands:

1.  `echo {} > package.json`

    This creates a `.json` file containing only `{}`.

    - ⚠️ If you are on Windows and using Powershell, this will create a totally empty file, which will not work. Use cmd OR create a package.json file manually OR just skip this step if you know there is no package.json file in a directory above your project directory

2.  `npm install --save-dev vite typescript prettier`
3.  `npm install react react-dom`
4.  `npm pkg set scripts.dev=vite`
5.  Create `index.html` :

        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>

        </body>
        </html>

6.  Create `src/main.tsx`:

        import React from "react";
        import ReactDOM from "react-dom/client";
        const root = ReactDOM.createRoot(document.getElementById("root")!);
        root.render(<h1>Hello React</h1>);

7.  Set up TypeScript and formatting with Prettier:

    Run these commands:

        npm pkg set scripts.build="npm test && vite build"
        npm pkg set scripts.test="prettier --check . && tsc --noEmit"

    Create a `tsconfig.json` file.

    To clean up the code so far and to install React:

    ```
    npm install --save-dev @types/react @types/react-dom
    npx tsc --init --jsx react
    npx prettier --write .
    ```

    Consider adding this to your `package.json` file to enable TS' compiler watch mode:

        "dev:watch": "tsc --watch"

    It should then look something like this:

        "scripts": {
        "build": "npm test && tsc --noEmit",
        "format": "prettier --write . ",
        "test": "npm run format && tsc --noEmit",
        "dev": "vite",
        "dev:watch": "tsc --watch",
        "prepare": "husky",

        //... other scripts
        }

    You can choose between using `npm run dev` and `npm run dev:watch`.

    ### Notes about Prettier

    <details>
    <summary>⚠️ Do this once</summary>

    ***

    To make sure that Prettier formats all the files when using IntelliJ; you have to go to settings and add files like `CSS` and `HTML` like this :

    ![Fixing formatting with Prettier](<Screenshot 2024-02-28 at 03.39.11.png>)

    **NB: YOU SHOULD ONLY NEED TO DO THIS ONCE!**

    ## </details>

    Whilst working on your project you can run the command:

    `npx prettier --write .`

    The purpose of using Prettier is to format the code consistetly and making it easier to read.

8.  Set up GitHub Actions to deploy:

    `.github/workflows/publish.yaml`

    ```
    on:
        push:
            branches:
                - main
                // add another branch here if relevant

    jobs:
        publish-map:
            runs-on: ubuntu-latest
            permissions:
                id-token: write
                pages: write
             environment:
                name: github-pages
                url: ${{ steps.deployment.outputs.page_url }}
            steps:
                - uses: actions/checkout@v3
                - uses: actions/setup-node@v3
                 with:
                    node-version: 18.x
                    cache: "npm" - run: npm ci
                    - run: npm run build
                    - uses: actions/upload-pages-artifact@v2
             with:
                path: ./dist
            - uses: actions/deploy-pages@v3
            id: deployment
    ```

This publishes your project as `https://<your username>.github.io/<repository name>`.

9.  Create a file named `vite.config.js` in your root folder:

    _⚠️ Note that the repo here should be the one on github, not your local one!_

        export default {
        base: "/<your repo name>"
        }

We do this because Vite by default expects index.html to fetch JavaScript from the server root. You need it to fetch content from `/<your repository name>`

### Husky Integration

[Husky](https://https://typicode.github.io/husky/) helps to prevent you from comitting bad code and crashing the application!

_Note that Johannes does this differently in the course documentation but I have found that it does not work that way for me. So this is a workaround... :_

10. To install Husky, run:

    1.  `npm i -D husky`
    2.  `npx husky init`
    3.  Add to `.husky/pre-commit`:

            #!/usr/bin/env sh
            . "$(dirname -- "$0")/_/husky.sh"
            npm run test

## Map Application Setup

11. To install OpenLayers and Set up Map Application:

    `npm install ol`

    Replace what is in your `main.tsx` file with this:

        import React from "react";
        import ReactDOM from "react-dom/client";
        import { MapApplication } from "./modules/application/mapApplication";
        const root = ReactDOM.createRoot(document.getElementById("root")!);
        root.render(<MapApplication />);

12. Create `src/modules/application/Application.css`:

        * {
        margin: unset;
        }

Create `src/modules/application/application.tsx` :

        import { Map, View } from "ol";
        import TileLayer from "ol/layer/Tile";
        import { OSM } from "ol/source";
        import React, { MutableRefObject, useEffect, useRef, useState } from "react";
        import { useGeographic } from "ol/proj";


        import "ol/ol.css";
        import "./application.css";
        import { Layer } from "ol/layer";
        import { MapContext } from "../map/mapContext";


        useGeographic();

        const map = new Map({
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
            center: [11, 59],
            zoom: 10,
        }),
        });

        export function MapApplication() {
        function handleFocusUser(e: React.MouseEvent) {
            e.preventDefault();
            navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.getView().animate({
                center: [longitude, latitude],
                zoom: 10,
            });
            });
        }
        const [layers, setLayers] = useState<Layer[]>([
            new TileLayer({ source: new OSM() }),
        ]);
        useEffect(() => map.setLayers(layers), [layers]);

        const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
        useEffect(() => {
            map.setTarget(mapRef.current);
        }, []);
        useEffect(() => {
            map.setLayers(layers);
        }, [layers]);
        return (
            <MapContext.Provider value={{ map, layers, setLayers }}>
            <header>
                <h1>Name of your application</h1>
            </header>
            <nav>
                <a href="#" onClick={handleFocusUser}>
                Focus on me
                </a>
            </nav>
            <main>
               // If you want to have an aside, place it here
            </main>
            </MapContext.Provider>
        );
        }

To be able to display the map you need to have these two files in `src/modules/map`:

- `mapContext.tsx`

        import React, { Dispatch, SetStateAction } from "react";
        import { Layer } from "ol/layer";
        import { Map, View } from "ol";
        import { useGeographic } from "ol/proj";
        import { defaults, ScaleLine } from "ol/control";

        useGeographic();

        export const map = new Map({
        view: new View({ center: [10, 59], zoom: 8 }),
        controls: defaults().extend([new ScaleLine()]),
        });

        export const MapContext = React.createContext<{
        map: Map;
        setLayers: Dispatch<SetStateAction<Layer[]>>;
        setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
        featureLayers: Layer[];
        layers: Layer[];
        }>({
        map,
        setLayers: () => {},
        setFeatureLayers: () => {},
        featureLayers: [],
        layers: [],
        });

- `useLayer.tsx`

        import { Layer } from "ol/layer";
        import { useContext, useEffect } from "react";
        import { MapContext } from "./mapContext";

        export function useLayer(layer: Layer, checked: boolean) {
        const { setFeatureLayers } = useContext(MapContext);

        useEffect(() => {
            if (checked) {
            setFeatureLayers((prev) => [...prev, layer]);
            }
            return () => {
            setFeatureLayers((prev) => prev.filter((l) => l !== layer));
            };
        }, [checked]);
        }

To compile your build and run it locally run these commands:

    npm run build
    npm run dev

---

### Your application should now be up and running with a map displayed! You can now continue to build your application...
