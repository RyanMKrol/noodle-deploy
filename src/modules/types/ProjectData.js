export default class ProjectData {
  constructor(projectData, projectName) {
    this.projectData = projectData;
    this.projectData.name = projectName;
  }

  deploymentServers() {
    return this.projectData.deploymentServers;
  }

  repository() {
    return this.projectData.repository;
  }
}
