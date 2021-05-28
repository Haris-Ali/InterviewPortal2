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
import { isEmail, isEmpty, validateAge, validateCeoName, validateCompanyName, validateInstitute, validatePhoneNumber, validateSalary, validateTitle, validateWorkHours } from '../utils/validation/Validation';
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
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';

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
    marginTop: "60px"
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

export default function Update_Interviewer({user, isAdmin, isLogged}) {

  const token = useSelector(state => state.token)
 
  const classes = useStyles();
  const classes_two = useStyles_two();
  const {id} = useParams()
  
  const {register, handleSubmit, control} = useForm();
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

 

  const [city, setCity] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [careerLevel, setCareerLevel] = React.useState('');
  const [qualification, setQualification] = React.useState('');


  const [year, setYear] = useState('')
  const [industry, setIndustry] = useState('')
  const [ownershipType, setOwnershipType] = useState('')
  const [origin, setOrigin] = useState('');
  const [operatingSince, setOperatingSince] = useState('');
  const [employeesNo, setEmployeesNo] = useState('')
  const [officesNo, setOfficesNo] = useState('')



  const dropdownOfficesNo = [
    {value: "1", name: "1"},
    {value: "2", name: "2"},
    {value: "3", name: "3"},
    {value: "4", name: "4"},
    {value: "5", name: "5"},
    {value: "6", name: "6"},
    {value: "7", name: "7"},
    {value: "8", name: "8"},
    {value: "9", name: "9"},
    {value: "10+", name: "10+"},
 ];
 
  const dropdownOperatingSince = [
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

  const dropdownIndustry = [
    {value: "Information Technology", name: "Information Technology"},
    {value: "Telecommunication / ISP", name: "Telecommunication / ISP"},
    {value: "Banking / Financial", name: "Banking / Financial"},
    {value: "Fast Moving Consumer Goods (FMCG)", name: "Fast Moving Consumer Goods (FMCG)"},
    {value: "Pharmaceuticals / Clinical Research", name: "Pharmaceuticals / Clinical Research"},
    {value: "Insurance / Takeful", name: "Insurance / Takeful"},
    {value: "Advertising / PR", name: "Advertising / PR"},
    {value: "Accounting / Taxation", name: "Accounting / Taxation"},
    {value: "Textiles / Garments", name: "Textiles / Garments"},
    {value: "Manufacturing", name: "Manufacturing"},
    {value: "Art / Entertainment", name: "Art / Entertainment"},
    {value: "Education / Training", name: "Education / Training"},
    {value: "Construction / Cement / Metals", name: "Construction / Cement / Metals"},
    {value: "Accounting / Petroleum", name: "Accounting / Petroleum"},
    {value: "Arts / Entertainment", name: "Arts / Entertainment"},
    {value: "Law Firms / Legal", name: "Law Firms / Legal"},
    {value: "Broadcasting", name: "Broadcasting"},
    {value: "Engineering", name: "Engineering"},
    {value: "Travel / Tourism", name: "Travel / Tourism"},
    {value: "Power / Energy", name: "Power / Energy"},
    {value: "Publishing / Printing", name: "Publishing / Printing"},
    {value: "Personal Care and Services", name: "Personal Care and Services"},
    {value: "Aviation", name: "Aviation"},
    {value: "Food and Beverages", name: "Food and Beverages"},
  ];

  const dropdownEmployeesNo = [
    {value: "1-10", name: "1-10"},
    {value: "11-50", name: "11-50"},
    {value: "51-100", name: "51-100"},
    {value: "101-200", name: "101-200"},
    {value: "Greater than 200", name: "Greater than 200"},
  ];

  const dropdownOwnershipType = [
    {value: "Sole Proprietorship", name: "Sole Proprietorship"},
    {value: "Public", name: "Public"},
    {value: "Private", name: "Private"},
    {value: "Government", name: "Government"},
    {value: "NGO", name: "NGO"}
  ];

  const dropdownOrigin = [
    {value: "Islamabad", name: "Islamabad"},
    {value: "Lahore", name: "Lahore"},
    {value: "Karachi", name: "Karachi"},
    {value: "Quetta", name: "Quetta"},
    {value: "Peshawar", name: "Peshawar"}
  ];

  const dropdownCity = [
    {value: "Islamabad", name: "Islamabad"},
    {value: "Lahore", name: "Lahore"},
    {value: "Karachi", name: "Karachi"},
    {value: "Quetta", name: "Quetta"},
    {value: "Peshawar", name: "Peshawar"}
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
    age, city, postal_address, phone_number,
    qualification, institute_name, year,
    
    company_name, ceo_name, industry,
    company_address, officesNo, company_description,
    ownershipType, origin, employeesNo,
    contact_email, contact_no, operatingSince
  ) => {
    
    if (isEmpty(age)){
      setError("Please fill Age Field")
      return false;
    }

    else if (isEmpty(city)){
      setError("Please fill City Field")
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
    else{
        return true;
    }
  } 

  const handleChangeForCity = (event) => {
    setCity(event.target.value);
  };

  const handleChangeForOwnershipType = (event) => {
    setOwnershipType(event.target.value);
  };

  const handleChangeForOrigin = (event) => {
    setOrigin(event.target.value);
  };

  const handleChangeForOperatingSince = (event) => {
    setOperatingSince(event.target.value);
  };

  const handleChangeForOfficesNo = (event) => {
    setOfficesNo(event.target.value);
  };

  const handleChangeForEmployeesNo = (event) => {
    setEmployeesNo(event.target.value);
  };

  const handleChangeForIndustry = (event) => {
    setIndustry(event.target.value);
  };
  const handleChangeForQualification = (event) => {
    setQualification(event.target.value);
  };

  const handleChangeForYear = (event) => {
    setYear(event.target.value);
  };

 
 

  const validityCheck = (
      age, postal_address, phone_number, 
      institute_name,
      company_name, ceo_name,company_address, company_description, contact_email, contact_no
    ) => {


      if (!validateAge(age) || (age < 18) || (age > 60)){
        setError("Age can be only be Numeric and must be within in 18-60 range")
        return false;
      }

      else if(postal_address.length < 10){
        setError("Postal Address is too short")
        return false;
      }

      else if(!validatePhoneNumber(phone_number)){
        setError("Invalid Phone Number Entered")
        return false;
      }

      //Education
      else if (!validateInstitute(institute_name)){
        setError("Invalid Institute name")
        return false;
      }

      else{
          return true;
      }
  }
  

  const onSubmit = async (data) =>{
    const age = data.age;
    const postal_address = data.postal_address;
    const phone_number = data.phone_number;  
    // console.log(age, city, postal_address, phone_number);
  
    //education
    const institute_name = data.institute_name;
    // console.log(qualification, institute_name, year);
   
    //company
    const company_name = data.company_name;
    const ceo_name = data.company_ceo_name;
    const company_address = data.company_address;
    const company_description = data.company_description;
    const contact_email = data.contact_email;
    const contact_no = data.contact_no;

    // console.log(
    //   company_name, ceo_name, industry,
    //   company_address, officesNo, company_description,
    //   ownershipType, origin, employeesNo,
    //   contact_email, contact_no, operatingSince
    //   )
    const checkEmpty = emptyCheck(
      age, city, postal_address, phone_number,
      qualification, institute_name, year,

      company_name, ceo_name, industry,
      company_address, officesNo, company_description,
      ownershipType, origin, employeesNo,
      contact_email, contact_no, operatingSince
      );

    if (checkEmpty){
  
      const checkValid = validityCheck(
        age, postal_address, phone_number, 
        institute_name,
        company_name, ceo_name,company_address, company_description, contact_email, contact_no
        );
      console.log("The value of checkField", checkValid)
      if (checkValid){
        const completion_year = year;
        
        try {
          const res = await axios.patch('/user/update-interviewer-by-userId', {
            userId : user._id,
            age,
            city,
            phone_number,
            postal_address,
        
            // Education
            qualification,
            institute_name,
            completion_year,
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
      <div >
        <Container component="main" maxWidth="md" >
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <CreateIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Update Information Information
            </Typography>

            {error && !success && showErrorMessage(error)}
            {success && !error && showSuccessMessage(success)}
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={2}>

                
                <Grid item xs={12} sm={3}>
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

                <Grid item xs={12} sm={9}>
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

                 <Grid item xs={12} >
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

                <Grid item xs={12} >
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