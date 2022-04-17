# RO Costume Viewer Backend

This project is built using Node, Express, and MongoDB.

## .env config setup

Setup the following variables in .env file of project's root
- MONGODB_URI="your mongodb connection"
- PORT="port of your choosing ex. 3001"
- TEST_MONGODB_URI="must not be same as MONGODB_URI test mongodb connection"
- SECRET="secret string for signing tokens"

## Scripts

#### `npm install`

Install the project dependencies.

#### `npm run dev` or `npm start`

Runs app using ts-node-dev with environment set as development or production.

#### `npm test`

Launches jest test runner and runs *.test.ts files in src/tests.

#### `npm run build` followed by `npm start-prod`

Transpiles project to ES6 in ./build folder and runs it.