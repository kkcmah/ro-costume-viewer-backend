# RO Costume Viewer Backend

This project is built using Node, Express, and MongoDB.

This is the backend for the frontend found here:

https://github.com

## .env config setup

Setup the following variables in .env file of project's root (quotations not needed)

- MONGODB_URI="your mongodb connection"
- PORT="port of your choosing ex. 3001"
- TEST_MONGODB_URI="must not be the same as MONGODB_URI. This is the connection to the test database"
- SECRET="secret string for signing tokens"
- NODE_ENV="production"
- MEDIA_SRC="domain where videos are hosted ex. https://res.cloudinary.com/"

## Scripts

#### `npm install`

Install the project dependencies.

#### `npm run dev` or `npm start`

Runs app using ts-node-dev with environment set as development or production.

#### `npm run start:test`

Runs the app in test mode - mainly used for when running Cypress `npm run cypress:open` from the frontend.

#### `npm test`

Launches jest test runner and runs \*.test.ts files in src/tests.

#### `npm run build` followed by `npm run start-prod`

Transpiles project to ES6 in ./build folder and runs it.
