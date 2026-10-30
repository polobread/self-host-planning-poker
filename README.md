# Self-host Planning Poker

A hassle-free Planning Poker application to deploy on your NAS.


[![GitHub last commit](https://img.shields.io/github/last-commit/axeleroy/self-host-planning-poker?logo=github&logoColor=959DA5)](https://github.com/axeleroy/self-host-planning-poker/commits/main)
[![License](https://img.shields.io/github/license/axeleroy/self-host-planning-poker?logo=github&logoColor=959DA5)](https://github.com/axeleroy/self-host-planning-poker/blob/main/LICENSE)
[![Tests](https://github.com/axeleroy/self-host-planning-poker/actions/workflows/tests.yml/badge.svg)](https://github.com/axeleroy/self-host-planning-poker/actions/workflows/tests.yml)
[![Docker build](https://github.com/polobread/self-host-planning-poker/actions/workflows/docker-build.yml/badge.svg)](https://github.com/polobread/self-host-planning-poker/actions/workflows/docker-build.yml)
[![Crowdin](https://badges.crowdin.net/self-host-planning-poker/localized.svg)](https://crowdin.com/project/self-host-planning-poker)

## What is it?

This application is intended as a simplified and self-hostable alternative to
[Planning Poker Online](https://planningpokeronline.com/).

It features:

  * Multiple deck types: Fibonacci, modified Fibonacci, T-Shirt sizes, powers of 2 and trust vote (0 to 5)
  * Spectator mode
  * Responsive layout
  * Vote summary
  * Translations _(English, French, German, Italian and Polish. [Contributions welcome!](#im-a-user-and-want-to-contribute-translations))_
 
It does not have fancy features like issues management, Jira integration or timers.

## Screenshots
<a href="https://github.com/axeleroy/self-host-planning-poker/blob/main/assets/screenshot.png"><img alt="Application screenshot with cards face down" src="https://github.com/axeleroy/self-host-planning-poker/blob/main/assets/screenshot.png" width="412px"></a>
<a href="https://github.com/axeleroy/self-host-planning-poker/blob/main/assets/screenshot.png"><img alt="Application screenshot with cards revealed" src="https://github.com/axeleroy/self-host-planning-poker/blob/main/assets/screenshot-revealed.png" width="412px"></a>

## Deployment

Deploying the application is easy as it's self-contained in a single container.
All you need is to create a volume to persist the games settings (ID, name and deck).

### Docker

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
| `APP_ROOT` (optional) | Allows you to deploy to another path than `/`.<br>See [Configuration examples for deploying on sub‐paths](https://github.com/axeleroy/self-host-planning-poker/wiki/Configuration-examples-for-deploying-on-sub%E2%80%90paths) for more details. | `APP_ROOT=/poker/` |

### Running behind a reverse-proxy

Refer to [Socket.IO's documentation](https://socket.io/docs/v4/reverse-proxy/)  for setting up your reverse-proxy to work correctly with Socket.IO.

### Customization

See [Customizing the application's style and icon](https://github.com/axeleroy/self-host-planning-poker/wiki/Customizing-the-application's-style-and-icon).

## Getting involved

### I'm a developer and I want to help

You are welcome to open Pull Requests resolving issues in the [Project](https://github.com/users/axeleroy/projects/1/views/1) or 
tagged [pr-welcome](https://github.com/axeleroy/self-host-planning-poker/issues?q=is%3Aissue+is%3Aopen+label%3Apr-welcome).
Don't forget to mention the issue you want to close 😉

### I'm a user and I need help / I encountered a bug / I have a feature request

[Open an issue](https://github.com/axeleroy/self-host-planning-poker/issues/new) and I'll take a look at it.

### I'm a user and want to contribute translations

There is a [Crowdin project](https://crowdin.com/project/self-host-planning-poker) that lets you add translations for
your language. If your language is not available, feel free to contact me over Crowdin.

## Development

The app consists of two parts:

* a [back-end](flask/) written in Python with [Flask](https://flask.palletsprojects.com/), [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/index.html) and [peewee](http://docs.peewee-orm.com/en/latest/).
* a [front-end](angular/) written with [Angular](https://angular.io) and [Socket.IO](https://socket.io/).

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
python -m unittest
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
