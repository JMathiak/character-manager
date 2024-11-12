const db = require("../db/queries")
const {body, validationResult } = require('express-validator')
// const { route } = require("../routes/inventoryRoutes")
let jobs = [	"Hero", "Dark Knight", "Paladin", "Bishop", "Arch Mage (Fire & Poison)", "Arch Mage (Ice & Lightning)", "Night Lord", "Shadower", "Bowmaster", "Marksman", "Buccaneer", "Corsair", "Blade Master", "Cannon Master", 
    "Mechanic", "Battle Mage", "Demon Slayer", "Demon Avenger", "Wild Hunter", "Xenon", "Blaster", "Mercedes", "Aran", "Phantom", "Luminous", "Evan", "Shade", "Kanna", "Hayato", "Angelic Buster", "Kaiser", "Cadena", "Kain", "Ark", "Illium", "Adele", "Khali", 
    "Hoyoung", "Lara", "Lynn", "Zero", "Kinesis"]
let servers = ["Kronos", "Hyperion", "Bera", "Scania", "Aurora", "Elysium"]
function getHome(req, res){
    res.render('index')
}

async function createPlayer(req, res){
    let username = req.body.username
    let servers  = req.body.server
    for(const server of servers){
        await db.insertPlayer(username, server)
    }
    res.render("successAdded",{
        contentAdded: "Player",
        playerName: req.params.playerName,
        route: "/createPlayer"
    })

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

const lengthErr = "must be between 4 and 15 characters"
const numericErr = 'must be a number'
const levelRangeErr = 'must be between 1 and 300 (inclusive)'
const bigIntErr = 'must be between 0 and 2,147,483,647'
const validateCharacter = [
    body('charName').trim()
    .isLength({min: 4, max: 15}).withMessage(`Character name ${lengthErr}`),
    body('level').trim()
    .isNumeric().withMessage(`Character level ${numericErr}`)
    .isInt({min: 1, max: 300}).withMessage(`Character level ${levelRangeErr}`),
    body('combatPower').trim()
    .isNumeric().withMessage(`Combat power ${numericErr}`)
    .isInt({min: 0, max: 2147483647 }).withMessage(`Combat power ${bigIntErr}`)
]

async function createCharacter (req, res){
    const errors = validationResult(req)
        if(!errors.isEmpty()){
            let servers = await db.getServers(req.params.playerName)
            return res.status(400).render('characterForm',{
                title: "Create Character",
                errors: errors.array(),
                playerName: req.params.playerName,
                servers: servers,
                jobs: jobs,
            })
        }
        console.log(req.body, req.params)
        await db.insertCharacter(req.body, req.params.playerName)
        res.render("successAdded",{
            contentAdded: "Character",
            playerName: req.params.playerName,
            route: req.params/playerName + "/createCharacter"
        })
}

async function editPlayer(req, res){
    let player = await db.getPlayer(req.params.playerName)
    let serverArr = player[0].servers.split(", ")
    res.render("playerForm", {header: "Edit", playerName: player[0].username, playerServers: serverArr, serverArr: servers, action: player[0].username + "/edit"})
    
}

async function submitEditPlayer(req, res){
    let playerName = req.params.playerName
    let edits = req.body
    console.log(req.body)
}
// const createCharacter = async [validateCharacter, (req, res) =>{
//     const errors = validationResult(req)
//         if(!errors.isEmpty()){
//             return res.status(400).render('characterForm',{
//                 title: "Create Character",
//                 errors: errors.array()
//             })
//         }
//         console.log(req.body)
// }]

module.exports = {
    getHome,
    createPlayer,
    getPlayersAndServers,
    getPlayers,
    postCharacterForm,
    createCharacter, validateCharacter,
    editPlayer, submitEditPlayer

}