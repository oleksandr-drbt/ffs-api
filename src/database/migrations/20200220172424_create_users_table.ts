import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).unique().notNullable();
    table.enum('role', ['student', 'teacher']).defaultTo('student');
    table.string('phone', 20);
    table.string('position', 100);
    table.string('description', 255);
    table.string('password', 255).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('users');
}
