#!/usr/bin/env node

import fetchDynamoCredentials from './modules/credentials';

fetchDynamoCredentials(process.argv[2]).then((data) => {
  console.log(data);
});
