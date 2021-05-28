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

export default function Add_Candidate({user, isAdmin, isLogged}) {

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
    expected_salary, age, city, experience, careerLevel, postal_address, phone_number, skills, 
    qualification, institute_name, year,
    title, project_URL, project_description, 
    previous_jobs_salary, jobTitles
  ) => {
    
    if (isEmpty(expected_salary)){
      setError("Please fill Expected Salary Field")
      return false;
    }

    else if (isEmpty(age)){
      setError("Please fill Age Field")
      return false;
    }

    else if (isEmpty(city)){
      setError("Please fill City Field")
      return false;
    }
    
    else if (isEmpty(experience)){
      setError("Please fill Experience Field")
      return false;
    }
    else if (isEmpty(careerLevel)){
      setError("Please fill Career Level Field")
      return false;
    }
    else if (isEmpty(postal_address)){
      setError("Please fill Postal Address Field")
      return false;
    }
    else if (isEmpty(phone_number)){
      setError("Please fill Phone Number Field")
      return false;
    }

    else if (skills.length === 0 ) {
      setError("Please enter the Skills Acquired")
      return false;
    }

    // Education 
    else if (isEmpty(qualification)){
      setError("Please choose the required Qualification Level")
      return false;
    }

    else if (isEmpty(institute_name)){
      setError("Please enter your Institute Name")
      return false;
    }

    else if (isEmpty(year)){
      setError("Please enter the year of completion")
      return false;
    }

    // Add Project Fields
    else if (isEmpty(title)){
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
    
    

    // Job Preference
    else if (isEmpty(previous_jobs_salary)){
      setError("Please fill Previous Jobs Salary field")
      return false;
    }
  
    else if (jobTitles.length === 0 ) {
      setError("Please choose desired Job Titles")
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
    expected_salary, age, postal_address, phone_number, 
    institute_name,
    title, project_URL, project_description, 
    previous_jobs_salary
    ) => {

      if(!validateSalary(expected_salary)){
        setError("Salary can be only be Numeric and atleast of 3 digits")
        return false;
      }

      else if (!validateAge(age) || (age < 18) || (age > 60)){
        setError("Age can be only be Numeric and must be within in 18-60 range")
        return false;
      }

      else if(postal_address.length < 20){
        setError("Postal Address is too short")
        return false;
      }

      else if(!validatePhoneNumber(phone_number)){
        setError("Invalid Phone Number Entered")
        return false;
      }

      else if (!validateInstitute(institute_name)){
        setError("Invalid Institute Name")
        return false;
      }

      else if(!validateTitle(title)){
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

      else if(!validateSalary(previous_jobs_salary)){
        setError("Salary can be only be Numeric and atleast of 3 digits")
        return false;
      }
      else{
          return true;
      }
  }
  

  const onSubmit = async (data) =>{
    const expected_salary = data.expected_salary;
    const age = data.age;
    const postal_address = data.postal_address;
    const phone_number = data.phone_number;  
    // console.log(expected_salary, age, city, experience, careerLevel, postal_address, phone_number ,skills);
    
    const title = data.title;
    const project_URL = data.project_URL;
    const project_description = data.project_description;
    // console.log(title, project_URL, project_description);

    const institute_name = data.institute_name;
    // console.log(qualification, institute_name, year);

    const previous_jobs_salary = data.previous_jobs_salary;
    
   

    const checkEmpty = emptyCheck(
      expected_salary, age, city, experience, careerLevel, postal_address, phone_number, skills, 
      qualification, institute_name, year,
      title, project_URL, project_description, 
      previous_jobs_salary, jobTitles
      );

    if (checkEmpty){
  
      const checkValid = validityCheck(
        expected_salary, age, postal_address, phone_number, 
        institute_name,
        title, project_URL, project_description, 
        previous_jobs_salary
        );
      console.log("The value of checkField", checkValid)
      if (checkValid){
        const completion_year = year;
        const desired_job_titles = jobTitles;
        const career_level = careerLevel;
        try {
          const res = await axios.patch('/user/add-candidate-by-userId', {
            userId : user._id,
            expected_salary,
            age,
            city,
            experience,           
            career_level,
            postal_address,
            phone_number,
            skills,
            
            // Education
            qualification,
            institute_name,
            completion_year,


            //Add Project
            title,
            project_URL, 
            project_description, 

            // Job Preference
            previous_jobs_salary, 
            desired_job_titles
          })
          setError("")
          setSuccess(res.data.msg)
          } catch (err) {
            setError(err)
          }
      }
    }
  }

    return (
      <div className = "edit__interview__posts">
        <Container component="main" maxWidth="md" >
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Complete Your Information
            </Typography>

            {error && !success && showErrorMessage(error)}
            {success && !error && showSuccessMessage(success)}
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={2}>

                <Grid item xs={12} sm={5}>
                    <TextField
                        {...register('expected_salary')}
                        autoComplete="0"
                        name="expected_salary"
                        variant="outlined"
                        required
                        fullWidth
                        id="expected_salary"
                        label="Expected Salary"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <h3>$</h3>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        {...register('age')}
                        autoComplete="16"
                        name="age"
                        variant="outlined"
                        required
                        fullWidth
                        id="age"
                        label="Age"
                        autoFocus
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes_two.formControl}>
                    <InputLabel id="city"> City* </InputLabel>
                    <Select
                        labelId="city"
                        id="demo-simple-select-outlined"
                        value={city}
                        onChange={handleChangeForCity}
                        label="City"
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

                 <Grid item xs={12}>
                    <TextField
                        {...register('postal_address')}
                        autoComplete="0"
                        name="postal_address"
                        variant="outlined"
                        required
                        fullWidth
                        id="postal_address"
                        label="Postal Address"
                        autoFocus
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        {...register('phone_number')}
                        autoComplete="0"
                        name="phone_number"
                        variant="outlined"
                        required
                        fullWidth
                        id="phone_number"
                        label="Phone Number"
                        autoFocus
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
                        <TextField {...params}  variant="outlined" label="Skills Acquired*" placeholder="" />
                        )}
                    />       
                    </FormControl>
                </Grid> 
            
            </Grid>


            <Container component="main" maxWidth="md" >
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <WorkOutlinedIcon />
                    </Avatar>
                     
                    <Typography className = "typography__form__control" component="h1" variant="h5">
                        Education
                    </Typography>

                    <Grid container spacing={2}>
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
                        
                        <Grid item xs={12} >
                            <TextField
                                {...register('institute_name')}
                                variant="outlined"
                                required
                                fullWidth
                                id="institute_name"
                                label="Institute Name"
                                name="institute_name"
                                autoComplete="FAST University"
                            />
                        </Grid>

                        <Grid item xs={12}>
                        <FormControl variant="outlined" className={classes_two.formControl}>
                          <InputLabel id="completion_year"> Completion Year* </InputLabel>
                          <Select
                            labelId="completion_year"
                            id="demo-simple-select-outlined"
                            value={year}
                            onChange={handleChangeForYear}
                            label="Completion Year*"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {yearsArray.map(year => {
                              return(
                                <MenuItem value={year.value}>{year.name}</MenuItem>
                              )
                            })             
                            }
                          </Select>
                        </FormControl>
                      </Grid>                                          

                    </Grid>
                </div>
            </Container>

            <Container component="main" maxWidth="md" >
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <WorkOutlinedIcon />
                    </Avatar>
                     
                    <Typography className = "typography__form__control" component="h1" variant="h5">
                        Add Project
                    </Typography>

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
                </div>
            </Container>


            <Container component="main" maxWidth="md" >
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <WorkOutlinedIcon />
                    </Avatar>
                     
                    <Typography className = "typography__form__control" component="h1" variant="h5">
                        Job Preference
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                {...register('previous_jobs_salary')}
                                autoComplete="0"
                                name="previous_jobs_salary"
                                variant="outlined"
                                required
                                fullWidth
                                id="previous_jobs_salary"
                                label="Previous job Salary"
                                autoFocus
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
                                onChange={(e, attr) => setJobTitles(attr)}
                                freeSolo
                                filterSelectedOptions
                                renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                                }
                                renderInput={(params) => (
                                <TextField {...params}  variant="outlined" label="Desired Job Titles*" placeholder="" />
                                )}
                            />       
                            </FormControl>
                        </Grid>  
                    </Grid>
                </div>
            </Container>

              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Update Information
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