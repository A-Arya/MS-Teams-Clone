const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

var peer = new Peer(undefined)


// var peer = new Peer(undefined, {
//   path: '/peerjs',
//   host: '/',
//   port: '443'
// })


const peers = {}
let myVideoStream
// if(audio_preview || video_preview){
  navigator.mediaDevices.getUserMedia({
    video: true, //video_preview,
    audio: true //audio_preview
  })
  .then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
      call.answer(stream)
      console.log("answered")
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

  socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    })
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

// }

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser (userId, stream) {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log("connecttonewuser")
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream (video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    console.log("added")
  })
  videoGrid.append(video)
}

let text = $('input');

// when press enter send message
$('html').on('keypress', function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val())
    socket.emit('message', text.val());
    text.val('')
  }
});

socket.on('createMessage', message => {
  console.log('from server chat')
  $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  scrollToBottom()
})


const scrollToBottom = () => {
  var d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}



