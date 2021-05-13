import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('works', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('title', 100).notNullable();
    table.string('description', 255);
    table.string('link', 255);
    table.boolean('is_published').defaultTo(false);
    table.uuid('user_id').unsigned().notNullable();
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('works');
}
