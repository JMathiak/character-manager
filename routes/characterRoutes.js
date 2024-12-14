const { Router } = require('express')
const characterController = require('../controllers/characterController.js')
const { body, validationResult} = require('express-validator')
const db = require("../db/queries")
const charRouter = Router()

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


charRouter.get("/create", characterController.getPlayers)
charRouter.get("/create/:playerId", characterController.postCharacterForm)
charRouter.post("/create/:playerId", [validateCharacter] ,characterController.createCharacter)
charRouter.get("/list", characterController.getCharacterList)
charRouter.get("/edit/:charId",)
charRouter.post("/edit/:charId",)

module.exports = charRouter;
/*
/character/create <-- Get rid of player select menu and implement a select box for it. Implement a login system eventually and get rid of it altogether
|> /character/create/:playerId
/character/edit/:id
/character/list
/character/edit/:charId



*/