import { v4 as uuid } from 'uuid';
import Work from '../models/Work';
import Image, { IImage } from '../models/Image';

export interface ICreateWork {
  title: string;
  description?: string;
  link?: string;
  image?: IImage;
  is_published: string;
  userId: string;
}

export interface IEditWork {
  title?: string;
  description?: string;
  link?: string;
  image?: IImage;
  is_published?: string;
  isImageRemoved?: boolean;
}

class WorkService {
  public static async create(workData: ICreateWork) {
    const {
      title,
      description,
      link,
      image,
      userId,
      is_published: isPublished,
    } = workData;

    const workId = uuid();
    const work = await Work.query().insertAndFetch({
      id: workId,
      title: title,
      description: description,
      link: link,
      is_published: isPublished === 'true',
      user_id: userId,
    });

    if (image) {
      const imageId = uuid();
      await work.$relatedQuery<Image>('image').insert({
        id: imageId,
        ...image,
      });
    }

    return this.findById(workId);
  }

  public static async findById(id: string = ''): Promise<Work> {
    return Work.query().findById(id).withGraphFetched('image');
  }

  public static async findAllByUserId(userId: string = '') {
    return Work.query().where('user_id', userId).orderBy('updated_at', 'desc')
      .withGraphFetched('image');
  }

  public static async update(id: string, workData: IEditWork) {
    const {
      title,
      description,
      link,
      image,
      isImageRemoved,
      is_published: isPublished,
    } = workData;

    const work = await Work.query().patchAndFetchById(id, {
      title: title,
      description: description,
      link: link,
      is_published: isPublished === 'true',
    }).withGraphFetched('[image]');

    if (image) {
      if (work.image) {
        await work.$relatedQuery<Image>('image').delete();
      }

      const imageId = uuid();
      await work.$relatedQuery<Image>('image').insert({
        id: imageId,
        ...image,
      });
    } else if (isImageRemoved && work.image) {
      await work.$relatedQuery<Image>('image').delete();
    }

    return this.findById(id);
  }

  public static async remove(id: string) {
    const work = await this.findById(id);

    if (work.image) {
      await work.$relatedQuery<Image>('image').delete();
    }

    return work.$query().delete();
  }
}

export default WorkService;
