import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('projects_skills', (table) => {
    table.uuid('project_id').notNullable();
    table.integer('skill_id').notNullable();

    table.foreign('project_id').references('id').inTable('projects')
      .onDelete('cascade').onUpdate('cascade');
    table.foreign('skill_id').references('id').inTable('skills')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('projects_skills');
}
