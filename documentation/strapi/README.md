# Strapi initialization
Files and documents that can be useful when initializing a fresh instance of Strapi (and MongoDB)
- `mongo-init_{groups,journeys,places,tags}.archive` are bson-formatted archives of collections that are exported by `mongodump`
- `mongo-init_{groups,journeys,places,tags}.json` are plain text of the same collections
- PDFs include information how certain settings in Strapi should look like
  1. internationalization,
  2. user permissions & roles

Important topics that are not covered in this documentation:
- Installation of Client application (`digiluonto-client`)
- Installation of Editor application (`digiluonto-editor`)
- Installation of HTTP Proxy (to make access to each service possible)
  - Setup of domains
- Domain creation, you will probably need these:
  - yourdomain.example.org (probably your introduction site)
  - app.yourdomain.example.org (`digiluonto-client`)
  - api.yourdomain.example.org (`digiluonto-mesh`)
  - cms.yourdomain.example.org (`digiluonto-strapi`)
  - editor.yourdomain.example.org (`digiluonto-editor`)

## Development/Docker/Server initialization
Here is a sample of commands that can be useful when setting up the environment

### Docker Installation
This section follows the instructions of installing Docker on Ubuntu (https://docs.docker.com/engine/install/ubuntu/)

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Backend
Setting the backend up by using `docker-compose-api-dev.yml`

```
# install some tools (needed only once)
sudo apt-get install git unzip mongo-tools docker-compose

# create volumes and networks (needed only once)
docker volume create --name=data-digiluonto-mongodb
docker network create -d bridge digiluonto

cd digiluonto-oss/digiluonto-strapi
cp _.env .env
# modify .env file according to your needs, pay attention to sections marked <FILL_HERE>
# optional modifications:
# - <GENERATE_HERE> are optional, but recommended
# - PASSWORDs should match
# - USERNAMEs should match
# - SENTRY_DSN is also optional

# running only mongo and strapi (non-detached, use ctrl+C once finished with this step)
docker-compose -f docker-compose-api-dev.yml up mongo strapi
# 1. go to strapi admin panel http://localhost:1337/dashboard, and create a new strapi admin user
# 2. also now you should modify public user role permissions according to PDFs
# (optional) 3. add internationalizations for Finnish if needed (see PDF)
# (optional) 4. copy/import mongo archives into mongo container (e.g., using tool mongorestore)
#               Archives contain a few places and a journey to show in the application
#               They also contain collections for Tags and Groups that are required by the application

# restoring some data (step 4)
mongorestore --host=localhost --port=27017 --username=admin --authenticationDatabase=admin --archive=mongo-init_groups.archive
mongorestore --host=localhost --port=27017 --username=admin --authenticationDatabase=admin --archive=mongo-init_journeys.archive
mongorestore --host=localhost --port=27017 --username=admin --authenticationDatabase=admin --archive=mongo-init_places.archive
mongorestore --host=localhost --port=27017 --username=admin --authenticationDatabase=admin --archive=mongo-init_tags.archive

# running them all detached once ready
docker-compose -f docker-compose-api-dev.yml up -d
```
