import { Request, Response } from 'express';
import multer from 'multer';
import WorkService from '../services/WorkService';
import ImageService from '../services/ImageService';
import WorkPolicy from '../policies/WorkPolicy';
import { imageFileFilter } from '../libs/filters';
import { validator } from '../libs/validator';
import { createWorkSchema, editWorkSchema } from '../schemas/workSchemas';
import { USER_DOESNT_HAVE_ACCESS_TO_WORK, WORK_NOT_FOUND } from '../constants/errorMessages';
import { WORK_DELETED } from '../constants/successMessages';

class WorkController {
  /**
   * Create portfolio's work
   * @param req
   * @param res
   */
  public static async create(req: Request, res: Response) {
    const upload = multer({ fileFilter: imageFileFilter }).fields([
      { name: 'title', maxCount: 1 },
      { name: 'description', maxCount: 1 },
      { name: 'link', maxCount: 1 },
      { name: 'is_published', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]);

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const workData = req.body;
      const errors = validator.validate(workData, createWorkSchema);
      if (errors) {
        res.status(400).json({ errors });
        return;
      }

      // @ts-ignore
      const imageData = req.files?.image ? req.files?.image[0] : null;
      let image = null;
      if (imageData) {
        image = await ImageService.save(imageData, ImageService.WORKS_DIRECTORY, 415, 250);
      }

      // @ts-ignore
      const { id } = req.user;
      const work = await WorkService.create({
        ...workData,
        image: image,
        userId: id,
      });

      res.send(work);
    });
  }

  /**
   * Get list of user portfolio works
   * @param req
   * @param res
   */
  public static async list(req: Request, res: Response) {
    // @ts-ignore
    const { id } = req.user;
    const works = await WorkService.findAllByUserId(id);

    res.send(works);
  }

  /**
   * Update work
   * @param req
   * @param res
   */
  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    let work = await WorkService.findById(id);
    const user = req.user;

    if (!work) {
      res.status(404).json({ message: WORK_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!WorkPolicy.canEdit(user, work)) {
      res.status(403).json({ message: USER_DOESNT_HAVE_ACCESS_TO_WORK });
      return;
    }

    const upload = multer({ fileFilter: imageFileFilter }).fields([
      { name: 'title', maxCount: 1 },
      { name: 'description', maxCount: 1 },
      { name: 'link', maxCount: 1 },
      { name: 'is_published', maxCount: 1 },
      { name: 'image', maxCount: 1 },
      { name: 'is_image_removed', maxCount: 1 },
    ]);

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const workData = req.body;
      const errors = validator.validate(workData, editWorkSchema);
      if (errors) {
        res.status(400).json({ errors });
        return;
      }

      // @ts-ignore
      const imageData = req.files?.image ? req.files?.image[0] : null;
      let image = null;
      if (imageData) {
        if (work.image) {
          await ImageService.remove(work.image.path);
        }
        image = await ImageService.save(imageData, ImageService.WORKS_DIRECTORY, 415, 250);
      } else if (workData.is_image_removed === 'true' && work.image) {
        await ImageService.remove(work.image.path);
      }

      work = await WorkService.update(id, {
        ...workData,
        image: image,
        isImageRemoved: workData.is_image_removed === 'true',
      });

      res.send(work);
    });
  }

  /**
   * Remove work
   * @param req
   * @param res
   */
  public static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const work = await WorkService.findById(id);
    const user = req.user;

    if (!work) {
      res.status(404).json({ message: WORK_NOT_FOUND });
      return;
    }

    // @ts-ignore
    if (!WorkPolicy.canDelete(user, work)) {
      res.status(403).json({ message: USER_DOESNT_HAVE_ACCESS_TO_WORK });
      return;
    }

    if (work.image) {
      await ImageService.remove(work.image.path);
    }
    await WorkService.remove(id);

    res.json({ message: WORK_DELETED });
  }
}

export default WorkController;
