import React from 'react'
import {useEffect, useState,useRef} from 'react';
export default function Camera() {
  const [videoDem, handleVideoDem] = useState({w:0, h:0})
  const [cameraFacingMode, handleCameraFacingMode] = useState('environment')
  const [imageData, setImageData] = useState('');
  const mimeType = "video/webm";
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  let video;
  useEffect(()=>{
    try{
        //find video and canvas elements by tagNames
        video = document.getElementsByTagName('video')[0];
        let constraint = {
            video:{
                width:{ideal:'100%'},
                height:{ideal:500},
                facingMode:cameraFacingMode
            },
            audio:false
        }
        navigator.mediaDevices.getUserMedia(constraint).then((stream)=>{
          console.log(stream);
          setStream(stream);
            video.setAttribute("playsinline", "true");
            video.srcObject = stream;
            video.onloadedmetadata = ()=>{
                let {clientLeft, clientTop, videoWidth, videoHeight} = video
                handleVideoDem({w:videoWidth, h:videoHeight})
                video.play();
            }
        }).catch((e)=>{
            console.log(e);
            alert(e)
        })
    }catch(e){
        alert('error1: '+ e);
        console.log(e);
    }
},[cameraFacingMode]);
const startRecording = async () => {
  setRecordingStatus("recording");
  const media = new MediaRecorder(stream, { mimeType });
  mediaRecorder.current = media;
  mediaRecorder.current.start();
  let localVideoChunks = [];
  mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
  };
  setVideoChunks(localVideoChunks);
};
const stopRecording = () => {
  video = document.getElementsByTagName('video')[0];
  setPermission(false);
  setRecordingStatus("inactive");
  mediaRecorder.current.stop();
  mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
      video.pause()
  };
  console.log(recordingStatus);
  
};
const handleFileSelect =(event)=>{
const files = Array.from(event.target.files)
console.log("files:", files)
const ImageBlob = new Blob(Array.from(files), {type: files[0].type});
const ImageUrl = URL.createObjectURL(ImageBlob);
setImageData(ImageUrl)
}
  return (
    <>
      <video src=""></video>
      <div className="Btns">
      {  recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
                Start Recording
            </button>
            ) : null}
               {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button">
                Stop Recording
            </button>
            ) : null}
 {recordedVideo ? (
<a download href={recordedVideo}>
        Download Recording
     </a>
 ):''}
  {imageData ? (
<a download href={imageData}>
        Download image
     </a>
 ):''}
<input type="file" name="file" id="file" className="inputfile" accept="image/*" 
onChange={(event)=>handleFileSelect(event)}/>
<label htmlFor="file">upload your photo</label>
      </div>
  

    </>
  )
}
