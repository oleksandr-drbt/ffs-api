import User from '../models/User';
import Project from '../models/Project';

class ProjectPolicy {
  public static canEdit(user: User, project: Project) {
    return user.id === project.user_id;
  }

  public static canDelete(user: User, project: Project) {
    return user.id === project.user_id;
  }

  public static canRequest(user: User, project: Project) {
    // @ts-ignore
    return !project.participants.some(({ id }) => id === user.id);
  }

  public static canCancelRequest(user: User, project: Project) {
    // @ts-ignore
    return project.participants.some(({ id }) => id === user.id);
  }
}

export default ProjectPolicy;
