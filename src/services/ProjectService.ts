import { v4 as uuid } from 'uuid';
import Project from '../models/Project';
import SkillService from './SkillService';
import File, { IFile } from '../models/File';
import Skill from '../models/Skill';

export interface ICreateProject {
  title: string;
  description: string;
  type: string;
  students_count: string;
  duration: string;
  userId: string;
  skills: string[];
  files: IFile[];
}

export interface IEditProject {
  title?: string;
  description?: string;
  type?: string;
  students_count?: string;
  duration?: string;
  skills?: string[];
  removedFiles?: string[];
  files?: IFile[];
}

class ProjectService {
  public static async create(projectData: ICreateProject) {
    const {
      title,
      description,
      type,
      students_count,
      duration,
      userId,
      skills = [],
      files = [],
    } = projectData;

    const projectId = uuid();
    const project = await Project.query().insertAndFetch({
      id: projectId,
      title: title,
      description: description,
      type: type,
      students_count: students_count,
      duration: duration,
      user_id: userId,
    });
    await SkillService.addSkillsToEntity(project, skills);

    if (files.length) {
      await project.$relatedQuery<File>('files')
        .insert(files.map(file => ({
          ...file,
          id: uuid(),
        })));
    }

    return this.findById(projectId);
  }

  public static async findById(id: string = ''): Promise<Project> {
    return Project.query().findById(id).withGraphFetched(Project.relationsExpr);
  }

  public static async findAllByUserId(userId: string = '') {
    return Project.query().where('user_id', userId).orderBy('updated_at', 'desc')
      .withGraphFetched(Project.relationsExpr);
  }

  public static async update(id: string, projectData: IEditProject) {
    const {
      title,
      description,
      type,
      students_count,
      duration,
      skills = [],
      removedFiles = [],
      files = [],
    } = projectData;

    const project = await Project.query().patchAndFetchById(id, {
      title: title,
      description: description,
      type: type,
      students_count: students_count,
      duration: duration,
    });
    await SkillService.addSkillsToEntity(project, skills);

    if (removedFiles.length) {
      await project.$relatedQuery<File>('files')
        .whereIn('id', removedFiles)
        .delete();
    }

    if (files.length) {
      await project.$relatedQuery<File>('files')
        .insert(files.map(file => ({
          ...file,
          id: uuid(),
        })));
    }

    return this.findById(id);
  }

  public static async remove(id: string) {
    const project = await this.findById(id);
    await project.$relatedQuery<File>('files').delete();
    await project.$relatedQuery<Skill>('skills').unrelate();

    return project.$query().delete();
  }
}

export default ProjectService;
