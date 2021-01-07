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



io.on('connection', (socket) => {
    console.log('New websocket connection.')

    socket.emit('message', "Welcome!")

    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count) // this allows us to update all clients connected to the site
    // })


    socket.on('text', (text) => {
        io.emit('message', text) // this allows us to update all clients connected to the site
    })
})

app.get('/', (req, res) => {
    res.render(publicPath + 'index.html')
})

// server
server.listen(port, () => {
    console.log('server is up on port.' + port)
})