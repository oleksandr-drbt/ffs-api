import Knex from 'knex';
import knexfileConfig from '../knexfile-config';
import { Model } from 'objection';

const knex = Knex(knexfileConfig.development);

export default {
	init: () => {
		Model.knex(knex);
	}
};
