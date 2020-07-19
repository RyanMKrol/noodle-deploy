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
  .usage('Usage: $0 [options]')
  .example('$0 -s <decryption_secret> -p <project_name>')
  .alias('s', 'secret')
  .nargs('s', 1)
  .describe('s', 'Specify the client secret')
  .alias('p', 'projectName')
  .nargs('p', 1)
  .describe('p', 'Specify the project name')
  .alias('t', 'target')
  .nargs('t', 1)
  .describe('t', 'Specify the build target - which file needs to be run once the project has built')
  .demandOption(['s', 'p', 't'])
  .help('h')
  .alias('h', 'help');

// clean up any artefacts generated from this tool
async function postRunCleanup() {
  cleanupDynamoCredentials();
  cleanupAwsCredentials();
  cleanupScript();
}

// fetch the data about whatever project we're running this with
async function fetchProjectData(secret, projectName, target) {
  const dynamoCredentials = await fetchDynamoCredentials(secret);
  let projectData = await readProjectData(dynamoCredentials, projectName);

  if (projectData.Count !== 1) {
    projectData = await readProjectData(dynamoCredentials, DEFAULT_PROJECT_NAME);
  }

  if (projectData.Count !== 1) {
    throw new CouldNotReadDynamo();
  }

  return new ProjectData(projectData, projectName, target);
}

// orchestrates all calls needed by the tool
async function main() {
  const { secret, projectName, target } = argv;

  try {
    const projectData = await fetchProjectData(secret, projectName, target);
    await decryptAwsKeyPair(secret);
    await generateDeploymentScript(secret, projectData);
    await executeDeploymentScript(secret, projectData);
  } catch (e) {
    process.stderr.write(e.toString());
  }

  await postRunCleanup();
}

main();
