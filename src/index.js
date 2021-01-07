// require stuff
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express() // setup express
const server = http.createServer(app)
const io = socketio(server) // causes server to support web sockets

const port = process.env.PORT || 3000 // setup port variable

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))


// handle socket interaction
io.on('connection', (socket) => {
    console.log('New websocket connection.')

    socket.emit('message', "Welcome!") // sends message to single connection
    socket.broadcast.emit('message', 'A new user has joined!') // sends message to everyone except for the new connection

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }

        io.emit('message', message) // this allows us to update all clients connected to the site
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', `<a href="https://www.google.com/maps?q=${location.latitude},${location.longitude}">My Location</a>`) // this allows us to update all clients connected to the site
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user disconnected.')
    })
})

app.get('/', (req, res) => {
    res.render(publicPath + 'index.html')
})

// server
server.listen(port, () => {
    console.log('server is up on port.' + port)
})