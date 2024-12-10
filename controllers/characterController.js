const db = require("../db/queries")
const {body, validationResult } = require('express-validator')

let jobs = [	"Hero", "Dark Knight", "Paladin", "Bishop", "Arch Mage (Fire & Poison)", "Arch Mage (Ice & Lightning)", "Night Lord", "Shadower", "Bowmaster", "Marksman", "Pathfinder" ,"Buccaneer", "Corsair", "Blade Master", "Cannon Master", 
    "Mechanic", "Battle Mage", "Demon Slayer", "Demon Avenger", "Wild Hunter", "Xenon", "Blaster", "Mercedes", "Aran", "Phantom", "Luminous", "Evan", "Shade", "Kanna", "Hayato", "Angelic Buster", "Kaiser", "Cadena", "Kain", "Ark", "Illium", "Adele", "Khali", 
    "Hoyoung", "Lara", "Lynn", "Zero", "Kinesis", "Dawn Warrior", "Night Walker", "Wind Archer", "Blaze Wizard", "Thunder Breaker"]
let servers = ["Kronos", "Hyperion", "Bera", "Scania", "Aurora", "Elysium"]



async function postCharacterForm(req, res){
    let playerName = req.params.playerName
    let servers = await db.getServers(playerName)
    console.log(servers)
    res.render('characterForm', {playerName: playerName, servers: servers, jobs: jobs})
}


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
        let playerIdRow = await db.getPlayerId(req.params.playerName)
        let playerId = playerIdRow[0].playerid
        console.log(playerId)
        await db.insertCharacter(req.body, playerId)
        res.render("successAdded",{
            contentAdded: "Character",
            playerName: req.params.playerName,
            route: "createCharacter",
            viewContent: "viewCharacters"
        })
  
        
        
}

async function getCharacterList(req, res)
{
  
        let rows = await db.getCharacters()
        console.log(rows)
  
   
    res.render("characterList",{
        title: 'All Characters',
        characters: rows
    })
    
       
    
        
}



async function editCharacter(req, res){
    let character = await db.getCharacter(req.params.characterName)
    /*
rows [
  {
    charactername: 'Safalin',
    player: 'Shua',
    job: 'Buccaneer',        
    level: 285,
    combatpower: 200000000,  
    server: 'Kronos'
  }
]

    */
    let char = character[0]
    let serverObjArr = await db.getServers(char.player)
    let servers = []
    serverObjArr.forEach((server)=>{
        servers.push(server.server)
    })
    res.render("editCharacters", {header: "Edit", char: char, playersServers: servers, jobs: jobs })
    
}

async function submitEditCharacter(req, res){
    /*
    {
  charName: 'Safalin',
  server: 'Kronos',
  jobs: 'Buccaneer',
  level: '285',
  combatPower: '200000000'
}
    */
    let originalName = req.params.characterName
    let originalCharacter = await db.getCharacter(originalName)
    let edits = req.body

}


module.exports = {
    postCharacterForm,
    createCharacter,
    getCharacterList,
    editCharacter, submitEditCharacter

}