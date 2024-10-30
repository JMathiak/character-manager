

function getHome(req, res){
    res.render('index')
}

function createPlayer(req, res){
    let username = req.body.username
    let servers  = req.body.server
    console.log(username, servers)
    res.redirect('/')

}


module.exports = {
    getHome,
    createPlayer
}