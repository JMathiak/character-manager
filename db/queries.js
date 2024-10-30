const pool = require('./pool')

async function insertPlayer(username, server)
{
      await pool.query('INSERT INTO players (username, server) VALUES ($1, $2)', [username, server])
    
}

module.exports = {
    insertPlayer
}