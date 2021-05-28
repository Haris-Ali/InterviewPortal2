import React, { useState, useEffect } from 'react';
import 'date-fns';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import CreateIcon from '@material-ui/icons/Create';
import Typography from '@material-ui/core/Typography';

import { makeStyles, withTheme } from '@material-ui/core/styles';
import {useParams, useHistory} from 'react-router-dom'
import Container from '@material-ui/core/Container';
import '../Make_Interview_Post.js/Get_Interview_Posts.css'

import { useForm, Controller } from "react-hook-form"
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';
import { isEmpty, isEmail, validateTitle, validateWorkHours, validatePin, validatePassword } from '../utils/validation/Validation';
import axios from 'axios';
import { useSelector } from 'react-redux';

import FormControl from '@material-ui/core/FormControl';


import DateFnsUtils from '@date-io/date-fns';

import MomentUtils from '@date-io/moment';


import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';

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

export default function Update_Interviewer_Schedule_Meeting({user, isAdmin, isLogged}) {
  const {id} = useParams();
  const token = useSelector(state => state.token)
  const classes = useStyles();
  const classes_two = useStyles_two();
  const {register, handleSubmit, control} = useForm();
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [expiryDate, setExpiryDate] = useState();
  const [expiryTime, setExpiryTime] = useState();

  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [startTime, setStartTime] = useState(new Date(Date.now()));
 


  const emptyCheck = ( test_pin, candidate_email, startDate, startTime, expiryDate, expiryTime, password) => {

    
    if (isEmpty(test_pin)){
      setError("Please fill Quiz Pin Field")
      return false;
    }
    

    else if (isEmpty(candidate_email)){
      setError("Please fill Email field")
      return false;

    }
    else if (!startDate){
      setError("Please choose Start Date")
      return false;
    }

    else if (!startTime){
      setError("Please choose Start Time")
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
    else if (isEmpty(password)){
      setError("Please fill password field")
      return false;

    }
    else{
        return true;
    }
  } 
  const handleDateChange = (date) => {
    setExpiryDate(date);
  };

  const handleTimeChange = (time) => {
    setExpiryTime(time);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
  };


  const validityCheck = (test_pin, candidate_email,password) =>{

    if(!validatePin(test_pin)){
        setError("Test Pin can be minimun of length 4 and should be numeric only")
        return false;
    }
    else if(!isEmail(candidate_email)){
        setError("Invalid Email")
        return false;
    }
    else if(!validatePassword(password)){
      setError("Password should be minimum of length 6 with atleast 1 upper case, lower case letters with 1 ASCII character and number each.")
      return false;
    }

    else{
        return true;
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

   
    const test_pin = data.test_pin;
    
    const candidate_email = data.candidate_email;
    const userId = user?._id;
    const password = data.password;
    console.log("Expiry Date:",expiryDate)
    console.log("Expiry Time", expiryTime)

    const checkEmpty = emptyCheck(test_pin, candidate_email, startDate, startTime, expiryDate, expiryTime, password);
    if(checkEmpty){
      const checkValid = validityCheck(test_pin, candidate_email, password);
      if (checkValid){
          console.log("Date before", startDate);
          ;

          try{
            const res = await axios.patch('/user/update-meeting-by-meetingId', {
              meetingId: id, userId, pin: test_pin,  candidate_user_email: candidate_email, 

              start_date: startDate, start_time: startTime,
              expiry_date: expiryDate, expiry_time: expiryTime,
              password
              // start_date, start_time, 
              // expiry_date, expiry_time 
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
      <div >
        <Container component="main" maxWidth="md" >
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Update Meeting
            </Typography>

            {error && !success && showErrorMessage(error)}
            {success && !error && showSuccessMessage(success)}
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={2}>

              <Grid item xs={12} >
              <TextField
                  {...register('test_pin')}
                  variant="outlined"
                  required
                  fullWidth
                  id="test_pin"
                  label="Quiz Pin"
                  name="test_pin"
                  autoComplete="Web Design"
              />
              </Grid>
              
              <Grid item xs={12} >
                <TextField
                    {...register('candidate_email')}
                    autoComplete="0"
                    name="candidate_email"
                    variant="outlined"
                    required
                    fullWidth
                    id="candidate_email"
                    label="Candidate Email"
                    autoFocus
                />
              </Grid>
              
       

              <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" className={classes_two.formControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="Meeting Day"
                    label="Meeting Day"
                    format="MM/dd/yyyy"
                    value={startDate}
                    onChange={handleStartDateChange}
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
                    id="Starting Time"
                    label="Starting Time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>     
              </FormControl>
            </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes_two.formControl}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="Expiry Date"
                      label="Expiry Date"
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

                <Grid item xs={12} >
                  <TextField
                      {...register('password')}
                      autoComplete="0"
                      name="password"
                      variant="outlined"
                      required
                      fullWidth
                      id="password"
                      label="Set Meeting joining Password"
                      type = "password"
                      autoFocus
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
                Update
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