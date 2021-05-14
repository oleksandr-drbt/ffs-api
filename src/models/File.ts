import BaseModel from './BaseModel';
import { Model } from 'objection';
import Project from './Project';
import FileService from '../services/FileService';

export interface IFile {
  id?: string;
  name: string;
  original_name: string;
  path: string;
}

class File extends BaseModel {
  id!: string;
  name!: string;
  original_name!: string;
  path!: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'files';
  static hidden = ['project_id', 'path', 'created_at', 'updated_at'];

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      original_name: { type: 'string', minLength: 1, maxLength: 255 },
      path: { type: 'string', minLength: 1, maxLength: 255 },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  static get virtualAttributes() {
    return ['fileUrl'];
  }

  get fileUrl() {
    return FileService.generateFileUrl(this.name, FileService.PROJECTS_DIRECTORY);
  }

  static relationMappings = {
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: Project,
      join: {
        from: 'files.project_id',
        to: 'projects.id',
      },
    },
  };

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

export default File;
