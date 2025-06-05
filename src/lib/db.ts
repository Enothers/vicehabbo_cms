import mysql from 'mysql2/promise';

let pool: mysql.Pool | undefined;

export function getPool(): mysql.Pool {
    if (!pool) {
        try {
            const config = {
                host: process.env.HOST_DB,
                user: process.env.USER_DB,
                password: process.env.PASSWORD_DB,
                database: process.env.DATABASE_DB,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            };
            pool = mysql.createPool(config);
        }
        catch (err: any) {
            console.error("Error MySQL :", err);
            throw (err);
        }
    }
    return (pool);
}