const { Client } = require('pg');

// const SQL = `
// CREATE TABLE IF NOT EXISTS usernames (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   username VARCHAR ( 255 )
// );

// INSERT INTO usernames (username) 
// VALUES
//   ('Bryan'),
//   ('Odin'),
//   ('Damon');
// `;

const SQL = `
CREATE TABLE IF NOT EXISTS players (
characterName VARCHAR(12) PRIMARY KEY,
player VARCHAR(15),
job VARCHAR(30),
level SMALLINT,
combatPower INT,
server VARCHAR(8)
)
`;

const SQLPlayers = `
CREATE TABLE IF NOT EXISTS players (
username VARCHAR(15),
server VARCHAR(8),
PRIMARY KEY(username, server)
)
`;

const SQLServers = `
CREATE TABLE IF NOT EXISTS servers (
serverName VARCHAR(8),
serverType VARCHAR(11))`



async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: "postgresql://jmathiak:EverUpward44@localhost:5432/inventory_manager",
    });
    await client.connect();
    await client.query(SQLServers);
    await client.end();
    console.log("done");
  }
  
  main();