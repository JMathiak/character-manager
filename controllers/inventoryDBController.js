const db = require("../db/queries")
const {body, validationResult } = require('express-validator')
let jobs = [	"Hero", "Dark Knight", "Paladin", "Bishop", "Arch Mage (Fire & Poison)", "Arch Mage (Ice & Lightning)", "Night Lord", "Shadower", "Bowmaster", "Marksman", "Buccaneer", "Corsair", "Blade Master", "Cannon Master", 
    "Mechanic", "Battle Mage", "Demon Slayer", "Demon Avenger", "Wild Hunter", "Xenon", "Blaster", "Mercedes", "Aran", "Phantom", "Luminous", "Evan", "Shade", "Kanna", "Hayato", "Angelic Buster", "Kaiser", "Cadena", "Kain", "Ark", "Illium", "Adele", "Khali", 
    "Hoyoung", "Lara", "Lynn", "Zero", "Kinesis"]
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


async function getPlayersAndServers(req, res){
    let rows = await db.getPlayers()
    rows.forEach(player => {
        let serverArr = player.servers.split(",")
        console.log(serverArr)
        player.servers = serverArr
    })
    console.log(rows)
    res.render('./players',{
        title: "Player List",
        players: rows,
        route: '/edit',
        routeText: 'Edit Player'
    })
}

async function getPlayers(req, res){
    let rows = await db.getPlayers()
    rows.forEach(player => {
        let serverArr = player.servers.split(",")
        console.log(serverArr)
        player.servers = serverArr
    })
    res.render('players',{
        title: 'Create Char - Player Select',
        players:rows,
        route: "/createCharacter",
        routeText: 'Create Character For'
    })

}

async function postCharacterForm(req, res){
    let playerName = req.params.playerName
    let servers = await db.getServers(playerName)
    console.log(servers)
    res.render('characterForm', {playerName: playerName, servers: servers, jobs: jobs})
}

const validateCharacter = [
    body('charName').trim()
    .isLength({min: 4, max: 15}).withMessage(``),
    body('level').trim()
    .isNumeric
]
module.exports = {
    getHome,
    createPlayer,
    getPlayersAndServers,
    getPlayers,
    postCharacterForm

}