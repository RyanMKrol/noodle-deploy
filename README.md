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
noodle-deploy -s "some_password" -p "some_project_name" -t "build/src/app.js";

```

## Arguments

- `-s` - The secret, required to access my Dynamo table, also used when executing the deployment script
- `-p` - The name of the project
- `-t` - The target that we want our deployment script to start running
- `-h` - The help page
