#!/bin/sh

FULL_PATH=$(dirname $(realpath $0))

if [[ $# -eq 0 ]]
  then
    echo "No extra arguments supplied. Using default configuration."
    CY_ENVIRONMENT_VOLUME="--mount type=bind,source=$PWD/cypress.env.json.empty,target=/e2e/cypress.env.json"
  else
    ENV_FILE=$1
    if test -f $ENV_FILE; then
      echo "$ENV_FILE exists and not empty"
      CY_ENVIRONMENT_VOLUME="--mount type=bind,source=$PWD/$ENV_FILE,target=/e2e/cypress.env.json"
    else
      echo "$ENV_FILE doesn't exist or is empty... Exiting"
      exit 1
    fi
fi

CY_IMAGE="cypress/included:9.2.1"
CY_RUN_CMD="open --project ."
CY_RUN_ARGUMENTS="--config-file cypress.json"
CY_E2E_VOLUME="-v $FULL_PATH:/e2e"
DOCKER_OPTS=""

# Stuff for DISPLAY! Needed are 1) xorg volume and 2) xhost
# You maybe need to set DISPLAY environment manually by 'export DISPLAY=:0'
# MacOS users: see https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/#Interactive-mode
# MacOS users: see https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/
DOCKER_OPTS="--mount type=bind,source=/tmp/.X11-unix,target=/tmp/.X11-unix -e DISPLAY"
xhost +si:localuser:root
# To revoke given access once finished, run 'xhost -si:localuser:root'

docker run --rm -it $CY_E2E_VOLUME $CY_ENVIRONMENT_VOLUME -w /e2e $DOCKER_OPTS --entrypoint=cypress $CY_IMAGE $CY_RUN_CMD $CY_RUN_ARGUMENTS
