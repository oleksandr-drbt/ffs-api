import BaseModel from './BaseModel';
import { Model } from 'objection';
import User from './User';

export interface IImage {
  id?: string;
  name: string;
  path: string;
}

class Image extends BaseModel {
  id!: string;
  name!: string;
  path!: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'images';
  static hidden = ['entity_id', 'path', 'created_at', 'updated_at'];

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 150 },
      path: { type: 'string', minLength: 1, maxLength: 250 },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'images.entity_id',
        to: 'users.id',
      },
    },
  };

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

export default Image;
