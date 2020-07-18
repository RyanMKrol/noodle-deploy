#!/usr/bin/env node

import fetchDynamoCredentials from './modules/credentials';
import readProjectData from './modules/storage';

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

async function main() {
  const { secret } = argv;
  const { projectName } = argv;

  const dynamoCredentials = await fetchDynamoCredentials(secret);
  const projectData = await readProjectData(dynamoCredentials, projectName);

  process.stdout.write(JSON.stringify(projectData));
}

main();
