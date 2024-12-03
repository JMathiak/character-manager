const pool = require('./pool')

async function getLastPlayerId()
{
    const { rows } = await pool.query(`SELECT max(Playerid) FROM players`)
    console.log('id', rows)
    return rows
}


async function insertPlayer(playerId, username, server)
{
      await pool.query('INSERT INTO players (playerId, username, server) VALUES ($1, $2, $3)', [playerId, username, server])
    
}

async function getPlayers(){
    const { rows } = await pool.query(`SELECT username, STRING_AGG(server,', ') AS servers FROM players GROUP BY username`)
    return rows
}

async function getPlayerId(playerName)
{
    const { rows } = await pool.query(`SELECT DISTINCT PlayerId FROM players WHERE username = ($1)`, [playerName])
    console.log('opla', rows)
    return rows
}
async function getUsernames(){
    const { rows } = await pool.query('SELECT DISTINCT username FROM players')
    return rows
}
async function getServers(username){
    const { rows } = await pool.query('SELECT server FROM players WHERE username = ($1)', [username])
    console.log(rows)
    return rows
}

async function insertCharacter(body, playerId){
   
        await pool.query('INSERT INTO characters (charactername, Playerid, job, level, combatpower, server) VALUES ($1, $2, $3, $4, $5, $6)', [body.charName, playerId, body.jobs, body.level, body.combatPower, body.servers])
       
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

async function getCharacter(charName){
    console.log('HERE')
    const { rows } = await pool.query(`Select * FROM characters WHERE LOWER(charactername) = LOWER(($1))`, [charName])
    console.log('rows', rows)
    return rows
}

async function getPlayerByName(playerName)
{
    const { rows } = await pool.query(`Select * FROM players where LOWER(username) = LOWER($1)`, [playerName])
    return rows
}

async function deletePlayer(playerName)
{
    await pool.query(`DELETE FROM players WHERE username = ($1)`, [playerName])
    await pool.query(`DELETE FROM characters WHERE player = ($1)`, [playerName])
}


module.exports = {
    getLastPlayerId,
    insertPlayer,
    getPlayers,
    getUsernames,
    getServers,
    insertCharacter,
    getPlayer,
    getPlayerId,
    getCharacterCountByServer,
    updatePlayerName,
    removeServerForPlayer,
    getCharacters,
    getCharacter,
    getPlayerByName,
    deletePlayer
}