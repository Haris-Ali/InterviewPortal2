import React, { useEffect, useState } from 'react'
import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import Email from "@material-ui/icons/Email";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import PictureUpload from "../CustomUpload/PictureUpload.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";



function Step_1({interviewer}) {
  const [user, setUser] = useState({interviewer})
  const [age, setAge] = useState(21)
  const {f_name, l_name, number} = user
  
  const handleChangeInput = (name = "f_name", value = "hamza") => {
      // const {name, value} = e.target
      setUser({...user, [name]:value, err: '', success: ''})
      console.log(name + value)
  }
  // const changeValue = () =>{
  //   handleChangeInput("f_name", "Hamza")
  // }
  useEffect(()=>{
    console.log("Age : ",age)
  },[age])
  // const changeNumber = () =>{
  //   setNumber(number1 + 1)
  // }

  const changeAge = async () => {
    setAge(age + 1)
  }
  const style = {
    infoText: {
      fontWeight: "300",
      margin: "10px 0 30px",
      textAlign: "center"
    },
    inputAdornmentIcon: {
      color: "#555"
    },
    inputAdornment: {
      position: "relative"
    }
  };
  return (
    <div>
      <button onChange = {changeAge}> Intial age: {age} </button>
    </div>
  )
}

export default Step_1

