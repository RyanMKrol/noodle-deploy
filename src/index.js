#!/usr/bin/env node

import {
  fetchDynamoCredentials,
  cleanupDynamoCredentials,
  decryptAwsKeyPair,
  cleanupAwsCredentials,
} from './modules/credentials';
import readProjectData from './modules/storage';
import { cleanupScript, generateDeploymentScript } from './modules/template';
import executeDeploymentScript from './modules/execute';

import { DEFAULT_PROJECT_NAME } from './modules/constants';
import { ProjectData, CouldNotReadDynamo } from './modules/types';

// gates the application being used without the correct arguments
const { argv } = require('yargs')
  .usage('Usage: node $0 [options]')
  .example(
    '$0 -s <decryption_secret> -p <project_name> -t <target_to_start> -a <arguments_to_target>',
  )
  .option('secret', {
    alias: 's',
    type: 'string',
    description: 'Specify the client secret',
  })
  .option('projectName', {
    alias: 'p',
    type: 'string',
    description: 'Specify the project name',
  })
  .option('target', {
    alias: 't',
    type: 'string',
    description: 'Specify the build target - which file needs to be run once the project has built',
  })
  .option('targetArgs', {
    alias: 'a',
    type: 'array',
    description: 'Specify the arguments to your program',
  })
  .demandOption(['s', 'p', 't'])
  .coerce('targetArgs', (args) => args.map((arg) => {
    const splitArgs = arg.split(' ');

    if (splitArgs.length !== 2) {
      throw new Error('Args must be space separated');
    }

    return `--${arg}`;
  }))
  .help()
  .fail((msg) => {
    process.stderr.write(msg);
    process.exit(1);
  });

// clean up any artefacts generated from this tool
async function postRunCleanup() {
  cleanupDynamoCredentials();
  cleanupAwsCredentials();
  cleanupScript();
}

// fetch the data about whatever project we're running this with
async function fetchProjectData(secret, projectName, target, targetArgs) {
  const dynamoCredentials = await fetchDynamoCredentials(secret);
  let projectData = await readProjectData(dynamoCredentials, projectName);

  if (projectData.Count !== 1) {
    projectData = await readProjectData(dynamoCredentials, DEFAULT_PROJECT_NAME);
  }

  if (projectData.Count !== 1) {
    throw new CouldNotReadDynamo();
  }

  return new ProjectData(projectData, projectName, target, targetArgs);
}

// orchestrates all calls needed by the tool
async function main() {
  const {
    secret, projectName, target, targetArgs,
  } = argv;

  try {
    const projectData = await fetchProjectData(secret, projectName, target, targetArgs);
    await decryptAwsKeyPair(secret);
    await generateDeploymentScript(secret, projectData);
    await executeDeploymentScript(secret, projectData);
  } catch (e) {
    process.stderr.write(e.toString());
  }

  await postRunCleanup();
}

main();
