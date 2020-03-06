import config from './config';
import path from 'path';

const { db } = config;

export default {
  development: {
    client: db.client,
    connection: {
      host: db.host,
      port: db.port,
      database: db.database,
      user: db.user,
      password: db.password,
    },
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(path.join(__dirname, 'database/migrations')),
    },
    seeds: {
      directory: path.resolve(path.join(__dirname, 'database/seeds')),
    },
  },
  test: {
    client: db.client,
    connection: {
      host: db.host,
      port: db.port,
      database: db.database,
      user: db.user,
      password: db.password,
    },
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(path.join(__dirname, 'database/migrations')),
    },
    seeds: {
      directory: path.resolve(path.join(__dirname, 'database/seeds')),
    },
  },
};
