const pool = require('./pool')

async function insertPlayer(username, server)
{
      await pool.query('INSERT INTO players (username, server) VALUES ($1, $2)', [username, server])
    
}

async function getPlayers(){
    const { rows } = await pool.query(`SELECT username, STRING_AGG(server,', ') AS servers FROM players GROUP BY username`)
    return rows
}
async function getUsernames(){
    const { rows } = await pool.query('SELECT username FROM players')
    return rows
}
async function getServers(username){
    const { rows } = await pool.query('SELECT server FROM players WHERE username = ($1)', [username])
    return rows
}
module.exports = {
    insertPlayer,
    getPlayers
}