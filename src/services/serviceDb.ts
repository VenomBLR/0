import { Pool } from 'pg';

const pool = new Pool({
    database: 'postgres',
    host: process.env.INVENTORY_URL || 'localhost',
    password: process.env.INVENTORY_PASSWORD || 'postgres',
    port: 5432,
    user: process.env.INVENTORY_USER || 'postgres',
});

export function closePool() {
    pool.end().then(() => console.log('Pool has ended'));
}

export default pool;