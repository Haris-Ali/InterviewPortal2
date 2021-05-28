import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {useParams, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import './Interview_Post_Page.css'
import { useForm, Controller } from "react-hook-form"
import { isEmpty } from '../utils/validation/Validation';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import Loading from '../Loading';


function getModalStyle() {
    const top = 50;
    const left = 50; 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      
    };
}


function Candidate_Profile_Page({user}) {
    const {register, handleSubmit} = useForm();
    const interviewer_user_Id = user._id;
    const {id} = useParams();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [candidate, setCandidate] = useState([])
    const [apiError, setApiError] = useState('');
    const [value, setValue] = useState('')
    const check = value.length > 9;
    const[candidate_user_Id, setCandidateUserId] = useState('') 

    const callApi = async ()=>{     
        setLoading(true);
        await axios.post("/user/get-candidate",{candidateId: id}).then((res)=>{
            setCandidate(res.data);
            setCandidateUserId(res.data.user._id)
            console.log("candidate: ",res.data)
            setLoading(false);
            
        }).catch((err) => {
            setApiError(err)
        });
    }
    useEffect(()=>{
        callApi();  
    },[])

    useEffect(()=>{
        console.log("value rn", value)
        console.log("Error Before :", error)
        console.log("Success Before :", success)
        setSuccess('')
        setError('')
        console.log("Error After :", error)
        console.log("Success After:", success)
    },[open]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSuccess("")
        setError("")
        setValue('');
        setOpen(false);
    };

    
    const onSubmit = async (e) =>{
        setLoading(true)
        const message = e.message;
        await axios.post("/user/send-email-to-candidate",{interviewer_user_Id, candidate_user_Id, message}).then((res)=>{
            console.log(res.data)
            setSuccess(res.data)
            setLoading(false);
            
        }).catch((err) => {
            setApiError(err)
        });
    }
    
    return (

        <>

        {
            loading ? (
                <>
                  <Loading />  
                </>
            ): (

                <>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <form noValidate onSubmit={handleSubmit(onSubmit)} >
                        {error && !success && showErrorMessage(error)}
                        {success && !error && showSuccessMessage(success)}
                        <DialogTitle id="form-dialog-title">Email</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Your Message will be sent to the interviewer. He will be obliged to contact you back.
                            Please write your message here
                        </DialogContentText>
        
                        <TextField
                            {...register("message")}
                            variant="outlined"
                            multiline
                            rows={10}
                            rowsMax={10}
                            required
                            fullWidth
                            autoFocus
                            id="message"
                            label="Message"
                            name="message"
                            autoComplete="I would like you to contact me!"
                            onChange = {e =>  setValue(e.target.value)}
                        />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button disabled ={!check} color="primary" type="submit" >
                                Send
                            </Button>
                        </DialogActions>          
                        </form>
                    </Dialog>
        
                    <div>
                        <img className = "interview__home__image" src="https://res.cloudinary.com/xapper72/image/upload/v1620095929/avatar/amazon_qrzh6x.png" alt=""/>
                    </div>
                    <div className="main">
                        <div className="left__container">
                            <div className="card">
                                <img src={candidate?.user?.avatar} className= "img_post"/>
                                <h2>{candidate?.user?.name}</h2>
                                <p class="title">{candidate?.user?.email} </p>
                                <p>{candidate?.education?.institute_name}</p>
                                {/* <button className = "contact__button"> Contact </button> */}
                                <button className = "email__button" onClick={handleClickOpen}> Contact </button>
                            </div>
                        
                        </div>
                        <div className="right__container">
                            {/* <div className="post__header">
                                <h1>Post Information</h1>
                            </div> */}
                            <div className="user__section">
        
                                <div className="heading__section">
                                    <PermIdentityOutlinedIcon />
                                    <h2 className= "user__section__heading">User Information</h2>
                                </div>
                                
                                <div className="user__information__main">
                                    <div className="user__information__left">
                                        <div className="user__information__left__section">
                                            <h4> <b> Age  </b>  </h4>
                                            <h4> {candidate?.age} </h4>
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> Phone Number  </b>  </h4>
                                            <h4> {candidate?.phone_number} </h4>
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> City   </b>  </h4>
                                            <h4> {candidate?.city} </h4>
                                        </div>

                                        
                                        <div className="user__information__left__section">
                                            <h4> <b> Address   </b>  </h4>
                                            <h4> {candidate?.postal_address} </h4>
                                        </div>


                                        <div className="user__information__left__section">                         
                                            <h4> <b> Institute Name   </b>  </h4>
                                            <h4> {candidate?.education?.institute_name} </h4>
                                        </div>

                                       
                                        
                                    </div>

                                    <div className="user__information__right">
                                        <div className="user__information__right__section">
                                            <h4> <b> Experience  </b>  </h4>
                                            <h4> {candidate?.experience} </h4>
                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b>  Career Level </b>  </h4>
                                            <h4> {candidate?.career_level} </h4>
                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b> Expecting Salary   </b>  </h4>
                                            <h4> {candidate?.expected_salary}$ </h4>
                                        </div>

                                        <div className="user__information__right__section">                         
                                            <h4> <b> Qualification   </b>  </h4>
                                            <h4> {candidate?.education?.qualification} </h4>
                                        </div>

                                        <div className="user__information__right__section">                         
                                            <h4> <b> Completion Year   </b>  </h4>
                                            <h4> {candidate?.education?.completion_year} </h4> 
                                        </div>

                                        
                                    </div>

                                    
                                </div>

                                <div className="candidate__information__main__below">        
                                        <h4> <b> Skills Acquired   </b>  </h4>
                                        <div className="post__skills__section">
                                             {
                                                candidate?.skills?.map((skill,index)=>
                                                    {                                                          
                                                        return(
                                                            <> 
                                                                {
                                                                    (index+1) === candidate?.skills?.length ?  (
                                                                        <h4> {skill}. </h4>
                                                                    ) : (
                                                                        <h4> {skill}, </h4>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }                                   
                                                )
                                            }
                                        </div>

                                        <h4> <b> Desired job Titles   </b>  </h4>
                                        <div className="post__skills__section">
                                             {
                                                candidate?.job_preference?.desired_job_titles?.map((job,index)=>
                                                    {                                                          
                                                        return(
                                                            <> 
                                                                {
                                                                    (index+1) === candidate?.job_preference?.desired_job_titles?.length ?  (
                                                                        <h4> {job}. </h4>
                                                                    ) : (
                                                                        <h4> {job}, </h4>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }                                   
                                                )
                                            }
                                        </div>
                                        <h4> <b> Previous Job Salary   </b>  </h4>
                                        <h4> {candidate?.job_preference?.previous_jobs_salary}$ </h4>    

                                    </div>
                            </div>

        
                            <div className="project__section">
            
                                <div className="heading__section">
                                    <PermIdentityOutlinedIcon />
                                    <h2 className= "user__section__heading"> Projects Information </h2>
                                </div>
                            
                                {
                                    candidate.projects?.map((project,index) =>{
                                        return(
                                            <div className="company__list__section">
                                                <div className="company__list__heading__section">
                                                    <h3 className= "user__section__heading"> {project.title} </h3>
                                                </div>

                                                <div className = "project__main">
                                                    <h4> <b> Project URL   </b>  </h4>
                                                    <h4> {project.project_URL} </h4>

                                                    <h4> <b> Project Description   </b>  </h4>
                                                    <h4> {project.project_description} </h4>
                                                
                                                </div>  
                                        </div>
                                    )})
                                }
                                    
                            </div>
                        </div>  
                    
                    </div>

                </>
            )
        }
        
        </>
            
    )
}

export default Candidate_Profile_Page
