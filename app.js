const express = require('express')
const app = express()


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))

const PORT = process.env.PORT || 3000
app.list(PORT, () => console.log(`Express is now listening on port ${PORT}`))