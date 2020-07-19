import util from 'util';
import fs from 'fs';

import { BASE_GITHUB_URL } from '../constants';

import replaceTemplateVariables from './ReplaceTemplateVariables';
import generateDecryptionCommands from './GenerateDecryptionCommands';

const DEPLOTMENT_SCRIPT_TEMPLATE_LOCATION = `${__dirname}/../../templates/host_deploy`;
const DEPLOTMENT_SCRIPT_LOCATION = `${__dirname}/../../temp/host_deploy`;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readTemplate() {
  return readFile(DEPLOTMENT_SCRIPT_TEMPLATE_LOCATION, 'utf8');
}

async function writeScript(script) {
  return writeFile(DEPLOTMENT_SCRIPT_LOCATION, script);
}

async function fetchDecryptionCommands(secret) {
  const decryptionCommands = await generateDecryptionCommands(secret);
  const decryptionCommandsString = decryptionCommands.reduce(
    (acc, current) => `${acc}${current}\n`,
    '',
  );
  return decryptionCommandsString.trim();
}

function fetchProjectRepo(projectData) {
  return projectData.repository() || `${BASE_GITHUB_URL}${projectData.name()}`;
}

function fetchProjectName(projectData) {
  return projectData.name();
}

function fetchTargetExecutable(projectData) {
  return projectData.targetExecutable();
}

export default async function generateDeploymentScript(secret, projectData) {
  const templateData = await readTemplate();

  const script = replaceTemplateVariables(templateData, {
    project_name: fetchProjectName(projectData),
    project_repo: fetchProjectRepo(projectData),
    decryption_commands: await fetchDecryptionCommands(secret),
    pm2_start_target: fetchTargetExecutable(projectData),
  });

  await writeScript(script);
}
