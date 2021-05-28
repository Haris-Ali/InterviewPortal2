import React from 'react'
import './notification.css'
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

export const showErrMsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

export const showSuccessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
}

export const showErrorMessage = (msg) => {
    return(
        <SnackbarContent
        message={
            <span> {msg} </span>
        } 
        color="danger"
      />
    )
}

export const showSuccessMessage = (msg) => {
    return(
        <SnackbarContent
        message={
            <span> {msg} </span>
        } 
        color="success"
      />
    )
}