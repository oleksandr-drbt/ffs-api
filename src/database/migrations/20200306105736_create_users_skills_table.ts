import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users_skills', (table) => {
    table.uuid('user_id').notNullable();
    table.integer('skill_id').notNullable();

    table.foreign('user_id').references('id').inTable('users')
      .onDelete('cascade').onUpdate('cascade');
    table.foreign('skill_id').references('id').inTable('skills')
      .onDelete('cascade').onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('users_skills');
}
