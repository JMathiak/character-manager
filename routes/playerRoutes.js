const { Router } = require('express')
const playerController = require("../controllers/playerController.js")
const { body, validationResult} = require('express-validator')



const playerRouter = Router()
const lengthErr = "must be between 4 and 15 characters"
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




playerRouter.get("/:deletedPlayer?", playerController.getPlayersAndServers)
playerRouter.get("/create", [validatePlayer] ,(req, res)=>{
    res.render("playerForm", {header: "Add a new", serverArr: servers, action:"createPlayer"})
})
playerRouter.get("/edit/:id", playerController.editPlayer)
playerRouter.post("/edit/:id", [validatePlayer] ,playerController.submitEditPlayer)
playerRouter.post("/delete/:id", playerController.deletePlayer)

module.exports = playerRouter;