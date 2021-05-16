import ProjectUser from '../models/ProjectUser';
import Project from '../models/Project';
import UserService from './UserService';

class DashboardService {
  public static async getStudentDashboard(userId: string) {
    const user = await UserService.find(userId);
    const requestedProjects = await user.$relatedQuery<Project>('requestedProjects')
      .modify('onlyFromBacklog')
      .where('is_accepted', false)
      .withGraphFetched(Project.relationsExpr);

    const acceptedProjects = await user.$relatedQuery<Project>('requestedProjects')
      .modify('onlyFromBacklog')
      .where('is_accepted', true)
      .withGraphFetched(Project.relationsExpr);

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
