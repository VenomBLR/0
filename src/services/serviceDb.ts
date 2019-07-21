import { Pool } from 'pg';

const pool = new Pool({
    database: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    user: 'postgres',
});

export function closePool() {
    pool.end().then(() => console.log('Pool has ended'));
}

export default pool;