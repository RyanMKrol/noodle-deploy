import shell from 'shelljs';
import fs from 'fs';

import { CouldNotDecryptCredentials, CouldNotChmodFile } from '../types';

const credentialsFolder = `${process.cwd()}/credentials`;

function getAwsCredentialsPath() {
  return `${credentialsFolder}/awsKeypair.pem`;
}

// decrypts the credentials file, leaving it in the filesystem for use later
async function decryptAwsKeyPair(secret) {
  // decrypt the credentials file
  const decryptCommandStatus = shell.exec(
    `openssl aes-256-cbc -pbkdf2 -d -a -in ${credentialsFolder}/awsKeypair.pem.enc -out ${credentialsFolder}/awsKeypair.pem -k ${secret}`,
  );

  if (!decryptCommandStatus || decryptCommandStatus.code !== 0) {
    throw new CouldNotDecryptCredentials();
  }

  const chmodCommandStatus = shell.exec(`chmod 400 ${credentialsFolder}/awsKeypair.pem`);

  if (!chmodCommandStatus || chmodCommandStatus.code !== 0) {
    throw new CouldNotChmodFile();
  }
}

// removes the credentials file
function cleanupAwsCredentials() {
  // remove credentials file
  fs.unlinkSync(`${credentialsFolder}/awsKeypair.pem`);
}

export { decryptAwsKeyPair, cleanupAwsCredentials, getAwsCredentialsPath };
