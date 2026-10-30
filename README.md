# Self-host Planning Poker

A hassle-free Planning Poker application to deploy on your NAS.

Maintained at [polobread/self-host-planning-poker](https://github.com/polobread/self-host-planning-poker),
based on [the original project by axeleroy](https://github.com/axeleroy/self-host-planning-poker).

[![GitHub last commit](https://img.shields.io/github/last-commit/polobread/self-host-planning-poker?logo=github&logoColor=959DA5)](https://github.com/polobread/self-host-planning-poker/commits/main)
[![License](https://img.shields.io/github/license/polobread/self-host-planning-poker?logo=github&logoColor=959DA5)](https://github.com/polobread/self-host-planning-poker/blob/main/LICENSE)
[![Tests](https://github.com/polobread/self-host-planning-poker/actions/workflows/tests.yml/badge.svg)](https://github.com/polobread/self-host-planning-poker/actions/workflows/tests.yml)
[![Docker build](https://github.com/polobread/self-host-planning-poker/actions/workflows/docker-build.yml/badge.svg)](https://github.com/polobread/self-host-planning-poker/actions/workflows/docker-build.yml)

## What is it?

This application is intended as a simplified and self-hostable alternative to
[Planning Poker Online](https://planningpokeronline.com/).

It features:

  * Multiple deck types: Fibonacci, modified Fibonacci, T-Shirt sizes, powers of 2 and trust vote (0 to 5)
  * Spectator mode
  * Responsive layout
  * Vote summary
  * Translations _(including English and Traditional Chinese for Taiwan. [Contributions welcome!](#im-a-user-and-want-to-contribute-translations))_
 
It does not have fancy features like issues management, Jira integration or timers.

## Screenshots
<a href="assets/screenshot.png"><img alt="Application screenshot with cards face down" src="assets/screenshot.png" width="412px"></a>
<a href="assets/screenshot-revealed.png"><img alt="Application screenshot with cards revealed" src="assets/screenshot-revealed.png" width="412px"></a>

## Deployment

Deploying the application is easy as it's self-contained in a single container.
All you need is to create a volume to persist the games settings (ID, name and deck).

### Docker

Check out this repository first:

```sh
git clone https://github.com/polobread/self-host-planning-poker.git
cd self-host-planning-poker
```

Build the image from this checkout, then run it locally. No DockerHub or GHCR
account is required. Docker downloads the public base images anonymously.

```bash
docker build --tag self-host-planning-poker:local .
docker run \
  -v planning-poker-data:/data \
  -p 127.0.0.1:8000:8000 \
  self-host-planning-poker:local
```

### docker-compose
```yml
services:
  planning-poker:
    build: .
    image: self-host-planning-poker:local
    ports:
      - 127.0.0.1:8000:8000
    volumes:
      - planning-poker-data:/data
volumes:
  planning-poker-data: {}
```

### Environment variables

| Variable              | Meaning                                                                                                                                                                                                                                          | Example            |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `APP_ROOT` (optional) | Allows you to deploy to another path than `/`.<br>See [Deploying on a subpath](#deploying-on-a-subpath). | `APP_ROOT=/poker/` |

### Deploying on a subpath

Set `APP_ROOT=/poker/` on the container to generate the application base URL and
asset URLs with that prefix. Configure your reverse proxy to forward `/poker/`
to the container with the prefix removed, including `/poker/socket.io/` and its
WebSocket upgrade requests. `APP_ROOT` does not change Flask's route paths.

### Running behind a reverse-proxy

Refer to [Socket.IO's documentation](https://socket.io/docs/v4/reverse-proxy/)  for setting up your reverse-proxy to work correctly with Socket.IO.

### Customization

Edit [overrides.css](angular/src/assets/overrides.css) for custom colors; it includes
an example theme. Replace [icon.svg](angular/src/assets/icon.svg) and the files in
[assets/favicon](angular/src/assets/favicon/) to change the application icon.
Rebuild the Docker image after editing these assets. Flask serves `overrides.css`
after the generated application stylesheet.

## Getting involved

### Code, bugs and feature proposals

Submit changes through [pull requests](https://github.com/polobread/self-host-planning-poker/pulls)
to this repository. Include reproduction steps for bug fixes and run the relevant
checks from the development guide below. Issues are currently disabled in this fork.

### I'm a user and want to contribute translations

Edit the JSON files in [angular/src/assets/i18n](angular/src/assets/i18n/) and submit
a pull request to this repository. Use [en.json](angular/src/assets/i18n/en.json)
as the key reference and preserve interpolation placeholders such as `{{gameName}}`.
The optional Crowdin workflow requires the maintainer's own project credentials;
translation contributions can be made directly in Git.

### 台灣繁體中文

介面支援台灣繁體中文；瀏覽器語言為 `zh-TW` 或 `zh-Hant-TW` 時會自動使用繁體中文，
數字使用 `zh-TW` locale。也可在首頁下方的「語言」選單選擇「繁體中文（台灣）」；
選擇會儲存在目前瀏覽器，下次開啟時繼續使用。Planning Poker、Fibonacci、QR Code、GitHub 與 License 等術語保留英文。翻譯檔為
[zh.json](angular/src/assets/i18n/zh.json)。

## Development

The app consists of two parts:

* a [back-end](flask/) written in Python with [Flask](https://flask.palletsprojects.com/), [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/index.html) and [peewee](http://docs.peewee-orm.com/en/latest/).
* a [front-end](angular/) written with [Angular](https://angular.dev) and [Socket.IO](https://socket.io/).

### Back-end development

Use Python 3.15.2 (see `.python-version`); local, CI and Docker environments use this version.

You must first initialise a virtual environment and install the dependencies

```sh
# Run the following commands in the flask/ folder
python3.15 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
```

Then launching the development server is as easy as that:
```bash
FLASK_DEBUG=1 python app.py
```

#### Run unit tests

After initializing the virtual environment, run this command in the `flask/` directory:
```sh
python -m unittest discover -s test -v
```

### Front-end development

> <details>
> <summary>
> <b>Note:</b> You might want to test the front-end against a back-end. You can either follow the instructions in the
> previous section to install and run it locally or use the following command to run it in a Docker container:
> </summary>
>
> ```bash
> docker run --rm -it \
>   -v $(pwd)/flask:/app \
>   -p 5000:5000 \
>   python:3.15.2-slim \
>   bash -c "cd /app; pip install -r requirements.txt; FLASK_DEBUG=1 gunicorn --worker-class gevent -w 1 app:app --bind 0.0.0.0:5000"
> ```
> </details>

First make sure that [Node.js](https://nodejs.org/en/) 26.13.0 and npm 12.2.1 are installed (see `angular/.nvmrc`).
Then, install dependencies and launch the development server

```sh
# Run the following commands in the angular/ folder
npm ci
npm start
```

### Front-end tests

Run `npm run test:ci` in `angular/` for a single Vitest run, or `npm test` to
watch tests. Angular initializes the DOM environment and TestBed automatically.

### TypeScript checks

Run `npm run typecheck` in `angular/` to check application code with TypeScript 7.
The project follows [Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60): `@typescript/native` provides
TypeScript 7's `tsc`, while the `typescript` alias points to the TypeScript 6 API
compatibility package required by Angular 22 and ESLint. Angular builds continue
to validate templates through their supported compiler API.

### Front-end builds

The Angular application builder uses esbuild/Vite. `npm run build` keeps the
initial bundle below the existing 500 kB warning budget; `npm run bundle:report`
adds build statistics. PostCSS removes unused CSS while preserving runtime
ng-bootstrap classes. The QR dialog and its ESM encoder load only when opened.

Build output stays in `angular/dist/self-host-planning-poker/`, which Docker
copies to Flask's `static/` directory. The Flask template loads `main.js` and
`polyfills.js`; the application builder no longer emits a separate `runtime.js`.

### Building Docker image

```sh
docker build --tag self-host-planning-poker:local .
```

Open http://localhost:8000 after starting the container with the command above.
The named `planning-poker-data` volume preserves game settings between runs.

GitHub Actions builds and smoke-tests separate amd64 and arm64 images in its
local runner image store (`push: false`, `load: true`). It does not log in to
DockerHub or GHCR and does not publish images. No registry credentials are needed.
