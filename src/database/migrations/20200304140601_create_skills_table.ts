import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('skills', (table) => {
    table.increments('id').notNullable();
    table.string('name', 50).unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('skills');
}
