#!/usr/bin/env node

import {
  fetchDynamoCredentials,
  cleanupDynamoCredentials,
  decryptAwsKeyPair,
  cleanupAwsCredentials,
} from './modules/credentials';
import readProjectData from './modules/storage';

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
  .alias('c', 'cleanup')
  .nargs('c', 0)
  .describe('c', 'Specify whether to cleanup credentials')
  .demandOption(['s', 'p'])
  .help('h')
  .alias('h', 'help');

// clean up any artefacts generated from this tool
async function postRunCleanup() {
  cleanupDynamoCredentials();
  cleanupAwsCredentials();
}

// fetch the data about whatever project we're running this with
async function fetchProjectData(secret, projectName) {
  const dynamoCredentials = await fetchDynamoCredentials(secret);
  let projectData = await readProjectData(dynamoCredentials, projectName);

  if (projectData.Count !== 1) {
    projectData = await readProjectData(dynamoCredentials, DEFAULT_PROJECT_NAME);
  }

  if (projectData.Count !== 1) {
    throw new CouldNotReadDynamo();
  }

  return new ProjectData(projectData);
}

// orchestrates all calls needed by the tool
async function main() {
  const { secret, projectName, cleanup } = argv;

  try {
    const projectData = await fetchProjectData(secret, projectName);
    await decryptAwsKeyPair(secret);

    process.stdout.write(JSON.stringify(projectData));
  } catch (e) {
    process.stderr.write(JSON.stringify(e));
  }

  if (cleanup) {
    await postRunCleanup();
  }
}

main();
