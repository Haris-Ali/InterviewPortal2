import React from 'react'
import Employees from './Employees'
import { makeStyles, CssBaseline, createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#333996",
        light: '#3c44b126'
      },
      secondary: {
        main: "#f83245",
        light: '#f8324526'
      },
      background: {
        default: "#f4f5fd"
      },
      
    },
    overrides:{
      MuiAppBar:{
        root:{
          transform:'translateZ(0)',
          
        }
      }
    },
    props:{
      MuiIconButton:{
        disableRipple:true
      }
    }
  })
  
  
  const useStyles = makeStyles({
    appMain: {
      width: '100%',
      display: 'flex',
      flexDirection : "column",
      justifyContent: "center",
    },
    container:{
      display: 'flex',
      flexDirection : "column",
      justifyContent: "center",
    }
  })
function Posts_Table() {
    const classes = useStyles();
    return (
        <> 
            <div className={classes.appMain}>
                <Employees />
            </div>
            <CssBaseline /> 
        </>
    
    )
}

export default Posts_Table
