# digiluonto-cypress
Digiluonto uses Cypress for testing within Docker containers.

**Cypress in a nutshell**: Cypress is a next generation front end testing tool built for the modern web. We address the key pain points developers and QA engineers face when testing modern applications.


## Configuration
The main Cypress configuration file is `cypress.json`. In that file the most common URLs and settings are specified. The main configuration should remain the same, and variations to standard configs should be made with environment files.

By default, Cypress (in Docker container) looks for a file `cypress.env.json` for the user specified modifications. A sample of such environment file is given in `cypress.env.json.sample`. At the moment, only the sample environment file is included in the repo structure.

There several ways for modifying the environment of the Cypress executable, but this project uses one of the following strategies:
1. Use a default environment file scheme:
   1. Copy `cypress.env.json.sample` to `cypress.env.json`
   2. Modify the file as necessary.
   3. Run Cypress with: `digiluonto-cypress $ ./headless.sh`
2. Maintaining multiple environment files (e.g., you like to handle dev, testing & production from your local machine), and giving the desired configuration file as argument for the docker script:
   1. Copy `cypress.env.json.sample` to `production.cypress.env.json`
   2. Modify the file as necessary.
   3. Run Cypress with: `digiluonto-cypress $ ./headless.sh production.cypress.env.json`


## Install & Run
The provided scripts utilize the following Docker image: `cypress/included:9.2.1`. See the **Configuration** section for setting up the environment.

There are two flavors of scripts to choose: **headless** and **headed**:
* `headless.sh`: is suitable for simply running end-to-end tests without interaction (e.g., CI/CD).
* `headed.sh`: is suitable for interactive development of test suites (e.g., development).

Both scripts can be run without arguments, or by giving a filename argument.
- If no argument is given, the container will use `cypress.json` and the existing `cypress.env.json`
- If an argument is given, and such file exists, the script will map that file inside the container to a file `/e2e/cypress.env.json`.

### Headless Usage
No special notes about headless mode. Just runs tests in a batch, and reports the results.

Example usage:
1. No arguments: `$ ./headless.sh`
2. Default sample environment file: `$ ./headless.sh cypress.env.json.sample`
3. Your environment file: `$ ./headless.sh your.environment.file`

### Headed Usage
**N.B.! This is not yet tested properly on multiple machines.**

1. Requires mounting of X11 temporary files.
   * The default location is `/tmp/.X11-unix` which is handled by the script
   * **If you have different location, modify the script as necessary**
2. Requires giving access control to your running X session with `xhost`
   * This can be done by running `xhost +si:localuser:root` (handled by the script)
   * Revoking control is done by running: `xhost -si:localuser:root` (**not** handled by the script)

Example usage (practically the same as `headless.sh`:
1. No arguments: `$ ./headed.sh`
2. Default sample environment file: `$ ./headed.sh cypress.env.json.sample`
3. Your environment file: `$ ./headed.sh your.environment.file`

## Folder Structure
Cypress will scan `tests` folder for `*spec.js` files for running tests. Just write or create test specification, and commit to version control. No further configurations are needed.

```
root 			>>> main settings and scripts
|-tests			>>> subfolders & *.spec.js: files for defining tests to be run
|-cypress		>>> all cypress generated output files
  |-downloads
  |-fixtures
  |-plugins
  |-screenshots
  |-support
  |-videos
|-node_modules	>>> Optional: downloaded by npm for IDE integration
```


## Development and IDE Integration
To integrate Cypress with your IDE (e.g., VSCode), a simple `package.json` with cypress devDependency is specified for your convenience. Simply run `npm ci` to download and install the required packages.


## Cypress More Information
See `cypress.md` for variety of Cypress related information.
