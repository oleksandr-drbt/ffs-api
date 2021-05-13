import User from '../models/User';
import Work from '../models/Work';

class WorkPolicy {
  public static canEdit(user: User, work: Work) {
    return user.id === work.user_id;
  }

  public static canDelete(user: User, work: Work) {
    return user.id === work.user_id;
  }
}

export default WorkPolicy;
