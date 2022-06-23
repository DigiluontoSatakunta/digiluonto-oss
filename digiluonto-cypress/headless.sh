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
CY_RUN_CMD="run"
CY_RUN_ARGUMENTS="--config-file cypress.json"
CY_E2E_VOLUME="-v $FULL_PATH:/e2e"
DOCKER_OPTS=""

docker run --rm -it $CY_E2E_VOLUME $CY_ENVIRONMENT_VOLUME -w /e2e $DOCKER_OPTS --entrypoint=cypress $CY_IMAGE $CY_RUN_CMD $CY_RUN_ARGUMENTS
