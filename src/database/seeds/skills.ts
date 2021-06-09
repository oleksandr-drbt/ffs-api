import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  return knex('skills').insert([
    {
      name: 'JavaScript',
    },
    {
      name: 'React',
    },
    {
      name: 'Vue',
    },
    {
      name: 'Node.js',
    },
    {
      name: 'PostgreSQL',
    },
    {
      name: 'MySQL',
    },
    {
      name: 'Docker',
    },
    {
      name: 'HTML',
    },
    {
      name: 'CSS',
    },
    {
      name: 'SASS/SCSS',
    },
  ]);
}
