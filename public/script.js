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

//getting audio and video of the user

  navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true 
  })
  .then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    //answering a call when a video stream is recieved

    peer.on('call', call => {
      call.answer(stream)
      console.log("answered")
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

  //making a socket connection on event user-connected
  socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
    })
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })



peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

//when a new user connects, his/her video stream is shown on the screen

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

//adds the video stream to the screen

function addVideoStream (video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
    console.log("added")
  })
  videoGrid.append(video)
}

//chat

let text = $('input');

// when press enter send message
$('html').on('keypress', function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val())
    socket.emit('message', text.val());
    text.val('')
  }
});

//sending a message

socket.on('createMessage', message => {
  console.log('from server chat')
  $("ul").append(`<li class="message"><b>USER</b><br/>${message}</li>`);
  scrollToBottom()
})

//scroll to bottom of the chat

const scrollToBottom = () => {
  var d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

//Audio video settings

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    console.log("audio false")
    audio_preview = false;
    setUnmuteButton();
  }
  else {
    audio_preview = true;
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    video_preview = false;
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
    
  }
  else {
    video_preview = true;
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

//sets the mute button

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

//sets the unmute button

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

//sets the video off button

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}


//sets the video on button
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}