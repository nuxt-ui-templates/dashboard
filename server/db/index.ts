import mysql from 'mysql2/promise';
import { useRuntimeConfig } from '#imports';

export const getDB = async () => {
  const config = useRuntimeConfig();

  return await mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
};