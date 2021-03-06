const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer')

const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use("/peerjs", peerServer)

app.get('/', (req, res)=>{
  res.render('home')
})

app.get('/End', (req,res) =>{
  res.render('End')
})

app.get('/room', (req, res) => {
   res.redirect(`/room/${uuidV4()}`)
})

app.get('/room/:room', (req, res) => {
  res.render('room', { 
    roomId: req.params.room
   })
})

//socket connection

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3000)