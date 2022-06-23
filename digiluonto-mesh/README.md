# digiluonto-mesh

## Prerequisites
Dependencies
- node.js 14
- yarn (for build and install)
- Redis cache (e.g., a Docker container will do: `docker run -it --rm -p 127.0.0.1:6379:6379 redis`)
- Strapi CMS (`digiluonto-strapi`)

Additionally:
- Configuration file `.meshrc.yaml`

## Development
In the root folder, run the following
1. yarn install
2. yarn mesh dev

## Installing
In the root folder
1. yarn install
2. yarn mesh build
3. yarn mesh start

## Running in Docker Container
There is also a Dockerfile which allows to build and run a containerized instance of `digiluonto-mesh`.

The container can be configure with the following environment variables:
- WAIT_HOSTS: a comma separated list of IP addresses (i.e., Redis and Strapi) which the container will wait before launching.
