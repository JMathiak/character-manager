const { Router } = require('express')
const invDBController = require("../controllers/inventoryDBController.js")

const invRouter = Router()
let servers = ["Kronos", "Hyperion", "Bera", "Scania", "Aurora", "Elysium"]

invRouter.get("/", invDBController.getHome)
invRouter.get("/players", invDBController.getPlayers)
// invRouter.get("/characters",)
invRouter.get("/createPlayer", (req, res)=>{
    res.render("playerForm", {serverArr: servers})
})
invRouter.post("/createPlayer", invDBController.createPlayer)
// invRouter.get("/createCharacter",)
// invRouter.post("/createCharacter",)
// invRouter.get("/:playerName/edit",)
// invRouter.post("/:playerName/edit",)
// invRouter.get("/:playerName/delete",)
// invRouter.get("/:playerName/:characterName/edit",)
// invRouter.post("/:playerName/:characterName/edit",)
// invRouter.get("/:playerName/:characterName/delete",)
// invRouter.get("/search",)




module.exports = invRouter;