import BaseModel from './BaseModel';

export interface ISkill {
  id?: string;
  name: string;
}

class Skill extends BaseModel {
  id!: string;
  name!: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'skills';
  static hidden = ['created_at', 'updated_at'];

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 50 },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

export default Skill;
