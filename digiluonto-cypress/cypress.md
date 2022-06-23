## Cypress Testing Environment

Passing config file as parameter for Cypress when not in standard location, for example:
``$ npx cypress open --config-file cypress/cypress.json``

Cypress supports Node.js 12 and 14 (as of 2021-09-20)

Bountiful Staff of Examples:
- https://github.com/cypress-io/cypress-realworld-app/tree/develop/cypress

### Installation
#### Local Projects
It is recommended to install (add) cypress to node project using `npm install cypress --save-dev` which technically adds cypress to package.json file as a dev dependency. Cypress binary is a wrapper for node. Running cypress can be done in several ways:
1. `./node_modules/.bin/cypress open`
2. `$(npm bin)/cypress open`
3. `npx cypress open`

Or add scripts section to package.json (as instructed in https://docs.cypress.io/guides/getting-started/installing-cypress#Adding-npm-scripts) and run cypress with `npm run cypress:open`.

### Configuration and Files
Environment differentiation (https://docs.cypress.io/guides/guides/environment-variables):
1. Editing main configuration file (cypress.json)
2. Modifying cypress.env.json
3. Exporting CYPRESS_*
4. Passing as arguments for cypress --env
5. Using plugins
6. Setting test configurations

### Docker Images
* Examples https://docs.cypress.io/examples/examples/docker
* Github repository https://github.com/cypress-io/cypress-docker-images/tree/master/base

``$ docker run -it -v $PWD:/e2e -w /e2e cypress/included:8.5.0``

Image flavours:
- `cypress/base:<Node version>` has the operating system dependencies required to run Cypress.
- `cypress/browsers:<tag>` extends the base images with pre-installed browsers. This is a complete image with all dependencies for Cypress included browsers (Chrome being the most recent).
- `cypress/included:<Cypress version>` extends the base images with pre-installed Cypress versions. Docker image with the operating system dependencies and Cypress installed globally.


#### Docker Guides
* https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/
* https://docs.cypress.io/guides/core-concepts/cypress-studio#Extending-a-Test

### CI Guide
Introduction to Cypress CI et friends:
- https://docs.cypress.io/guides/continuous-integration/introduction#What-is-Continuous-Integration

### Introduction to Cypress
The single most important guide for writing/implementing Cypress tests:
- https://docs.cypress.io/guides/core-concepts/introduction-to-cypress
