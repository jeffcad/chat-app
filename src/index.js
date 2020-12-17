const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const Filter = require('bad-words')

app.use(express.static('public'))

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Server running on port ${port}!`))

io.on('connection', socket => {
    console.log('New WebSocket connection!')

    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const { latitude, longitude } = location
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})