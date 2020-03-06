import Knex from 'knex';
import knexfileConfig from '../knexfile-config';
import { Model } from 'objection';

const knexConfig = Knex(knexfileConfig.development);

export const db = {
  init: () => {
    Model.knex(knexConfig);
  },
};
