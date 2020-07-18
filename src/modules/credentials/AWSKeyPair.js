import shell from 'shelljs';
import fs from 'fs';

const CREDENTIALS_FOLDER = `${__dirname}/../../../credentials`;

// decrypts the credentials file, leaving it in the filesystem for use later
async function decryptAwsKeyPair(secret) {
  // decrypt the credentials file
  shell.exec(
    `openssl aes-256-cbc -d -a -in ${CREDENTIALS_FOLDER}/awsKeypair.pem.enc -out ${CREDENTIALS_FOLDER}/awsKeypair.pem -k ${secret}`,
  );

  shell.exec(`chmod 400 ${CREDENTIALS_FOLDER}/awsKeypair.pem`);
}

// removes the credentials file
function cleanupAwsCredentials() {
  // remove credentials file
  fs.unlinkSync(`${CREDENTIALS_FOLDER}/awsKeypair.pem`);
}

export { decryptAwsKeyPair, cleanupAwsCredentials };
