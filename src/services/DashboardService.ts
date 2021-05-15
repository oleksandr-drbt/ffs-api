import ProjectUser from '../models/ProjectUser';
import Project from '../models/Project';

class DashboardService {
  public static async getStudentDashboard(userId: string) {
    const requests = await ProjectUser.query().where({ user_id: userId })
      .withGraphFetched(`project(onlyFromBacklog).${Project.relationsExpr}`);

    const requestedProjects = requests
      // @ts-ignore
      .filter(({ project, is_accepted }) => project && !is_accepted)
      // @ts-ignore
      .map(({ project }) => project);
    const acceptedProjects = requests
      // @ts-ignore
      .filter(({ project, is_accepted }) => project && is_accepted)
      // @ts-ignore
      .map(({ project }) => project);

    return { requestedProjects, acceptedProjects };
  }

  public static async getTeacherDashboard(userId: string) {
    const projects = await Project.query().where({ user_id: userId });
    const requests = await ProjectUser.query()
      .distinct('project_id')
      // @ts-ignore
      .whereIn('project_id', projects.map(({ id }) => id))
      .withGraphFetched(`project.${Project.relationsExpr}`);
    // @ts-ignore
    const requestedProjects = requests
      // @ts-ignore
      .filter(({ project }) => project && project.status !== 'done')
      // @ts-ignore
      .map(({ project }) => project);
    const completedProjects = requests
      // @ts-ignore
      .filter(({ project }) => project && project.status === 'done')
      // @ts-ignore
      .map(({ project }) => project);

    return { requestedProjects, completedProjects };
  }
}

export default DashboardService;
