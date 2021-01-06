// require stuff
const path = require('path')
const express = require('express')

const app = express() // setup express

const port = process.env.PORT || 3000 // setup port variable

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

app.get('/', (req, res) => {
    res.render(publicPath + 'index.html')
})

// server
app.listen(port, () => {
    console.log('server is up on port.' + port)
})