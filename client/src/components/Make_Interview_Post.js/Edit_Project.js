import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
const moment = require('moment');
import {useParams, useHistory} from 'react-router-dom'

import CreateIcon from '@material-ui/icons/Create';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './Get_Interview_Posts.css'

import { useForm, Controller } from "react-hook-form"
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import { isEmpty, validateAge, validateInstitute, validatePhoneNumber, validateSalary, validateTitle, validateWorkHours } from '../utils/validation/Validation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Loader from "react-loader-spinner";

import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';

import MomentUtils from '@date-io/moment';
import WorkOutlinedIcon from '@material-ui/icons/WorkOutlined';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Interview-Me!
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100hv',
    borderStyle: "solid",
    padding: "20px"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const useStyles_two = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
    backgroundColor: 'transparent',

  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Edit_Project({user, isAdmin, isLogged}) {

  const token = useSelector(state => state.token)
 
  const classes = useStyles();
  const classes_two = useStyles_two();
  const {id} = useParams()
  const postId = id;
  const {register, handleSubmit, control} = useForm();
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [picToSend, setPicToSend] = useState("");

  const [city, setCity] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [careerLevel, setCareerLevel] = React.useState('');
  const [qualification, setQualification] = React.useState('');
  const [expiryDate, setExpiryDate] = useState();
  const [expiryTime, setExpiryTime] = useState();

  const [year, setYear] = useState('')
  
  
  const dropdownCity = [
    {value: "Islamabad", name: "Islamabad"},
    {value: "Lahore", name: "Lahore"},
    {value: "Karachi", name: "Karachi"},
    {value: "Quetta", name: "Quetta"},
    {value: "Peshawar", name: "Peshawar"}
  ];

 const expArray = [
    {value: "No Experience / Fresh", name: "No Experience / Fresh"},
    {value: "1 Years", name: "1 Years"},
    {value: "2 Years", name: "2 Years"},
    {value: "3 Years", name: "3 Years"},
    {value: "4 Years", name: "4 Years"},
    {value: "5 Years", name: "5 Years"},
    {value: "6 Years", name: "6 Years"},
    {value: "7 Years", name: "7 Years"},
    {value: "8 Years", name: "8 Years"},
    {value: "9 Years or more", name: "9 Years or more"},
  ];

  

 const yearsArray = [
    {value: "1997", name: "1997"},
    {value: "1998", name: "1998"},
    {value: "1999", name: "1999"},
    {value: "2000", name: "2000"},
    {value: "2001", name: "2001"},
    {value: "2002", name: "2002"},
    {value: "2003", name: "2003"},
    {value: "2004", name: "2004"},
    {value: "2005", name: "2005"},
    {value: "2006", name: "2006"},
    {value: "2007", name: "2007"},
    {value: "2008", name: "2008"},
    {value: "2009", name: "2009"},
    {value: "2010", name: "2010"},
    {value: "2011", name: "2011"},
    {value: "2012", name: "2012"},
    {value: "2013", name: "2013"},
    {value: "2014", name: "2014"},
    {value: "2015", name: "2015"},
    {value: "2016", name: "2016"},
    {value: "2017", name: "2017"},
    {value: "2018", name: "2018"},
    {value: "2019", name: "2019"},
    {value: "2020", name: "2020"},
    {value: "2021", name: "2021"},
 ];

  const qualificationArray = [
    {value: "Non-Matriculation", name: "Non-Matriculation"},
    {value: "Matriculation / O-Level", name: "Matriculation / O-Level"},
    {value: "Intermediate / A-Level", name: "Intermediate / A-Level"},
    {value: "Becholars", name: "Becholars"},
    {value: "Masters", name: "Masters"},
    {value: "MBBS / BDS", name: "MBBS / BDS"},
    {value: "Pharm-D", name: "Pharm-D"},
    {value: "M-Phil", name: "M-Phil"},
    {value: "PHD / Doctrate", name: "PHD / Doctrate"},
    {value: "Certification", name: "Certification"},
    {value: "Diploma", name: "Diploma"},
    {value: "Short Course", name: "Short Course"},
  ];

  const careerArray = [
    {value: "Intern / Student", name: "Intern / Student"},
    {value: "Entry Level", name: "Entry Level"},
    {value: "Experienced Professional", name: "Experienced Professional"}, 
    {value: "Department Head", name: "Department Head"},
    {value: "GM / CEO / Country Head / President", name: "GM / CEO / Country Head / President"},
  ];

  const skillsList = [
    { title: 'Python'},
    { title: 'Java'},
    { title: 'JavaScript'},
    { title: 'Reactjs' },
    { title: 'Nodejs'},
    { title: "Graphics Designing"},
    { title: '.Net Framework'},
    { title: 'HTML'},
    { title: 'CSS'},
    { title: 'PHP Developer' },
    { title: 'Django'},
    { title: "Machine Learning"},
    { title: 'Image Processing'},
    { title: 'Data Entry'},
    { title: 'Dev Ops'},
    { title: 'Testing Engineer' },
    { title: 'Frontend Developer'},
    { title: "Backend Developer"},
    { title: 'Network Engineer'},
  ];

  const [skills, setSkills] = useState([skillsList[0].title]);
  const [jobTitles, setJobTitles] = useState([skillsList[0].title]);



  const emptyCheck = (
    title, project_URL, project_description, 
  ) => {

    // Add Project Fields
    if (isEmpty(title)){
      setError("Please fill Title Field")
      return false;
    }

    else if (isEmpty(project_URL)){
      setError("Please enter Project URL")
      return false;
    }
      
    else if (isEmpty(project_description)){
      setError("Please fill Project Description field")
      return false;
    }
    
    else{
        return true;
    }
  } 

  const handleChangeForCity = (event) => {
    setCity(event.target.value);
  };

  const handleChangeForExperience = (event) => {
    setExperience(event.target.value);
  };

  const handleChangeForCareer = (event) => {
    setCareerLevel(event.target.value);
  };
  const handleChangeForQualification = (event) => {
    setQualification(event.target.value);
  };

  const handleChangeForYear = (event) => {
    setYear(event.target.value);
  };
 

  const validityCheck = (
 
    title, project_URL, project_description, 
  
    ) => {

      

      if(!validateTitle(title)){
        setError("Title can't contain digits and should be of atleast 3 letters");
        return false;
      }

      else if(project_URL.length < 10){
        setError("Project URL is too short");
        return false;
      }

      else if (project_description.length < 20){
        setError("Project Description is too short :", project_description.length)
        return false;
      }
      else{
          return true;
      }
  }
  

  const onSubmit = async (data) =>{

    const title = data.title;
    const project_URL = data.project_URL;
    const project_description = data.project_description;
    
   

    const checkEmpty = emptyCheck(

      title, project_URL, project_description, 

      );

    if (checkEmpty){
  
      const checkValid = validityCheck(
        title, project_URL, project_description, 
        );
      console.log("The value of checkField", checkValid)
      if (checkValid){
        try {
          const res = await axios.patch('/user/update-project-by-projectId', {
            projectId : id,

            //Add Project
            title,
            project_URL, 
            project_description, 

          },{
            headers: {Authorization: token}
          })
          setError("")
          setSuccess(res.data.msg)
          } catch (err) {
            console.log(err)
            setError(err.response.data.msg)
          }
      }
    }
  }

    return (
      <div >
        <Container component="main" maxWidth="md" >
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Project
            </Typography>

            {error && !success && showErrorMessage(error)}
            {success && !error && showSuccessMessage(success)}
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={2}>

                
                        <Grid item xs={12} >
                            <TextField
                                {...register('title')}
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Title"
                                name="title"
                                autoComplete="Web Design"
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                {...register('project_URL')}
                                variant="outlined"
                                required
                                fullWidth
                                id="project_URL"
                                label="Project URL"
                                name="project_URL"
                                autoComplete="www.github.com"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                {...register("project_description")}
                                variant="outlined"
                                multiline
                                rows={10}
                                rowsMax={100}
                                required
                                fullWidth
                                id="project_description"
                                label="Project Description"
                                name="project_description"
                                autoComplete="This project will help us to learn JS"
                            />
                        </Grid> 

                    </Grid>
              
            


            

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Submit
              </Button>
              
              </form>
          </div>
          <Box mt={5}>
              <Copyright />
          </Box>
        </Container>
        
                
      </div>
   
  );
}