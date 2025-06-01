import mysql from 'mysql2/promise'; // Assuming you are using mysql2/promise for async/await

// Declare the pool variable at the module level
let pool: mysql.Pool | undefined; // Initialize it as undefined, or null

export function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE_DB,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } catch (err: any) { // Add type annotation for err
      console.error("Erreur de connexion MySQL :", err.message);
      throw err;
    }
  }
  return pool;
}