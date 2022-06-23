# digiluonto-strapi
Strapi CMS

## Prerequisites
Dependencies
- node.js (version 14)
- npm (version 6 or newer, for build and install)
- MongoDB (for persistent storage)

Additionally:
- Configuration/environment file `.env`, see file `_.env`
- Configuration files (though these should be able to define thru the `.env`)
   - `config/database.js`
   - `config/plugins.js`
   - `config/server.js`


## Development
In the root folder, run the following
1. npm install
2. npm develop

## Installing
In the root folder
1. npm ci
2. npm build

## Running in Docker Container
There is also a Docker Compose file `docker-compose-api-dev.yml` which allows to build and run containerized instances of Digiluonto backends (in the context of development). The defined services are as follows:
- strapi
- mongo
- redis
- redis-commander (optional)
- mesh

### Requirements
- There should exist a Docker volume named `data-digiluonto-mongodb` and `redis_cache`
- There should exist a Docker network named `digiluonto`
- The Docker Compose file needs the existence of a `.env` file.
