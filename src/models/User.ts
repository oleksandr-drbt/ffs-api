import BaseModel from './BaseModel';
import { Model } from 'objection';
import Skill from './Skill';

class User extends BaseModel {
  id?: string;
  first_name!: string;
  last_name!: string;
  email!: string;
  phone?: string;
  position?: string;
  avatar?: string;
  password!: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'users';
  static hidden = ['password', 'created_at', 'updated_at'];

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'uuid' },
      first_name: { type: 'string', minLength: 1, maxLength: 100 },
      last_name: { type: 'string', minLength: 1, maxLength: 100 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      phone: { type: 'string', maxLength: 20 },
      position: { type: 'string', maxLength: 100 },
      avatar: { type: 'string', maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static relationMappings = {
    skills: {
      relation: Model.ManyToManyRelation,
      modelClass: Skill,
      join: {
        from: 'users.id',
        through: {
          from: 'users_skills.user_id',
          to: 'users_skills.skill_id',
        },
        to: 'skills.id',
      },
    },
  };
}

export default User;
