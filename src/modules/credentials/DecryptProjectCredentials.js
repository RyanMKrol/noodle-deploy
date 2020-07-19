import util from 'util';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';

const readdir = util.promisify(fs.readdir);

function isFileEncrypted(fileName) {
  return fileName.endsWith('.enc');
}

function convertFileNameToAbsolute(fileName) {
  return `${process.cwd()}/credentials/${fileName}`;
}

function trimEncryptionFileExtension(fileName) {
  return fileName.replace(/\.enc/, '');
}

// decrypts all files in the credentials folder
async function decryptProjectCredentials(secret) {
  const targetFolder = `${process.cwd()}/credentials`;

  return readdir(targetFolder)
    .then((files) => {
      files.forEach((file) => {
        if (isFileEncrypted(file)) {
          const absoluteEncryptedFilePath = convertFileNameToAbsolute(file);
          const absoluteDecryptedFilePath = trimEncryptionFileExtension(absoluteEncryptedFilePath);

          // decrypt target file
          const commandStatus = shell.exec(
            `openssl aes-256-cbc -d -a -in ${absoluteEncryptedFilePath} -out ${absoluteDecryptedFilePath} -k ${secret}`,
          );

          // if the decrypt fails, log it, and remove the garbage file that will have been generated
          if (!commandStatus || commandStatus.code !== 0) {
            process.stderr.write(
              chalk.red(`Decrypt failed for project file: ${absoluteEncryptedFilePath}\n`),
            );
            fs.unlinkSync(absoluteDecryptedFilePath);
          }
        }
      });
    })
    .catch((err) => {
      process.stderr.write(chalk.red('Unable to read credentials folder\n'));
      throw err;
    });
}

// removes any decrypted files from the credentials folder
async function cleanupProjectCredentials() {
  const targetFolder = `${process.cwd()}/credentials`;

  return readdir(targetFolder)
    .then((files) => {
      // listing all files using forEach
      files.forEach((file) => {
        if (!isFileEncrypted(file)) {
          fs.unlinkSync(file);
        }
      });
    })
    .catch((err) => {
      process.stderr.write(chalk.red('Unable to read credentials folder\n'));
      throw err;
    });
}

export { decryptProjectCredentials, cleanupProjectCredentials };
