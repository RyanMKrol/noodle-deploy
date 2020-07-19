export default class ProjectData {
  constructor(projectData, projectName, targetExecutable) {
    this.projectData = projectData;
    this.projectData.name = projectName;
    this.projectData.targetExecutable = targetExecutable;
  }

  deploymentServers() {
    return this.projectData.deploymentServers;
  }

  repository() {
    return this.projectData.repository;
  }

  name() {
    return this.projectData.name;
  }

  targetExecutable() {
    return this.projectData.targetExecutable;
  }
}
