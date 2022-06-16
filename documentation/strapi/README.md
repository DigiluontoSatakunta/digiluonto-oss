# Strapi initialization
Files and documents that can be useful when initializing a fresh instance of Strapi (and MongoDB)
- `mongo-init_{groups,journeys,places,tags}.archive` are bson-formatted archives of collections that are exported by `mongodump`
- `mongo-init_{groups,journeys,places,tags}.json` are plain text of the same collections
- PDFs include information how certain settings in Strapi should look like
  - internationalization, and
  - user permissions & roles

## Development/Docker initialization
Setting the backend up by using `docker-compose-api-dev.yml`

```
cd digiluonto-oss/digiluonto-strapi
cp _.env .env
# modify .env file according to your needs, pay attention to sections marked <FILL_HERE>
# optional modifications:
# - <GENERATE_HERE> are optional, but recommended
# - SENTRY_DSN is also optional

# create volumes and networks (needed only once)
docker volume create --name=data-digiluonto-mongodb
docker network create -d bridge digiluonto

# running only mongo and strapi (non-detached, use ctrl+C once finished with this step)
docker-compose -f docker-compose-api-dev.yml up mongo strapi
# 1. go to strapi admin panel http://localhost:1337/dashboard, and create a new strapi admin user
# 2. also now you should modify public user role permissions according to PDFs
# (optional) 3. add internationalizations for Finnish if needed (see PDF)
# (optional) 4. copy/import mongo archives into mongo container (e.g., using tool mongorestore)
#               Archives contain a few places and a journey to show in the application
#               They also contain collections for Tags and Groups that are required by the application

# running them all detached once ready
docker-compose -f docker-compose-api-dev.yml up -d
```
