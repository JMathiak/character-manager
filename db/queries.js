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
    const { rows } = await pool.query('SELECT DISTINCT username FROM players')
    return rows
}
async function getServers(username){
    const { rows } = await pool.query('SELECT server FROM players WHERE username = ($1)', [username])
    return rows
}

async function insertCharacter(body, playerName){
    console.log('Query', body)
    await pool.query('INSERT INTO characters (charactername, player, job, level, combatpower, server) VALUES ($1, $2, $3, $4, $5, $6)', [body.charName, playerName, body.jobs, body.level, body.combatPower, body.servers])
}

async function getPlayer(playerName){
    const { rows } = await pool.query(`SELECT username, STRING_AGG(server,', ') AS servers FROM players WHERE username = ($1) GROUP BY username `, [playerName])
    return rows
}
module.exports = {
    insertPlayer,
    getPlayers,
    getUsernames,
    getServers,
    insertCharacter,
    getPlayer
}