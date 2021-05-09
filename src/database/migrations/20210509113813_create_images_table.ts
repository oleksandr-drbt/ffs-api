import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('images', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name', 150).notNullable();
    table.string('path', 250).notNullable();
    table.string('entity_id', 100).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('images');
}
