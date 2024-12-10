const db = require("../db/queries")
const {body, validationResult } = require('express-validator')
// const { route } = require("../routes/inventoryRoutes")
let jobs = [	"Hero", "Dark Knight", "Paladin", "Bishop", "Arch Mage (Fire & Poison)", "Arch Mage (Ice & Lightning)", "Night Lord", "Shadower", "Bowmaster", "Marksman", "Pathfinder" ,"Buccaneer", "Corsair", "Blade Master", "Cannon Master", 
    "Mechanic", "Battle Mage", "Demon Slayer", "Demon Avenger", "Wild Hunter", "Xenon", "Blaster", "Mercedes", "Aran", "Phantom", "Luminous", "Evan", "Shade", "Kanna", "Hayato", "Angelic Buster", "Kaiser", "Cadena", "Kain", "Ark", "Illium", "Adele", "Khali", 
    "Hoyoung", "Lara", "Lynn", "Zero", "Kinesis", "Dawn Warrior", "Night Walker", "Wind Archer", "Blaze Wizard", "Thunder Breaker"]
let servers = ["Kronos", "Hyperion", "Bera", "Scania", "Aurora", "Elysium"]
async function getHome(req, res){

    console.log(await db.getLastPlayerId())
    res.render('index')
    
}

async function createPlayer(req, res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        
        return res.status(400).render('playerForm',{
            header: 'Add a new',
            errors: errors.array(),
            serverArr: servers, 
            action:"createPlayer"
        })
    }
    //let servers = await db.getServers(req.params.playerName)
    let maxIdRow = await db.getLastPlayerId()
    let playerId = 1
    if(maxIdRow[0].max != null)
    {
        playerId = maxIdRow[0].max + 1;
    }
    let username = req.body.username
    let userServers  = []
    if(typeof req.body.server  === 'string' || req.body.server instanceof String)
        {
            userServers.push(req.body.server)
        }else if(typeof req.body.server === 'array' || req.body.server instanceof Array )
        {
            req.body.server.forEach(server => {
                userServers.push(server)
            })
        }
    console.log(userServers)
        for(const server of userServers){
            await db.insertPlayer(playerId, username, server)
        }
  
   
    
    res.render("successAdded",{
        contentAdded: "Player",
        playerName: req.params.playerName,
        route: "/createPlayer",
        viewContent: "players"
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
        routeText: 'Edit Player',
        delete: true,
        deletedPlayer: req.params.deletedPlayer
    })
}

async function getPlayers(req, res){
    let rows = await db.getPlayers()
    console.log('Players', rows)
    rows.forEach(player => {
        let serverArr = player.servers.split(",")
        console.log(serverArr)
        player.servers = serverArr
    })
    res.render('players',{
        title: 'Create Char - Player Select',
        players:rows,
        route: "/createCharacter",
        routeText: 'Create Character For',
        delete: false
    })

}


async function editPlayer(req, res){
    let player = await db.getPlayer(req.params.playerName)
    let serverArr = player[0].servers.split(", ")
    let serverCharacters = {}
    for (const server of serverArr)
    {
        let count = await db.getCharacterCountByServer(req.params.playerName, server)
        console.log(count)
        serverCharacters[server] = parseInt(count[0].count)
    }
    res.render("playerForm", {header: "Edit", playerName: player[0].username, playerServers: serverCharacters, serverArr: servers, action: player[0].username + "/edit"})
    
}

async function submitEditPlayer(req, res){
    //Get player before changes
    // Compare name + servers
    // If new server is not in old servers add new server
    // If old server is not in new servers remove entries for old servers
    // If new name differs from old name update entries for old name in servers + characters
    // What to do if server is removed where they own a character?
    // !! only let them remove servers where they have no characters
    let errors = validationResult(req)
    let edits = req.body
    let playerName = req.params.playerName
    let player = await db.getPlayer(playerName)
    let oldServers = player[0].servers.split(", ")
    console.log('Old', oldServers)
    let newServers = []
    let serverCharacters = {}
    for (const server of oldServers)
        {
            let count = await db.getCharacterCountByServer(req.params.playerName, server)
            serverCharacters[server] = parseInt(count[0].count)
            if(parseInt(count[0].count) > 0)
            {
                newServers.push(server)
            }
            
        }
        //There is an error, param name (current acc) != edited name
        //Validator will check if new name is taken and if name is valid?
    if(!errors.isEmpty() && edits.username !== playerName){
        console.log(servers)
        console.log(oldServers)
        return res.status(400).render('playerForm',{
            header: "Edit",
            errors: errors.array(),
            playerName: player[0].username, 
            playerServers: serverCharacters, 
            serverArr: servers, 
            action: player[0].username + "/edit"})
        }
    

            
    
    if(typeof edits.server === 'string' || edits.server instanceof String)
    {
        newServers.push(edits.server)
    }else if(typeof edits.server === 'array' || edits.server instanceof Array )
    {
        edits.server.forEach(server => {
            newServers.push(server)
        })
    }
    console.log('New Servers', newServers, 'Edits', edits)
    if(edits.username != playerName)
    {
        await db.updatePlayerName(playerName, edits.username)
    }
    if(newServers.length > 0){
    for(const server of newServers)
    {
        if(!oldServers.includes(server))
        {
            await db.insertPlayer(playerName, server)
        }
    }}else if(newServers.length == 0){
        for(const server of oldServers)
        {
            await db.removeServerForPlayer(playerName, server)
        }
    }
    console.log('Old Servers', oldServers, 'New Servers', newServers)
    for(const server of oldServers)
    {
        if(!newServers.includes(server))
        {
            await db.removeServerForPlayer(playerName, server)
        }
    }

    res.redirect("/")
}



async function deletePlayer(req, res)
{

        let playerName = req.params.playerName
        let playerId = await db.getPlayerId(playerName)
        let pID = playerId[0].playerid
        await db.deletePlayer(pID)
   
    //  //Do I want to create a deletion success page that can be used for characters? And an edit success page?  
     res.render("changeSuccess",{
        change: "Delete",
        objectOfInterest: playerName,
        // route: req.params.playerName + "/createCharacter",
        viewContent: "players",
        prevContent: "Players"
    })
}





module.exports = {
    getHome,
    createPlayer,
    getPlayersAndServers,
    getPlayers,
    editPlayer, submitEditPlayer,
    deletePlayer
}