import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('users', (table) => {
		table.string('id').notNullable();
		table.string('first_name',100).notNullable();
		table.string('last_name', 100).notNullable();
		table.string('email', 255).unique().notNullable();
		table.string('phone', 20);
		table.string('position', 100);
		table.string('avatar', 255);
		table.string('password', 255).notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists('users');
}
