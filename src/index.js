// require stuff
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express() // setup express
const server = http.createServer(app)
const io = socketio(server) // causes server to support web sockets

const port = process.env.PORT || 3000 // setup port variable

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', () => {
    console.log('New websocket connection.')
})

app.get('/', (req, res) => {
    res.render(publicPath + 'index.html')
})

// server
server.listen(port, () => {
    console.log('server is up on port.' + port)
})