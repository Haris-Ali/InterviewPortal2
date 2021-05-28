import React, { useState, useEffect } from 'react';
import 'date-fns';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import CreateIcon from '@material-ui/icons/Create';
import Typography from '@material-ui/core/Typography';

import { makeStyles, withTheme } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import './Get_Interview_Posts.css'

import { useForm, Controller } from "react-hook-form"
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import { isEmpty, validateSalary, validateTitle, validateWorkHours } from '../utils/validation/Validation';
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
import moment from "moment";   

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

export default function Make_Interview_Posts({user, isAdmin, isLogged}) {
  
  const token = useSelector(state => state.token)
  const classes = useStyles();
  const classes_two = useStyles_two();
  const {register, handleSubmit, control} = useForm();
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [picToSend, setPicToSend] = useState("");
  
  const [location, setLocation] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [careerLevel, setCareerLevel] = React.useState('');
  const [qualification, setQualification] = React.useState('');
  const [expiryDate, setExpiryDate] = useState();
  const [expiryTime, setExpiryTime] = useState();
  const dropdownCity = [
    {value: "Islamabad", name: "Islamabad"},
    {value: "Lahore", name: "Lahore"},
    {value: "Karachi", name: "Karachi"},
    {value: "Quetta", name: "Quetta"},
    {value: "Peshawar", name: "Peshawar"}
  ];

  const expArray = [
    {value: "3 Years", name: "3 Years"},
    {value: "5 Years", name: "5 Years"},
    {value: "7 Years", name: "7 Years"},
    {value: "8 Years", name: "8 Years"},
    {value: "9 Years or more", name: "9 Years or more"},
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

  const emptyCheck = (salary,  work_hours, title, job_description, post_picture, skills, location, experience, qualification, careerLevel, expiryDate, expiryTime) => {

    
    if (isEmpty(title)){
      setError("Please fill Title Field")
      return false;
    }
      
    else if (isEmpty(job_description)){
      setError("Please fill Job Description field")
      return false;
    }
    else if (skills.length === 0 ) {
      setError("Please enter the Skills required")
      return false;
    }

    else if (isEmpty(salary)){
      setError("Please fill Salary field")
      return false;
    }
  
    else if (isEmpty(work_hours)){
      setError("Please fill Work Hours' field")
      return false;
    }

    else if (isEmpty(location)){
      setError("Please enter the Location")
      return false;
    }

    else if (isEmpty(experience)){
      setError("Please choose the required Experience")
      return false;
    }

    else if (isEmpty(qualification)){
      setError("Please choose the required Qualification Level")
      return false;
    }
    else if (isEmpty(careerLevel)){
      setError("Please choose the required Career Level")
      return false;
    }
    else if (!expiryDate){
      setError("Please choose Expiry Date")
      return false;
    }
    else if (!expiryTime){
      setError("Please choose Expiry Time")
      return false;
    }
    else if (!(post_picture)){
      setError("Please Upload Picture")
      return false;
    }
    else{
        return true;
    }
  } 

  const handleChange = (event) => {
    setLocation(event.target.value);
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

  const handleDateChange = (date) => {
    setExpiryDate(date);
  };

  const handleTimeChange = (time) => {
    // let new_time = moment(time).format('HH.mm')
    setExpiryTime(time);
  };


  const validityCheck = (title, job_description, salary, work_hours,  post_picture) =>{

      if(!validateTitle(title)){
        setError("Title can't contain digits and should be of atleast 3 letters")
        return false;
      }
      
      else if (job_description.length < 20){
        setError("Job Description is too short")
        return false;
      }

      else if(!validateSalary(salary)){
        setError("Salary can be only be Numeric and atleast of 3 digis")
        return false;
      }

      else if(!validateWorkHours(work_hours)){
        setError("Invalid Work Hours")
        return false;
      }

     
      else if(post_picture.type !== 'image/jpeg' && post_picture.type !== 'image/png' && post_picture.type !== 'image/jpg'){
        setError("Invalid File Format")
        return false
      }
      else{
          return true;
      }
  }
  const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
            console.log("changeAvatar = ", file)
            if(!file) return setError("No files were uploaded.")
            

            if(file.size > 1024 * 1024)
                return setError("Size too large.")
                
            if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg')
                return setError("File format is incorrect.")
                
            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_post_picture', formData, {
                headers: {Authorization: token}
            })

            setLoading(false)
            setPicToSend(res.data.url)
            
        } catch (err) {
            setError(err.response.data.msg)
        }
  }

  const onSubmit = async (data) =>{
    // console.log("Skills field ",skills)
    // console.log("location field ",location)
    // console.log("experience field ",experience)
    // console.log("qualification field ",qualification)
    // console.log("career level", careerLevel)
    // let new_expiry_time = moment(expiryTime).format('HH.mm')
    // var responseDate = moment(expiryTime).format('DD/MM/YYYY');

   
    const title = data.title;
    const job_description = data.job_description;
    const salary = data.salary;
    const userId = user?._id;
    let post_picture = data.picture[0];
    const work_hours = data.hours;
    const checkEmpty = emptyCheck(salary, work_hours, title, job_description, post_picture, skills, location, experience, qualification, careerLevel, expiryDate, expiryTime);
    if(checkEmpty){
      const checkValid = validityCheck(title, job_description, salary, work_hours,  post_picture);
      if (checkValid){
          post_picture = picToSend;
          try{
            const res = await axios.post('/user/add-post', {
            userId, salary, title, job_description, post_picture, work_hours, skills, location, experience, qualification, careerLevel, expiryDate, expiryTime
            })
            setError("")
            setSuccess(res.data.msg)
          } catch (err) {
            setError(err.response.data.msg)
          }
      }
    }
  }

  return (
      <div className = "make__interview__posts">
        <Container component="main" maxWidth="md" >
        <CssBaseline />
        <div className={classes.paper}>
            <img src="https://res.cloudinary.com/xapper72/image/upload/v1619373955/avatar/job-post-default_bu5cbs.jpg" className = "get_posts.image" />
            <Avatar className={classes.avatar}>
            <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Create Job Posts
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
              <Grid item xs={12}>
              <TextField
                  {...register("job_description")}
                  variant="outlined"
                  multiline
                  rows={10}
                  rowsMax={100}
                  required
                  fullWidth
                  id="job_description"
                  label="Job Description"
                  name="job_description"
                  autoComplete="We require a frontend web designer"
              />
              </Grid> 


              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <Autocomplete
                    limitTags={3}
                    multiple
                    id="tags-outlined"
                    options={skillsList.map((option) => option.title)}
                    defaultValue={[skillsList[0].title]}
                    onChange={(e, attr) => setSkills(attr)}
                    freeSolo
                    filterSelectedOptions
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params}  variant="outlined" label="Skills Required*" placeholder="" />
                    )}
                  />       
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                    {...register('salary')}
                    autoComplete="0"
                    name="salary"
                    variant="outlined"
                    required
                    fullWidth
                    id="salary"
                    label="Salary"
                    autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <h3>$</h3>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                    {...register('hours')}
                    autoComplete="5"
                    name="hours"
                    variant="outlined"
                    required
                    fullWidth
                    id="hours"
                    label="Work Hours"
                    autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <InputLabel id="job_location"> Job Location* </InputLabel>
                  <Select
                    labelId="job_location"
                    id="demo-simple-select-outlined"
                    value={location}
                    onChange={handleChange}
                    label="job_location"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {dropdownCity.map(city => {
                      return(
                        <MenuItem value={city.value}>{city.name}</MenuItem>
                      )
                    })             
                    }      
                  </Select>
                </FormControl>
              </Grid>
                      
                <Grid item xs={12}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <InputLabel id="experience"> Experience* </InputLabel>
                  <Select
                    labelId="experience"
                    id="demo-simple-select-outlined"
                    value={experience}
                    onChange={handleChangeForExperience}
                    label="Experience*"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {expArray.map(exp => {
                      return(
                        <MenuItem value={exp.value}>{exp.name}</MenuItem>
                      )
                    })             
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
              <FormControl variant="outlined" className={classes_two.formControl}>
                <InputLabel id="qualification"> Qualification* </InputLabel>
                <Select
                  labelId="qualification"
                  id="demo-simple-select-outlined"
                  value={qualification}
                  onChange={handleChangeForQualification}
                  label="Qualification*"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {qualificationArray.map(qa => {
                    return(
                      <MenuItem value={qa.value}>{qa.name}</MenuItem>
                    )
                  })             
                  }
                </Select>
              </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <InputLabel id="career-level"> Career Level* </InputLabel>
                  <Select
                    labelId="career-level"
                    id="demo-simple-select-outlined"
                    value={careerLevel}
                    onChange={handleChangeForCareer}
                    label="Career Level*"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {careerArray.map(cl => {
                      return(
                        <MenuItem value={cl.value}>{cl.name}</MenuItem>
                      )
                    })             
                    }
                  </Select>
                </FormControl>
              </Grid>         

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="Last Date for Registration"
                      label="Last Date for Registration"
                      format="MM/dd/yyyy"
                      value={expiryDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />         
                  </MuiPickersUtilsProvider>
                           
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="Closing Time"
                      label="Closing Time"
                      value={expiryTime}
                      onChange={handleTimeChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>     
                </FormControl>
              </Grid>   

              <Grid item xs={12} sm={6}>
             
                  {loading ? (
                      <> 
                      <h4> Uploading Picture </h4>
                      <Loader
                          className= "file__loader"
                          type="Puff"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          timeout={95000} //95 secs
                      />
                      </>
                  ):(
                      null
                  ) 
              }
              <h4> Post Picture </h4>
              <input required type="file" {...register("picture") } name = "picture" id = "picture" onChange={changeAvatar}/>
              </Grid>
                  
              </Grid>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Create Post
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