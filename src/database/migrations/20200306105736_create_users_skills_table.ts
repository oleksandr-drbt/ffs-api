import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users_skills', (table) => {
    table.string('user_id').notNullable();
    table.integer('skill_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('users_skills');
}
