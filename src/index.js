const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))

io.on('connection', socket => {
    console.log('New WebSocket connection!')

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', message => {
        io.emit('message', message)
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Server running on port ${port}!`))
