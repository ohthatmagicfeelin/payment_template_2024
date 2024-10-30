// db/index.js
import pg from 'pg';
import config from '../config/env.js';

const { Pool } = pg;

const pool = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DATABASE,
  password: config.PG_PASSWORD,
  port: config.PG_PORT
});

// You can also set the timezone for all sessions:
pool.on('connect', (client) => {
  client.query('SET timezone = "UTC";');
});


export default pool;