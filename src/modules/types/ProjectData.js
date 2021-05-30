export default class ProjectData {
  constructor(projectData, projectName, targetExecutable, targetExecutableArgs) {
    this.projectData = projectData;
    this.projectData.name = projectName;
    this.projectData.targetExecutable = targetExecutable;
    this.projectData.targetExecutableArgs = targetExecutableArgs;
  }

  deploymentServers() {
    return this.projectData.Items[0].deploymentServers;
  }

  repository() {
    return this.projectData.Items[0].repository;
  }

  name() {
    return this.projectData.name;
  }

  targetExecutable() {
    return this.projectData.targetExecutable;
  }

  targetExecutableArgs() {
    return this.projectData.targetExecutableArgs;
  }
}
