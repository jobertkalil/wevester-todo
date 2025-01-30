require("dotenv").config();
const { Client } = require("pg");

async function ensureDatabaseExists() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || 5432,
  });

  await client.connect();

  // Check if database exists
  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
  );

  if (res.rowCount === 0) {
    console.log(`Database "${process.env.DB_NAME}" not found. Creating...`);
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database "${process.env.DB_NAME}" created successfully!`);
  } else {
    console.log(`Database "${process.env.DB_NAME}" already exists.`);
  }

  await client.end();
}

module.exports = (async () => {
  await ensureDatabaseExists();

  return {
    development: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "wevester_todo",
        port: process.env.DB_PORT || 5432,
      },
      migrations: {
        directory: "./migrations",
      },
      seeds: {
        directory: "./seeds",
      },
    },
  };
})();
