const express = require('express')
const app = express()
const invRouter = require('./routes/inventoryRoutes.js')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use("/", invRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Express is now listening on port ${PORT}`))