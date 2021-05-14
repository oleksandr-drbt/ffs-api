import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('title', 200).notNullable();
    table.text('description').notNullable();
    table.enum('type', ['ongoing', 'onetime', 'none']).defaultTo('none');
    table.enum('students_count', ['one', 'many']).defaultTo('many');
    table.enum('duration', ['lessone', 'onethree', 'threesix', 'oversix']).defaultTo('lessone');
    table.enum('status', ['backlog', 'inprogress', 'done']).defaultTo('backlog');
    table.uuid('user_id').unsigned().notNullable();
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('projects');
}
