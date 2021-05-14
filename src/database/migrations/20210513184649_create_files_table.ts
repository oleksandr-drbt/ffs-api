import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('files', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('path', 255).notNullable();
    table.string('project_id', 100).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('files');
}
