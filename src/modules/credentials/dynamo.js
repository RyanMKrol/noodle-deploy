import shell from 'shelljs';
import util from 'util';
import fs from 'fs';

const CREDENTIALS_FOLDER = `${__dirname}/../../../credentials`;
const readFile = util.promisify(fs.readFile);

async function fetchDynamoCredentials(secret) {
  // decrypt the credentials file
  shell.exec(
    `openssl aes-256-cbc -d -a -in ${CREDENTIALS_FOLDER}/dynamo.json.enc -out ${CREDENTIALS_FOLDER}/dynamo.json -k ${secret}`,
  );

  // read credentials
  const dynamoCredentials = await readFile(`${CREDENTIALS_FOLDER}/dynamo.json`, 'utf8');

  // remove credentials file
  fs.unlinkSync(`${CREDENTIALS_FOLDER}/dynamo.json`);

  return dynamoCredentials;
}

export default fetchDynamoCredentials;
