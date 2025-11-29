import mysql from "mysql2/promise";
import "dotenv/config";

async function checkTables() {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL!);
        const [rows] = await connection.query("SHOW TABLES");
        console.log("Tables in database:", rows);
        await connection.end();
    } catch (error) {
        console.error("Error checking tables:", error);
    }
}

checkTables();
