import * as Knex from 'knex';
import { v4 as uuid } from 'uuid';
import PasswordService from '../../services/PasswordService';

export async function seed(knex: Knex): Promise<any> {
  return knex('users').del()
    .then(async () => {
      return knex('users').insert([
        {
          id: uuid(),
          first_name: 'Test',
          last_name: 'Test',
          email: 'test@mail.com',
          phone: '+380999999999',
          position: 'QA',
          password: await PasswordService.hashPassword('123456'),
        },
      ]);
    });
}
