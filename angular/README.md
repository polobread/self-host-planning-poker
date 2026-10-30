# SelfhostPlanningPoker

This project uses Angular 22, Node.js 26.13.0, npm 12.2.1 and TypeScript 7 for type checking.
See the [project development guide](../README.md#development) for backend setup and the Angular compiler API compatibility package.

## Development server

Run `npm ci` followed by `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm exec -- ng generate component component-name` to generate a new component. You can also use `npm exec -- ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts are written to `dist/self-host-planning-poker/` by the Angular application builder (esbuild/Vite).
`npm run bundle:report` also writes build statistics for bundle inspection.

## Running unit tests

Run `npm run test:ci` for one Vitest run, or `npm test` to watch tests. Tests use jsdom and Angular TestBed.

## Running end-to-end tests

No end-to-end runner is configured. After changes to game behavior, verify two browser clients can create and join a room, vote, reveal cards and start a new turn. Docker CI also checks the web assets and Socket.IO endpoint.

## Further help

To get more help on the Angular CLI use `npm exec -- ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
