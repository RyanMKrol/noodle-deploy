import shell from 'shelljs';

import { DEPLOYMENT_SCRIPT_LOCATION } from '../constants';
import { getAwsCredentialsPath } from '../credentials';

export default async function executeDeploymentScript(secret, projectData) {
  const deploymentServers = projectData.deploymentServers();

  // for now I'm only deploying to a single server
  const deploymentServer = deploymentServers[0];

  const deployCommandStatus = shell.exec(
    `ssh -o "StrictHostKeyChecking no" -i ${getAwsCredentialsPath()}  ec2-user@${deploymentServer} "bash -s" < ${DEPLOYMENT_SCRIPT_LOCATION} $AES_PASS`,
  );

  console.log(deployCommandStatus);
}
