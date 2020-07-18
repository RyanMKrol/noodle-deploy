#!/usr/bin/env node

import fetchDynamoCredentials from './modules/credentials';
import readProjectData from './modules/storage';

async function main() {
  const decryptionPassword = process.argv[2];
  const projectName = process.argv[3];

  const dynamoCredentials = await fetchDynamoCredentials(decryptionPassword);
  const projectData = await readProjectData(dynamoCredentials, projectName);

  console.log(projectData);
  console.log(JSON.stringify(projectData));
}

main();
