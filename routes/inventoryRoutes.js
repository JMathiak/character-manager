const { Router } = require('express')
const invDBController = require("../controllers/inventoryDBController.js")
const {body, validationResult } = require('express-validator')
const invRouter = Router()
const db = require("../db/queries")
let servers = ["Kronos", "Hyperion", "Bera", "Scania", "Aurora", "Elysium"]
const lengthErr = "must be between 4 and 15 characters"
const numericErr = 'must be a number'
const levelRangeErr = 'must be between 1 and 300 (inclusive)'
const bigIntErr = 'must be between 0 and 2,147,483,647'
const validateCharacter = [
    body('charName').trim()
    .isLength({min: 4, max: 15}).withMessage(`Character name ${lengthErr}`),
    body('charName').trim()
    .custom(async value => {
        const character = await db.getCharacter(value)
        console.log('validator', character)
        if(character.length > 0){
            throw new Error('A character with the name ' + value + ' already exists')
        }
    }),
    body('level').trim()
    .isNumeric().withMessage(`Character level ${numericErr}`)
    .isInt({min: 1, max: 300}).withMessage(`Character level ${levelRangeErr}`),
    body('combatPower').trim()
    .isNumeric().withMessage(`Combat power ${numericErr}`)
    .isInt({min: 0, max: 2147483647 }).withMessage(`Combat power ${bigIntErr}`)
]

const validatePlayer = [
    body('username').trim()
    .isLength({min: 4, max: 15}).withMessage(`Username ${lengthErr}`)
    .custom(async value =>{
        const player = await db.getPlayerByName(value)
        if(player.length > 0)
        {
            throw new Error('A player with the name ' + value + ' already exists')
        }
    })
]

invRouter.get("/", invDBController.getHome)
invRouter.get("/players", invDBController.getPlayersAndServers)
// invRouter.get("/characters",)
invRouter.get("/createPlayer", (req, res)=>{
    res.render("playerForm", {header: "Add a new", serverArr: servers, action:"createPlayer"})
})
invRouter.post("/createPlayer", [validatePlayer] ,invDBController.createPlayer)
invRouter.get("/createCharacter/selectPlayer", invDBController.getPlayers)
invRouter.get("/:playerName/createCharacter", invDBController.postCharacterForm)
invRouter.post("/:playerName/createCharacter", [validateCharacter], invDBController.createCharacter)
invRouter.get("/:playerName/edit", invDBController.editPlayer)
invRouter.post("/:playerName/edit", [validatePlayer] ,invDBController.submitEditPlayer)
invRouter.get("/viewCharacters", invDBController.getCharacterList)
// invRouter.get("/:playerName/delete",)
// invRouter.get("/:playerName/:characterName/edit",)
// invRouter.post("/:playerName/:characterName/edit",)
// invRouter.get("/:playerName/:characterName/delete",)
// invRouter.get("/search",)




module.exports = invRouter;


//Edit flow
/*
Og player gets updated in controller file
New player name != exisiting player name
If body.name doesn't change -> ? 

If error array is not empty -> length could be messed up, duplicate username could exist
Condition to render errors -> error array not empty && edit username is a new username
If edited username same as param -> same user, OK
if edited username not same as param -> user hasnt changed, new username, OK if new usernamne DNE otherwise NOT OK
*/