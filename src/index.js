#!/usr/bin/env node

import fetchDynamoCredentials from './modules/credentials';
import readProjectData from './modules/storage';

import { DEFAULT_PROJECT_NAME } from './modules/constants';
import ProjectData from './modules/types';

const { argv } = require('yargs')
  .usage('Usage: $0 [options]')
  .example('$0 -s <decryption_secret> -p <project_name>')
  .alias('s', 'secret')
  .nargs('s', 1)
  .describe('s', 'Specify the client secret')
  .alias('p', 'projectName')
  .nargs('p', 1)
  .describe('p', 'Specify the project name')
  .demandOption(['s', 'p'])
  .help('h')
  .alias('h', 'help');

async function fetchProjectData(secret, projectName) {
  const dynamoCredentials = await fetchDynamoCredentials(secret);
  let projectData = await readProjectData(dynamoCredentials, projectName);

  if (projectData.Count !== 1) {
    projectData = await readProjectData(dynamoCredentials, DEFAULT_PROJECT_NAME);
  }

  return new ProjectData(projectData);
}

async function main() {
  const { secret, projectName } = argv;

  const projectData = await fetchProjectData(secret, projectName);

  process.stdout.write(JSON.stringify(projectData));
}

main();
