import React, { useEffect,} from 'react'
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-pro-react/components/headerLinksStyle";
import NotificationsIcon from '@material-ui/icons/Notifications';
import './notification.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Pusher from 'pusher-js'
import useState from 'react-usestateref'

toast.configure();
function Header__Notifications({rtlActive, classes, user, isAdmin, isLogged}) {
    const [open, setOpen] = useState(false)
    const [candidateNotifications, setCandidateNotifications, candidateRef] = useState(user?.candidate_notifications);
    const [interviewerNotifications, setInterviewerNotifications, interviewerRef] = useState(user?.interviewer_notifications);
    const noti = ["You have a new email", "Hamza Zaheer sent you a message", "Please attempt test"]
    const [refresh, setRefresh] = useState(false);
    const [interviewer, setInterviewer] = useState([])
    const [loading, setLoading] = useState(false);
    const [notificationsLength, setNotificationsLength, notiRef] = useState(isAdmin ? interviewerNotifications.length : candidateRef.current.length );
    // const getInterviewer = async(userId) =>{
    //     setLoading(true);
    //     await axios.post(`/user/get-interviewer-by-userId`, {
    //         userId
    //     }).then((res)=>{
    //         console.log("response has been received: ", res.data)
    //         setInterviewer(res.data)
    //         setLoading(false);
    //     }).catch((err) => {
    //         setApiError(err)
    //     });
    // }

  
    
    useEffect(()=>{
        // console.log("Open :", open)
        setNotificationsLength(user?.interviewer_notifications.length)
        setNotificationsLength(user?.candidate_notifications.length)
        var pusher = new Pusher('839f2da51d1835f60ca6', {
            cluster: 'eu'
        });
      
        var channel = pusher.subscribe('users');
            channel.bind('updated', function(newNotifications) {    
            // alert(JSON.stringify(newNotifications));
            if(newNotifications.userId === user?._id){
                if(isAdmin){
                    // setInterviewerNotifications([...interviewerNotifications, newNotifications.interviewer_notifications])
                    setInterviewerNotifications(newNotifications.interviewer_notifications);
                    // const newArray = [...interviewerNotifications, newNotifications.interviewer_notifications]
                    // console.log(newArray[0])
                    // console.log(newArray[0].length)
                    // setNotificationsLength(newArray[0].length)
                }
                else{
                 
                        // setCandidateNotifications([...candidateNotifications, newNotifications.candidate_notifications])
                    setCandidateNotifications(newNotifications.candidate_notifications);
                    // console.log("candidate notifications after trigger",candidateNotifications)
                    // console.log("candidate notifications length after trigger",candidateNotifications.length)
    
                    // console.log("candidate notifications Ref after trigger",candidateRef.current)
                    // console.log("candidate notifications length Ref after trigger",candidateRef.current.length)
                    // console.log("candidate notifications after trigger from response",newNotifications.candidate_notifications.length)
                    
                   
                }
            }
           
        });
        return () =>{
            channel.unbind();
            channel.unsubscribe();
        }
        
    },[candidateNotifications, interviewerNotifications, notificationsLength])


    const handleClick = () => {
        const length = isAdmin ? interviewerRef?.current?.length : candidateRef?.current?.length;
        setOpen(true);
        if( length < 1){
            toast.error("No Notifications to pop", {postion: toast.POSITION.TOP_RIGHT, autoClose: 2000})
            setInterval(() => {
                setOpen(false);
            }, 3000);
        }
        else{

            // notify logic
            if(isAdmin){

                interviewerNotifications.map((notification) => {
                    return (
                        toast.info(notification, {postion: toast.POSITION.TOP_RIGHT, autoClose: 5000})
                    )
                })
            }
            else{
                candidateNotifications.map((notification) => {
                    return (
                        toast.info(notification, {postion: toast.POSITION.TOP_RIGHT, autoClose: 5000})
                    )
                    
                })
            }
        }
    };

    const handleClose = () => {
        const length = isAdmin ? interviewerRef?.current?.length : candidateRef?.current?.length;
        if(length > 0){
            pop_notifications()
        }
        setOpen(false);
        setRefresh(!refresh)
    };
   
    const pop_notifications = async(userId) =>{
        setLoading(true);
        await axios.post(`/user/pop-notifications`, {
            userId: user?._id
        }).then((res)=>{
            console.log("response has been received: ", res.data)
            if(isAdmin){
                setInterviewerNotifications([])
            }
            else {
                setCandidateNotifications([])
            }
            setNotificationsLength(0);
            setLoading(false);
        }).catch((err) => {
            alert(err.response.data.msg)
        });
    }

    return (
        <div className= "notification__body">
                {open === true ? (
                    <>

                        <button type="button" class="icon-button" onClick = {handleClose}>
                            <span class="material-icons">
                                notifications_active
                            </span>
                        </button>
                        
                    </>
                   
                    )
                    : (
                        <>
                            <button type="button" class="icon-button" onClick = {handleClick}>
                                <span class="material-icons">notifications</span>
                                <span class="icon-button__badge">{isAdmin ? interviewerRef?.current?.length : candidateRef?.current?.length}</span>
                            </button>
                        </>
                       
                    )
                }     
            
        </div>
            

    )
}

export default Header__Notifications
