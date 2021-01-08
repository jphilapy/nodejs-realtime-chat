// require stuff
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express() // setup express
const server = http.createServer(app)
const io = socketio(server) // causes server to support web sockets

const port = process.env.PORT || 3000 // setup port variable

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))


// handle socket interaction
io.on('connection', (socket) => {
    console.log('New websocket connection.')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        // sends message to single connection
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`)) // sends message to everyone except for the new connection
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }

        io.to('Center City').emit('message', generateMessage(message)) // this allows us to update all clients connected to the site
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`)) // this allows us to update all clients connected to the site
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user disconnected.'))
    })
})

app.get('/', (req, res) => {
    res.render(publicPath + 'index.html')
})

// server
server.listen(port, () => {
    console.log('server is up on port.' + port)
})

/**
 * NOTE:
 * socket.emit - sends to specific client
 * io.emit - sends to all clients
 * socket.broadcast.emit - sends to all clients except for the one that initiated
 * io.to.emit - sends message to everyone withing a scope (a room for instance)
 * socket.broadcast.to.emit - same as socket.broadcast.emit, except within a limited scope, i.e., a room
 *
 */