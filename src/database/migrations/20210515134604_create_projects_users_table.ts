import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('projects_users', (table) => {
    table.uuid('project_id').unsigned().notNullable();
    table.uuid('user_id').unsigned().notNullable();
    table.boolean('is_accepted').defaultTo(false);
    table.string('review', 1000);
    table.dateTime('completed_at');
    table.timestamps(true, true);

    table.foreign('project_id').references('id').inTable('projects')
      .onDelete('cascade').onUpdate('cascade');
    table.foreign('user_id').references('id').inTable('users')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('projects_users');
}
