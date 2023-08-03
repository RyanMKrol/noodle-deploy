# Deprecated

This was a fun project that helped me manage the process around deploying my side projects. It removed the work to have to manually log on to the box, rebuild, and re-daemonise the binary. This project is now quite out of date, and I don't have enough projects to justify the upkeep. Fun while it lasted though!

# noodle-deploy

## Overview

This tool abstracts out the deployment process for all of my projects. On each run it does the following:

- Reads data form a Dynamo table about my projects, this will be used if I want to deploy a certain project to a different server
- Generates a deployment script which include:
  - Pulling the latest vesion of the project
  - Any decryption of credentials that needs doing
  - Building the project
  - Running the project
- Executes the above deployment script

## Usage

```
noodle-deploy -s "secret" -p "project_name" -t "build/src/app.js";

```

## Arguments

- `-s` - The secret, required to access my Dynamo table, also used when executing the deployment script
- `-p` - The name of the project
- `-t` - The target that we want our deployment script to start running
- `-h` - The help page
