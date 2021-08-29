import util from 'util';
import fs from 'fs';
import chalk from 'chalk';

const readdir = util.promisify(fs.readdir);

function isFileEncrypted(fileName) {
  return fileName.endsWith('.enc');
}

function convertFileNameToRelative(fileName) {
  return `credentials/${fileName}`;
}

function trimEncryptionFileExtension(fileName) {
  return fileName.replace(/\.enc/, '');
}

// decrypts all files in the credentials folder
export default async function generateDecryptionCommands(secret) {
  const targetFolder = `${process.cwd()}/credentials`;

  return readdir(targetFolder)
    .then((files) => files
      .map((file) => {
        if (isFileEncrypted(file)) {
          const relativeEncryptedFilePath = convertFileNameToRelative(file);
          const relativeDecryptedFilePath = trimEncryptionFileExtension(
            relativeEncryptedFilePath,
          );

          return `openssl aes-256-cbc -d -a -in ${relativeEncryptedFilePath} -out ${relativeDecryptedFilePath} -k ${secret}`;
        }

        return null;
      })
      .filter((x) => x))
    .catch((err) => {
      process.stderr.write(chalk.red('Unable to read credentials folder\n'));
      throw err;
    });
}
