import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('files', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('path', 255).notNullable();
    table.uuid('project_id').notNullable();
    table.timestamps(true, true);

    table.foreign('project_id').references('id').inTable('projects')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('files');
}
