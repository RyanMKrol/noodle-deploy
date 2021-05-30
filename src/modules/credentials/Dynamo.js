import shell from "shelljs";
import util from "util";
import fs from "fs";

import { CouldNotDecryptCredentials } from "../types";

const CREDENTIALS_FOLDER = `${__dirname}/../../../credentials`;
const readFile = util.promisify(fs.readFile);

async function fetchDynamoCredentials(secret) {
  // decrypt the credentials file
  const commandStatus = shell.exec(
    `openssl aes-256-cbc -d -a -in ${CREDENTIALS_FOLDER}/dynamo.json.enc -out ${CREDENTIALS_FOLDER}/dynamo.json -k ${secret}`
  );

  if (!commandStatus || commandStatus.code !== 0) {
    throw new CouldNotDecryptCredentials();
  }

  const dynamoCredentials = JSON.parse(
    await readFile(`${CREDENTIALS_FOLDER}/dynamo.json`, "utf8")
  );

  return dynamoCredentials;
}

function cleanupDynamoCredentials() {
  // remove credentials file
  fs.unlinkSync(`${CREDENTIALS_FOLDER}/dynamo.json`);
}

export { fetchDynamoCredentials, cleanupDynamoCredentials };
