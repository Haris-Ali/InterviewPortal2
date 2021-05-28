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
import moment from 'moment';


function getModalStyle() {
    const top = 50;
    const left = 50; 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      
    };
}


function Interview_Post_Page({user}) {

    const {register, handleSubmit} = useForm();
    const candidate_user_Id = user._id;
    const {id} = useParams();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [interviewer, setInterviewer] = useState([])
    const [apiError, setApiError] = useState('');
    const [value, setValue] = useState('')
    const [post, setPost] = useState([])
    const check = value.length > 9;
    const[interviewer_user_Id, setInterviewerUserId] = useState('') 

    const callApi = async ()=>{     
        setLoading(true);
        await axios.post("/user/get-interviewer-by-postId",{postId: id}).then((res)=>{
            setInterviewer(res.data);
            console.log("interviewer: ",res.data)
            setInterviewerUserId(res.data.user._id)
            setLoading(false);
        }).catch((err) => {
            setApiError(err)
        });
        setLoading(true); 
        await axios.post("/user/get-post",{postId: id}).then((res)=>{
            setPost(res.data);
            console.log("post: ",res.data)
            setLoading(false);
        }).catch((err) => {
            setApiError(err)
        });
        
    }
    useEffect(()=>{
        console.log("This Use Effect is being called")
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
        await axios.post("/user/send-email-to-interviewer",{interviewer_user_Id, candidate_user_Id, message}).then((res)=>{
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
                                <img src={interviewer?.user?.avatar} className= "img_post"/>
                                <h2>{interviewer?.user?.name}</h2>
                                <p class="title">{interviewer?.user?.email} </p>
                                <p>{interviewer?.education?.institute_name}</p>
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
                                            <h4> {interviewer?.age} </h4>
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> Phone Number  </b>  </h4>
                                            <h4> {interviewer.phone_number} </h4>
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> City   </b>  </h4>
                                            <h4> {interviewer?.city} </h4>
                                        </div>
                                        <div className="user__information__left__section">
                                            <h4> <b> Address   </b>  </h4>
                                            <h4> {interviewer?.postal_address} </h4>
                                        </div>
                                        
                                    </div>

                                    <div className="user__information__right">
                                        <div className="user__information__right__section">
                                            <h4> <b> Qualification </b>  </h4>
                                            <h4> {interviewer?.education?.qualification} </h4>
                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b> Graduated from  </b>  </h4>
                                            <h4> {interviewer?.education?.institute_name} </h4>
                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b> Graduation year   </b>  </h4>
                                            <h4> {interviewer?.education?.completion_year} </h4>
                                        </div>
                                         <div className="user__information__right__section">
                                            <h4> <b> Email   </b>  </h4>
                                            <h4> {interviewer?.user?.email} </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
        
        
                        
                            <div className="company__section">
            
                                <div className="heading__section">
                                    <PermIdentityOutlinedIcon />
                                    <h2 className= "user__section__heading"> Company Information </h2>
                                </div>
                            
                            
                                {
                                    
                                    interviewer?.companies?.map((company,index) =>{
                                        return(
                                            <div className="company__list__section">

                                                <div className="company__list__heading__section__for__profile__page">
                                                    <h3 className= "user__section__heading"> <b>{company.company_name} .Inc </b></h3>
                                                </div>

                                                <div className="user__information__main">
                                                    <div className="user__information__left">
                                                        
                    
                                                        <div className="user__information__left__section">
                                                            <h4> <b> CEO   </b>  </h4>
                                                            <h4> {company.ceo_name}</h4>
                                                        
                                                           
                                                        </div>
                    
                                                        <div className="user__information__left__section">
                                                            <h4> <b> Company Address   </b>  </h4>
                                                            <h4> {company.company_address}</h4>
                    
                                                            
                                                        </div>
                                                        <div className="user__information__left__section">
                                                            <h4> <b> Industry   </b>  </h4>
                                                            <h4> {company.industry} </h4>

                                                        </div>

                                                        <div className="user__information__left__section">
                                                            <h4> <b> Ownership Type   </b>  </h4>
                                                            <h4>  {company.ownership_type}</h4>
                                                        </div>
                                                      
                                                        <div className="user__information__left__section">
                                                            <h4> <b> Contact Number   </b>  </h4>
                                                            <h4>  {company.contact_no}</h4>
                                                        </div>
                                                    </div>
            
                                                    <div className="user__information__right">
                                                        <div className="user__information__right__section">
                                                            <h4> <b> Origin   </b>  </h4>
                                                            <h4> {company.origin} </h4>
                                                        </div>
                        
                                                        <div className="user__information__right__section">
                                                            <h4> <b> No. of Employees   </b>  </h4>
                                                            <h4>  {company.employees_no}</h4>                                  
                                                        </div>
                        
                                                        <div className="user__information__right__section">
                                                            <h4> <b> Operating Since   </b>  </h4>
                                                            <h4> {company.operating_since} </h4>                                                        
                                                        </div>
                                                        <div className="user__information__right__section">
                                                            <h4> <b> No. of Offices   </b>  </h4>
                                                            <h4>  {company.offices_no}</h4>
                                                        </div>

                                                        <div className="user__information__right__section">
                                                            <h4> <b> Contact Email   </b>  </h4>
                                                            <h4> {company.contact_email} </h4>
                                                        </div>

                                                       

 
                                                    </div>
                                                </div>   
                                                
                                                
                                                 <div className="company__information__main">        
                                                    <h4> <b> Company Description   </b>  </h4>
                                                    <h4> {company.company_description} </h4>
                                                 </div>
            
                                        </div>
                                    )})
                                }
                                
                            </div>



                            <div className="post__section">
                            
                                <div className="heading__section">
                                        <BookOutlinedIcon />
                                        <h2 className= "post__section__heading">Post Information</h2>
                                </div>

                                <div className="user__information__main">
                                    <div className="user__information__left">
                                        <div className="user__information__left__section">
                                            <h4> <b> Title   </b>  </h4>
                                            <h4> {post.title}</h4>

                                    
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> Salary   </b>  </h4>
                                            <h4> {post.salary}</h4>

                                        
                                        </div>
        
                                        <div className="user__information__left__section">
                                            <h4> <b> Work Hours   </b>  </h4>
                                            <h4> {post.workhours}</h4>
                                        </div>
                                        <div className="user__information__left__section">
                                            <h4> <b> Location   </b>  </h4>
                                            <h4> {post.location} </h4>
                                        </div>
                                        
                                    </div>

                                    <div className="user__information__right">
                                        <div className="user__information__right__section">
                                            <h4> <b> Experience Required  </b>  </h4>
                                            <h4> {post.experience} </h4>

                                        
                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b> Qualification Required </b>  </h4>
                                            <h4> {post?.qualification} </h4>

                                        </div>
        
                                        <div className="user__information__right__section">
                                            <h4> <b> Career Level Required  </b>  </h4>
                                            <h4> {post?.career_level} </h4>
                                    
                                        </div>
                                        <div className="user__information__right__section">
                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="post__information__main">        
                                    <h4> <b> Skills Required    </b>  </h4>
                                    <div className="post__skills__section">
                                            {
                                                post?.skills?.map((skill,index)=>
                                                    {                                                          
                                                        return(
                                                            <> 
                                                                {
                                                                    (index+1) === post.skills.length ?  (
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
                                    
                                    

                                    <h4> <b> Last Date to Apply </b>  </h4>
                                    <h4> {moment(post?.expiry_date, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')} </h4>

                                    <h4> <b> Last Time to Apply   </b>  </h4>
                                    <h4> {moment(post?.expiry_time).format('HH:mm')} </h4>
                                    
                                    <h4> <b> Job Description   </b>  </h4>
                                    <h4> {post?.job_description} </h4>

                                </div>
                                        
                            </div>
        
                        </div>  
                    
                    </div>

                </>
            )
        }
        
        </>
            
    )
}

export default Interview_Post_Page
