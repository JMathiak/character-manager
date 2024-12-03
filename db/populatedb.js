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
CREATE TABLE IF NOT EXISTS characters (
Characterid int NOT NULL AUTO_INCREMENT PRIMARY KEY,
Charactername VARCHAR(12),
PlayerId SMALLINT,
Job VARCHAR(30),
Level SMALLINT,
CombatPower INT,
Server VARCHAR(8)
)
`;

const SQLPlayers = `
CREATE TABLE IF NOT EXISTS players (
Playerid int NOT NULL,
Username VARCHAR(15),
Server VARCHAR(8),
PRIMARY KEY(Playerid, Server)
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

  /*
--> Not auto increment, generate unique random number 1 to 1m
insert that to player table 

SELECT Playerid from players
iterate 

  */