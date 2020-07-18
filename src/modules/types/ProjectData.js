export default class ProjectData {
  constructor(projectData) {
    this.projectData = projectData;
  }

  deploymentServers() {
    return this.projectData.deploymentServers;
  }
}
