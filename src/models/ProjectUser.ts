import BaseModel from './BaseModel';
import { Model } from 'objection';
import Project from './Project';
import User from './User';

class ProjectUser extends BaseModel {
  is_accepted!: boolean;
  review?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'projects_users';

  static jsonSchema = {
    type: 'object',
    properties: {
      is_accepted: { type: 'boolean' },
      review: { type: 'string', maxLength: 2000 },
      completed_at: { type: 'datetime' },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'projects_users.user_id',
        to: 'users.id',
      },
    },
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: Project,
      join: {
        from: 'projects_users.project_id',
        to: 'projects.id',
      },
    },
  };
}

export default ProjectUser;
