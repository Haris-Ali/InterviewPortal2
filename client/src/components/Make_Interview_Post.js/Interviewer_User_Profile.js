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
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Link} from 'react-router-dom'

function getModalStyle() {
    const top = 50;
    const left = 50; 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      
    };
}


function Interviewer_User_Profile({user}) {

    const token = useSelector(state => state.token)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true);
    const [interviewer, setInterviewer] = useState([])
    const [apiError, setApiError] = useState('');
    const [post, setPost] = useState([])
    const history = useHistory()
    const [refresh, setRefresh] = useState(false)
    const callApi = async ()=>{     

        await axios.post("/user/get-interviewer-by-userId",{userId: user._id}).then((res)=>{
            setInterviewer(res.data);
            console.log("interviewer: ",res.data)
            setLoading(false);
        }).catch((err) => {
            setApiError(err)
        });

        
    }
    useEffect(()=>{
        console.log("This Use Effect is being called")
        callApi();  
    },[refresh])

    const handleAdd = async () => {
            history.push(`/add-company`)    
    }
    const handleEdit = async (id) => {
            history.push(`/edit-company/${id}`)         
 
    }

    const handleDelete = async (id) => {
        try {
            
            if(window.confirm("Are you sure you want to delete this account?")){
                setLoading(true)
                await axios.delete(`/user/delete-company/${id}`, {
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
                                <img src={interviewer?.user?.avatar} className= "img_post"/>
                                <h2>{interviewer?.user?.name}</h2>
                                <p class="title">{interviewer?.user?.email} </p>
                                <p>{interviewer?.education?.institute_name}</p>
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

                                <div className="company__section__titlebar">
                                    <div className="company__heading__section">
                                        <PermIdentityOutlinedIcon />
                                        <h2 className= "company__heading_section_text"> Company Information </h2>
                                    </div>

                                    <div className="company__button__section">
                                        <h4> Add </h4>
                                        <AddOutlinedIcon onClick={handleAdd}/>
                                    </div>

                                </div>
                                
                            
                            
                                {
                                    
                                    interviewer?.companies?.map((company,index) =>{
                                        return(
                                            <div className="company__list__section">
                                                <div className="company__title__section">
                                                    <div className="company__list__heading__section">
                                                        <h3 className= "user__section__heading"> {company.company_name} .Inc </h3>
                                                    </div>
                
                                                    <div className="company__button__section">
                                                        
                                                        <EditOutlinedIcon  onClick={() => handleEdit(company._id)} className= "edit__icon"/>
                                                        
                                                        <DeleteOutlinedIcon  onClick={() => handleDelete(company._id)}/>
                                                    </div>
                                            
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



                            {/* <div className="post__section">
                            
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
         */}
                        </div>  
                    
                    </div>

                </>
            )
        }
        
        </>
            
    )
}

export default Interviewer_User_Profile
