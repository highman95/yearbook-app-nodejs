const { Pool } = require('pg');

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true',
    idleTimeoutMillis: 30000
});

// db.on('connect', () => console.log('Connected to database...'));
db.on('error', (e) => console.error(`Cannot connect to database...${e.message}`));

module.exports = db;
