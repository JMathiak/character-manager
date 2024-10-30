const db = require("../db/queries")

function getHome(req, res){
    res.render('index')
}

async function createPlayer(req, res){
    let username = req.body.username
    let servers  = req.body.server
    for(const server of servers){
        await db.insertPlayer(username, server)
    }
    res.redirect('/')

}


module.exports = {
    getHome,
    createPlayer
}