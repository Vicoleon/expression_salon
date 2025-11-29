import mysql from "mysql2/promise";

async function createDb() {
    try {
        const connection = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "", // Assuming no password based on previous success
        });

        await connection.query("CREATE DATABASE IF NOT EXISTS expression_salon");
        console.log("Database 'expression_salon' created or already exists.");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("Failed to create database:", error);
        process.exit(1);
    }
}

createDb();
