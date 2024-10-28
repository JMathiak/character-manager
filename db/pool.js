const { Pool } = require('pg')
require('dotenv').config()

module.exports = new Pool({
    host: process.env.LOHOST,
    user: process.env.LOUSER,
    database: process.env.LODBNAME,
    password: process.env.LOPASSWORD,
    port: process.env.DBPORT
})