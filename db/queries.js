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

async function getCharacterCountByServer(playerName, server)
{
    const { rows } = await pool.query(`SELECT COUNT(*) FROM characters WHERE player = ($1) AND server = ($2)`, [playerName, server])
    return rows
}

async function updatePlayerName(oldName, newName)
{
    await pool.query(`UPDATE players SET username = ($1) WHERE username = ($2)`, [newName, oldName])
    await pool.query(`UPDATE characters SET player = ($1) WHERE player = ($2)`, [newName, oldName])
}

async function removeServerForPlayer(playerName, server)
{
    await pool.query(`DELETE FROM players WHERE username = ($1) AND server = ($2) `, [playerName, server])
}

async function getCharacters(){
    const { rows } = await pool.query(`SELECT * FROM characters`)
    return rows
    
}
module.exports = {
    insertPlayer,
    getPlayers,
    getUsernames,
    getServers,
    insertCharacter,
    getPlayer,
    getCharacterCountByServer,
    updatePlayerName,
    removeServerForPlayer,
    getCharacters
}