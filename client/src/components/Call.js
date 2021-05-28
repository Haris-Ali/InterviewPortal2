import React, { useEffect, useState, useRef } from 'react';
import socketIOClient from "socket.io-client";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import './Call.css'

import ScriptTag from 'react-script-tag';
import $ from 'jquery'; 
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'

import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import axios from 'axios';
import Loading from './Loading';


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import PhoneIcon from '@material-ui/icons/Phone';
import * as faceapi from 'face-api.js'
import * as hark from 'hark';

const Demo = props => (
  <ScriptTag type="text/javascript" defer src="/client/src/components/face-api.min.js" />
)
const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 60%;
  height: 60%;
`;
 
const useStyles = makeStyles(theme => ({
  custom: {
    height: "200px",
  }
}));

function Call() {
    const classes = useStyles();
    const {id} = useParams();
    const [yourID, setYourID] = useState("");
    const [yourName, setYourName] = useState("")
    const [users, setUsers] = useState({});
    // const users = [{id : 13123123123}, {id: 12312312332}]
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [mute, unMute] = useState(true);
    const [enableVideo, setEnableVideo] = useState(true);
    const [visible, setVisible] = useState ();

    const auth = useSelector(state => state.auth)
    const [open, setOpen] = useState(false);
    const {user, isLogged, isAdmin} = auth
    const dispatch = useDispatch()
    const [meeting, setMeeting] = useState([])
    
    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();
    const videoRef = useRef();
    const canvasRef = useRef();
    const endPoint = 'http://localhost:5000';
    const [loading, setLoading] = useState(true);
    const [secondLoading, setSecondLoading] = useState(true);
    const [gatherEmotion, setGatherEmotion] = useState(true)

    const [candidateEmotion, setCandidateEmotion] = useState([]);
    var scoredEmotions = [];

    var ScoresArrayForMean= [];
    const [candidateScore, setCandidateScore] = useState();
    let history_2 = useHistory();
    var userName;

    const getMeetingApi = async() =>{
      await axios.post("/user/get-meeting-by-meetingId",{meetingId: id}).then((res)=>{
        setMeeting(res.data)
        setLoading(false)
      }).catch((err) => {
        alert(err.response.data.msg)
      });
    }


    const updateMeetingForInterviewerApi = async() =>{
      setLoading(true);
      await axios.post("/user/update-started-meeting-by-meetingId",{meetingId: id}).then((res)=>{
        console.log(res.data.msg)
        setLoading(false)
      }).catch((err) => {
        alert(err.response.data.msg)
      });
    };
    useEffect(()=>{
      setLoading(true);
      getMeetingApi();
    },[])

    useEffect(()=>{
      let refresh = false;
      console.log("Meeting: ",meeting)
      console.log("Loading :", loading)
      console.log("user email",user?.email)
      console.log("Meeting length:", meeting?.length)
      if(meeting !== undefined && meeting.length !==0){
        if(meeting?.started === 0 && user?.role === 1){
          updateMeetingForInterviewerApi();
        }
        if(meeting?.started === 0 && user?.role === 0){
          refresh= true;
          alert("Meeting has not been started by Interviewer")
          history_2.push(`/meetings/candidate-see-meetings-schedule`)
          window.location.reload(false);
        }
        if(user?.role == 0){
          
          if(meeting?.candidate_user_email !== user?.email){
            refresh= true;
            alert("This meeting has not been made for you")
            history_2.push(`/meetings/candidate-see-meetings-schedule`)
            window.location.reload(false);
          }
          if(meeting?.candidate_user_email === user?.email){
            console.log("Candidate Success")
          }
        }
        
        
      }
    },[meeting])

    useEffect(() => {
      socket.current = io.connect(endPoint, { transports: ['websocket'] ,upgrade: false });
      // socket.current = socketIOClient("http://localhost:3000/call")
      // console.log("gotten")
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      userName= user?.name;
      
      socket.current.on("yourID", (id) => {
        // setYourID(id); /////////////////////////////////////////
        setYourID(id)
        // setYourName(user)
      })
      socket.current.on("allUsers", users => {
        setUsers(users); // ======================
        // setUsers(userName); // ======================
      })
      // console.log("current users :" ,users)
      socket.current.on("hey", (data) => {
        setReceivingCall(true);
        setOpen(true);
        // console.log("data from", data)
        setCaller(data.from);
        setCallerSignal(data.signal);
      })
      // console.log("current users :" ,users)
    
      let text = $('input');
      // console.log("hey" ,text)

      $('html').keydown(e => {
        if(e.which === 13 && text.val().length !==0){
          // console.log(text)
          // console.log(text.val())
          socket.current.emit('message', text.val());
          text.val('');
          
        }
      })

      //receiving message we sent to server in jquery function

      socket.current.on('createMessage', message => {
        
        // console.log('this is coming from server')
        $('ul').append(`<li class = "message">
            <b id = "a"> user </b>
            <br/>
            ${message}
        </li>`);
        // document.getElementById('a').innerHTML = userName;
        scrollToBottom();
      })

      const scrollToBottom = () => {
        let d = $('.main_chat_window');
        d.scrollTop(d.prop("scrollHeight"));
      }
      
    
      
    }, [ ]);

    //end of useeffect

    useEffect ( ()=> {
      // console.log("state :", visible );
      setTimeout(() => {
        setVisible();
      },5000)
    },[visible])
  
    function callPeer(id) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
  
          iceServers: [
              {
                  urls: "stun:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              },
              {
                  urls: "turn:numb.viagenie.ca",
                  username: "sultan1640@gmail.com",
                  credential: "98376683"
              }
          ]
      },
        stream: stream,
      });
  
      peer.on("signal", data => {
        socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
      })
  
      peer.on("stream", stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  
      socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.signal(signal);
      })
      
      
    }

    const handleClose = () => {
      setOpen(false);
    };

    // useEffect(() => {
    //   startVideo()
    // }, [])


      useEffect(() => {
        const loadModels = async () => {
          alert(process.env.PUBLIC_URL)
          const MODEL_URL = process.env.PUBLIC_URL + '/models';
          Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
          ]).then(startVideo);
        }
        loadModels()
      }, [])

      function startVideo() {
        navigator.getUserMedia(
          { video: {} },
          stream => videoRef.current.srcObject = stream,
          err => console.error(err)
        )
      }


      const emotionDetection = () => {
        var options = {}
        var speechEvents = hark(stream, options)
        if (user.role === 0) {
          if (gatherEmotion) {
            speechEvents.on('speaking', function() {
              setInterval(async () => {
                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                let values = detections[0]
                let emotions = values?.expressions
                let sortedEmotions = emotions?.asSortedArray()
                if (typeof sortedEmotions !== 'undefined') {
                  let dominantEmotion = sortedEmotions[0]
                  console.log(dominantEmotion)
                  if (dominantEmotion.expression == 'angry' || dominantEmotion.expression == 'disgusted' || dominantEmotion.expression == 'fearful'
                    || dominantEmotion.expression == 'sad' || dominantEmotion.expression == 'surprised') {
                      dominantEmotion.score = 0 
                      ScoresArrayForMean.push(0)               
                  }
                  else if (dominantEmotion.expression == 'happy' || dominantEmotion.expression == 'neutral') {
                    dominantEmotion.score = 5
                    ScoresArrayForMean.push(5)
                  }
                  scoredEmotions.push(dominantEmotion)
                }
              }, 5000)
            })
          } 
        }
      }

    function acceptCall() {
      console.log("I got here") 
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", data => {
        socket.current.emit("acceptCall", { signal: data, to: caller })
      })
  
      peer.on("stream", stream => {
        videoRef.current.srcObject = stream;
      });
  
      peer.signal(callerSignal);
      setOpen(false);
    }
    
    function rejectCall() {
      setReceivingCall(false);
      setCaller("");
      setCallerSignal(""); 
    }
   

    let UserVideo;
    if (stream) {
      UserVideo = (
        <div>
           <video className= "userVideo" playsInline muted ref={videoRef} autoPlay />  
        </div>
      );
    }
  
    let PartnerVideo;
    if (callAccepted) {
      PartnerVideo = (
        <div>
          <video className= "partnerVideo" playsInline  ref={videoRef} autoPlay onPlay={emotionDetection} />
        </div>
      );
    }
  
    let incomingCall;
    if (receivingCall) {
      incomingCall = (
          <div className= "ic__main">

          <Dialog open={open}  onClose={handleClose} scroll = {"body"} fullWidth = {true} aria-labelledby="form-dialog-title">
 
            <DialogTitle id="form-dialog-title">{isAdmin ? "Candidate" : "Interviewer"} is calling you</DialogTitle>
            <DialogContent>
            {/* <DialogContentText>
              Click on either of these buttons, Pressing Accept button will append Interviewer's videostream.
            </DialogContentText>  */}
  
            </DialogContent>
            <DialogActions>
                <div className="accept__reject__container" >
                  <div className="accept__button" onClick={acceptCall}>
                    <h2>Accept</h2>
                    <div class="pulse">  <PhoneIcon /> </div>
                  </div>
                  <div className="reject__button" onClick={rejectCall}>
                    <h2>Reject</h2>
                    <div class="pulse__red">
                      <PhoneDisabledIcon />
                    </div>
  
                  </div>
                </div>
                  
            </DialogActions>          
        </Dialog>
          </div>
          
      )
      
    }
    
    const video = document.getElementById('pv')
    

      var myVideoStream;
      

      myVideoStream = userVideo?.current?.srcObject || partnerVideo?.current?.srcObject;
      myVideoStream = stream;
      const location = useLocation()
      const history = useHistory()
      // Mute your video
      const muteUnmute = () => {
        console.log(myVideoStream)
        let enabled = myVideoStream?.getAudioTracks()[0]?.enabled ;
        if (enabled){ 
          myVideoStream.getAudioTracks()[0].enabled = false;
          changeMute();
        }
        else{
          changeMute();
          myVideoStream.getAudioTracks()[0].enabled = true;
        }
      }


      const playStop = () => {
        let enabled = myVideoStream?.getVideoTracks()[0]?.enabled; 
        if (enabled){
          myVideoStream.getVideoTracks()[0].enabled = false;
          changeVideo();
        }
        else{
          changeVideo();
          myVideoStream.getVideoTracks()[0].enabled = true;
        }
      }
    
    const changeMute = () => {  
      unMute(!mute);
    }
    const changeVideo = () => {
      setEnableVideo(!enableVideo);
    }
    var muteUnmute_btn_class = mute ? "fas fa-microphone" : "unmute fas fa-microphone-slash";
    var playStop_btn_class = enableVideo ? "fas fa-video" : "stop fas fa-video-slash";

    const reloadVideo= () => {
      // let video1 = userVideo?.current?.srcObject;
      // video1 = stream;
      // let video2 = partnerVideo?.srcObject;
      // video2 = stream;
      // console.log(video1?.getAudioTracks()[0]);
      // console.log(video2?.getAudioTracks()[0]);

      setGatherEmotion(false)
      setCandidateEmotion(scoredEmotions)
      const happy = 0;
      const angry = 0;
      const disgusted = 0;
      const fearful = 0;
      const sad = 0;
      const surprised = 0;
      const neutral = 0;

      // history.push('/admin')
      // if(isAdmin){
      //   window.location.reload(false);
      // }
      // else if (isLogged){
      //   history.push('/candidate')
      //   window.location.reload(false);
      // }
      
    }


    return (
      <>
        {incomingCall}
        <div className="main__call">
        {loading && <Loading />}
        
          <div className="main__call__left">
          
          <div className="main__videos">
            <div className="video__grid">
              {UserVideo}
            </div>
            <div className="video__grid">
              {PartnerVideo}
            </div>

          </div>
        
          {/* end of main video */}

          <div className="main__controls">
          
            <div className="main__controls__block">
              <div  className="main__controls__button main__mute__button">
                
                {/* <i className= {muteUnmute_btn_class} onClick = {muteUnmute}></i> */}
                {mute ? (
                  <>
                    <MicIcon  onClick = {muteUnmute} />
                  </>
                ):(
                  <> 
                  <MicOffIcon className = "unmute" onClick = {muteUnmute}/>
                  </>
                )}
                <span> {mute ? "Mute" : "UnMute" } </span>
              </div>

              <div  className="main__controls__button main__video__button">
                {/* <i className= {playStop_btn_class} onClick = {playStop}></i> */}
                {enableVideo ? (
                  <>
                    <VideocamIcon  onClick = {playStop} />
                  </>
                ):(
                  <> 
                  <VideocamOffIcon className = "stop" onClick = {playStop}/>
                  </>
                )}
                <span> {enableVideo ? "Stop Video" : "Play Video" } </span>
                
              </div>
            </div>

          <div className="main__controls__block">
            {Object.keys(users).map(key => {
                
                if (key === yourID ) {
                  return null;
                }
                if(isAdmin) {
                  return(
                    <button onClick={() => callPeer(key)}>{isAdmin ? "Call Candidate" : "Call Interviewer"}</button>
                  )
                }
                if(!isAdmin) {
                  return (
                    null
                  );
                }
              })}
              {/* {incomingCall} */}
          </div>
            
              
              <div class="main__controls__block">

                <div class="main__controls__button" onClick = {reloadVideo}>
                    {/* <Link to= "/main-menu"> */}
                      <i  class="fas fa-sign-out-alt"></i>
                      {/* <span class= "leave__meeting" onClick = {()=> window.location.reload(false); }> Leave Meeting</span> */}
                      <span class= "leave__meeting"  > Leave Meeting</span>
                    {/* </Link> */}
                    
                </div>
          </div>
        </div>
        </div>
        <div class="main__right">
              <div class="main__header">
                  <h1>chat</h1>
              </div>
              <div class="main__chat__window">
                  <ul class="messages">

                  </ul>
              </div>
              <div class="main__message__container">
                  <input type="text" id="chat__message" placeholder="Type Message here" />
              </div>
          </div>
      



      </div>
      </>
      
      
      
  );}
  

export default Call
