import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false },
});


export const connectDB = async () => {
  try {
    await pool.promise().query("SELECT 1"); 
    console.log(" DB Connected");
  } catch (err) {
    console.error(" DB Connection Failed:", err.message);
    throw err;
  }
};

export default pool;