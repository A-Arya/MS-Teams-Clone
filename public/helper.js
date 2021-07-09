// var audio_preview = true;
// var video_preview = true;

// if (isConnected === false){
  
// }

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      console.log("audio false")
      // audio_preview = false;
      setUnmuteButton();
    }
    else {
      // audio_preview = true;
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      // video_preview = false;
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
      // setBackground()
    }
    else {
      // video_preview = true;
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
    `
    document.querySelector('.main_video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    `
    // const video_off = `
    // <p style="background-color="white">your video is off</p>
    // `
    // document.querySelector('.Video-grid').innerHTML = video_off;
    document.querySelector('.main_video_button').innerHTML = html;
  }

  // const setBackground = () =>{
  //   const video_off = `
  //   <p style="background-color="white">your video is off</p>
  //    `
  //   document.querySelector('.video-grid').innerHTML = video_off;
  // }


