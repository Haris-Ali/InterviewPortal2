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
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';


function getModalStyle() {
    const top = 50;
    const left = 50; 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      
    };
}


function Candidate_User_Profile({user}) {
    const token = useSelector(state => state.token)
    const {register, handleSubmit} = useForm();
    const interviewer_user_Id = user._id;
    const {id} = useParams();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const history = useHistory()
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [candidate, setCandidate] = useState([])
    const [apiError, setApiError] = useState('');
    const [value, setValue] = useState('')
    const check = value.length > 9;
    const[candidate_user_Id, setCandidateUserId] = useState('') 
    const [refresh, setRefresh] = useState(false)
    // const callApi = async ()=>{     
    //     setLoading(true);
    //     await axios.post("/user/get-candidate",{candidateId: id}).then((res)=>{
    //         setCandidate(res.data);
    //         setCandidateUserId(res.data.user._id)
    //         console.log("candidate: ",res.data)
    //         setLoading(false);
            
    //     }).catch((err) => {
    //         setApiError(err)
    //     });
    // }
    const callApi = async ()=>{     

        await axios.post("/user/get-candidate-by-userId",{userId: user._id}).then((res)=>{
            setCandidate(res.data);
            console.log("Candidate: ",res.data)
            setLoading(false);
        }).catch((err) => {
            setApiError(err)
        });

        
    }
    useEffect(()=>{
        callApi();  
    },[refresh])

    const handleAdd = async () => {
        history.push(`/add-project`)    
    }
    const handleEdit = async (id) => {
        history.push(`/edit-project/${id}`)         

    }

    const handleDelete = async (id) => {
        try {
            
            if(window.confirm("Are you sure you want to delete this account?")){
                setLoading(true)
                await axios.delete(`/user/delete-project/${id}`, {
                    headers: {Authorization: token}
                })
                setLoading(false)
                setRefresh(!refresh);
            }

        } catch (err) {
            alert(err)
        }
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
            
                                <div className="company__section__titlebar">
                                    <div className="company__heading__section">
                                        <PermIdentityOutlinedIcon />
                                        <h2 className= "company__heading_section_text"> Project Information </h2>
                                    </div>

                                    <div className="company__button__section">
                                        <h4> Add </h4>
                                        <AddOutlinedIcon onClick={handleAdd}/>
                                    </div>

                                </div>
                            
                                {
                                    candidate.projects?.map((project,index) =>{
                                        return(
                                            <div className="company__list__section">
                                                <div className="company__title__section">
                                                    <div className="company__list__heading__section">
                                                        <h3 className= "user__section__heading"> {project?.title} </h3>
                                                    </div>
                
                                                    <div className="company__button__section">
                                                        
                                                        <EditOutlinedIcon  onClick={() => handleEdit(project?._id)} className= "edit__icon"/>
                                                        
                                                        <DeleteOutlinedIcon  onClick={() => handleDelete(project?._id)}/>
                                                    </div>
                                            
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

export default Candidate_User_Profile
