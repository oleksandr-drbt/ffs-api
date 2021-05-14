import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('projects_skills', (table) => {
    table.string('project_id').notNullable();
    table.integer('skill_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('projects_skills');
}
