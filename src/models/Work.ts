import BaseModel from './BaseModel';
import { Model, QueryBuilder } from 'objection';
import User from './User';
import Image, { IImage } from './Image';
import ImageService from '../services/ImageService';

class Work extends BaseModel {
  id?: string;
  title!: string;
  description?: string | null;
  link?: string | null;
  image?: IImage | null;
  is_published!: boolean;
  user_id!: string;
  created_at?: string;
  updated_at?: string;

  static tableName = 'works';
  static hidden = ['image'];

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'uuid' },
      title: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: ['string', 'null'], maxLength: 255 },
      link: { type: ['string', 'null'], maxLength: 255 },
      is_published: { type: 'boolean', default: false },
      created_at: { type: 'datetime' },
      updated_at: { type: 'datetime' },
    },
  };

  static get virtualAttributes() {
    return ['imageUrl'];
  }

  get imageUrl() {
    if (!this.image) return null;

    return ImageService.generateImageUrl(this.image.name, ImageService.WORKS_DIRECTORY);
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static get modifiers() {
    return {
      orderByCreatedAt(builder: QueryBuilder<any>) {
        builder.orderBy('created_at', 'desc');
      },

      onlyPublished(builder: QueryBuilder<any>) {
        builder.where('is_published', true);
      },
    };
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'works.user_id',
        to: 'users.id',
      },
    },
    image: {
      relation: Model.HasOneRelation,
      modelClass: Image,
      join: {
        from: 'works.id',
        to: 'images.entity_id',
      },
    },
  };
}

export default Work;
