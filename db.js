const pg = require('pg');
const { Pool } = require('pg');

const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'projetoreact',
  password: 'paprica13',
  port: 5432,
});

const clientPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'projetoreact',
  password: 'paprica13',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

module.exports = clientPool;
module.exports = client;
