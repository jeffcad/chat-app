const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Server running on port ${port}!`))

io.on('connection', socket => {
    console.log('New WebSocket connection!')

    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', message => {
        io.emit('message', message)
    })

    socket.on('sendLocation', location => {
        const { latitude, longitude } = location
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})