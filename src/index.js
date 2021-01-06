const express = require('express')

const app = express() // setup express

const port = 3000 // setup port variable


app.get('/', (req, res) => {
    res.send('Chat App')
})

// server
app.listen(port, () => {
    console.log('server is up on port.' + port)
})