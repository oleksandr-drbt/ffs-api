import { Request, Response } from 'express';
import multer from 'multer';
import ProjectService from '../services/ProjectService';
import FileService from '../services/FileService';
import ProjectPolicy from '../policies/ProjectPolicy';
import File, { IFile } from '../models/File';
import { validator } from '../libs/validator';
import { createProjectSchema, editProjectSchema } from '../schemas/projectSchemas';
import {
  PROJECT_NOT_FOUND,
  USER_ALREADY_REQUESTED_PROJECT,
  USER_DOESNT_HAVE_ACCESS_TO_PROJECT,
} from '../constants/errorMessages';
import { PROJECT_DELETED, PROJECT_REQUEST_CANCELED, PROJECT_REQUESTED } from '../constants/successMessages';

class ProjectController {
  /**
   * Create project
   * @param req
   * @param res
   */
  public static async create(req: Request, res: Response) {
    const upload = multer().fields([
      { name: 'title', maxCount: 1 },
      { name: 'description', maxCount: 1 },
      { name: 'type', maxCount: 1 },
      { name: 'students_count', maxCount: 1 },
      { name: 'duration', maxCount: 1 },
      { name: 'skills[]' },
      { name: 'files[]', maxCount: 5 },
    ]);

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const projectData = req.body;
      const errors = validator.validate(projectData, createProjectSchema);
      if (errors) {
        res.status(400).json({ errors });
        return;
      }

      // @ts-ignore
      const filesData = req.files['files[]'] ? req.files['files[]'] : null;
      const files: IFile[] = [];
      if (filesData) {
        filesData.map((file: Express.Multer.File) => {
          files.push(FileService.save(file, FileService.PROJECTS_DIRECTORY));
        });
      }

      // @ts-ignore
      const { id } = req.user;
      const project = await ProjectService.create({
        ...projectData,
        files: files,
        userId: id,
      });

      res.send(project);
    });
  }

  /**
   * Get list of user projects
   * @param req
   * @param res
   */
  public static async list(req: Request, res: Response) {
    // @ts-ignore
    const { id } = req.user;
    const projects = await ProjectService.findAllByUserId(id);

    res.send(projects);
  }

  /**
   * Update project
   * @param req
   * @param res
   */
  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    let project = await ProjectService.findById(id);
    const user = req.user;

    if (!project) {
      res.status(404).json({ message: PROJECT_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!ProjectPolicy.canEdit(user, project)) {
      res.status(403).json({ message: USER_DOESNT_HAVE_ACCESS_TO_PROJECT });
      return;
    }

    const upload = multer().fields([
      { name: 'title', maxCount: 1 },
      { name: 'description', maxCount: 1 },
      { name: 'type', maxCount: 1 },
      { name: 'students_count', maxCount: 1 },
      { name: 'duration', maxCount: 1 },
      { name: 'skills[]' },
      { name: 'removedFiles[]' },
      { name: 'files[]', maxCount: 5 },
    ]);

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const projectData = req.body;
      const errors = validator.validate(projectData, editProjectSchema);
      if (errors) {
        res.status(400).json({ errors });
        return;
      }

      // @ts-ignore
      const filesData = req.files['files[]'] ? req.files['files[]'] : null;
      const files: IFile[] = [];
      if (filesData) {
        filesData.map((file: Express.Multer.File) => {
          files.push(FileService.save(file, FileService.PROJECTS_DIRECTORY));
        });
      }

      if (projectData.removedFiles && projectData.removedFiles.length) {
        const filesEntities = await FileService.findAllByIds(projectData.removedFiles);
        filesEntities.map(({ path }) => {
          FileService.remove(path);
        });
      }

      // @ts-ignore
      project = await ProjectService.update(id, {
        ...projectData,
        files: files,
      });

      res.send(project);
    });
  }

  /**
   * Remove project
   * @param req
   * @param res
   */
  public static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const project = await ProjectService.findById(id);
    const user = req.user;

    if (!project) {
      res.status(404).json({ message: PROJECT_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!ProjectPolicy.canDelete(user, project)) {
      res.status(403).json({ message: USER_DOESNT_HAVE_ACCESS_TO_PROJECT });
      return;
    }

    // @ts-ignore
    if (project.files.length) {
      // @ts-ignore
      project.files.map((file: File) => {
        FileService.remove(file.path);
      });
    }

    await ProjectService.remove(id);

    res.json({ message: PROJECT_DELETED });
  }

  /**
   * Request project
   * @param req
   * @param res
   */
  public static async request(req: Request, res: Response) {
    const { id } = req.params;
    const project = await ProjectService.findById(id);
    const user = req.user;

    if (!project) {
      res.status(404).json({ message: PROJECT_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!ProjectPolicy.canRequest(user, project)) {
      res.status(403).json({ message: USER_ALREADY_REQUESTED_PROJECT });
      return;
    }

    // @ts-ignore
    await ProjectService.request(id, user);

    res.json({ message: PROJECT_REQUESTED });
  }

  /**
   * Request project
   * @param req
   * @param res
   */
  public static async cancelRequest(req: Request, res: Response) {
    const { id } = req.params;
    const project = await ProjectService.findById(id);
    const user = req.user;

    if (!project) {
      res.status(404).json({ message: PROJECT_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!ProjectPolicy.canCancelRequest(user, project)) {
      res.status(403).json({ message: USER_ALREADY_REQUESTED_PROJECT });
      return;
    }

    // @ts-ignore
    await ProjectService.cancelRequest(id, user);

    res.json({ message: PROJECT_REQUEST_CANCELED });
  }
}

export default ProjectController;
