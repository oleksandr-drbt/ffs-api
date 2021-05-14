import User from '../models/User';
import Project from '../models/Project';

class ProjectPolicy {
  public static canEdit(user: User, project: Project) {
    return user.id === project.user_id;
  }

  public static canDelete(user: User, project: Project) {
    return user.id === project.user_id;
  }
}

export default ProjectPolicy;
