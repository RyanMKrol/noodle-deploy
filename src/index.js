#!/usr/bin/env node

import shell from 'shelljs';
import util from 'util';
import fs from 'fs';

const credentialsFolder = `${__dirname}/../credentials`;

shell.exec(
  `openssl aes-256-cbc -d -a -in ${credentialsFolder}/dynamo.json.enc -out ${credentialsFolder}/dynamo.json -k ${process.argv[2]}`,
);

const readFile = util.promisify(fs.readFile);

readFile(`${credentialsFolder}/dynamo.json`, 'utf8').then((data) => {
  console.log(JSON.parse(data));
});

console.log(process.argv);
