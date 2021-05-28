import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import axios from 'axios';
import moment from "moment";   
import {Link, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Loader from "react-loader-spinner";
import Loading from '../Loading';

import "../../componentsStyles/Admin_Quiz_Table.css"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { showErrorMessage, showSuccessMessage } from '../utils/notification/Notification';

import { useForm, Controller } from "react-hook-form"

 function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>




      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}




function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'candidateEmail', numeric: false, disablePadding: true, label: 'Candidate Email' },
  { id: 'pin', numeric: true, disablePadding: false, label: 'Pin' },
  { id: 'startTime', numeric: true, disablePadding: false, label: 'Starting Time' },
  { id: 'startDate', numeric: true, disablePadding: false, label: 'Meeting Date' },
  { id: 'expiryTime', numeric: true, disablePadding: false, label: 'Expiry Time' },
  { id: 'expiryDate', numeric: true, disablePadding: false, label: 'Expiry Date' },
  { id: 'actions', numeric: true, disablePadding: false, label: "Actions" },
];
function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
           >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              className = {"table__header__mui"}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
      })}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Your Scheduled Meetings
      </Typography>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    left: '30%',
    margin: 'auto',
    border: '5px',
    padding: '10px',
    marginRight: "410px"
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  loader :{
    position: "relative !important",
    top : "20px !important"
  }
}));


export default function Interviewer_Schedule_Meeting_Table({user, meetingsReceived}) {
  
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('pin');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const [meetings, setMeetings] = useState([]);


  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const token = useSelector(state => state.token) 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [errorDialog, setErrorDialog] = useState("");
  const [successDialog, setSuccessDialog] = useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState('')
  const check = value.length >= 6;
  const [meetingId, setMeetingId] = useState("");
  const {register, handleSubmit} = useForm();
  const history = useHistory();
  const handleRequestSort = (event) => {
    const isAsc =  order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
  };


  const handleClick = (event, meetingID) => {
    const selectedIndex = selected.indexOf(meetingID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, meetingID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    
    setSelected(newSelected);
    console.log("selected now = ",selected)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, meetings?.length - page * rowsPerPage);
  
  
 
  
 
  

  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("firstlogin"),
    },
  };

  const getMeetings = async () =>{
    setLoading(true)
    axios
      .post("/user/get-meetings", {userId: user?._id}, options)
      .then((res) => {
        setMeetings(res.data);
        // console.log("Meetings res data",res.data)
        setLoading(false)
      })
      .catch((err) => {
        if (!localStorage.getItem("firstlogin")){
          // history.push("/");
        } 
        else alert("couldn't fetch please reload");
      });     
   }

  const userToCheck = user._id;

  useEffect(() => {
    getMeetings();
  }, [refresh]);

  useEffect(()=>{ 
    setSuccess('')
    setError('')
    setSuccessDialog('')
    setErrorDialog('')
  },[open]);

  const handleClickOpen = async (meeting) => {
    setMeetingId(meeting?._id);
    setOpen(true);
    // try {
    
    //   console.log("handle edit meeting: ",meeting);       
    //   const fullDateNow = new Date(Date.now());

    //   // moment(meeting?.start_date, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')
    //   const sd = moment(meeting?.start_date, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')
    //   const cd = moment(fullDateNow, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')
    //   const ed = moment(meeting?.expiry_date, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')

    //   console.log("ending date :",ed)
    //   console.log("current date :",cd)
    //   console.log("starting date :",sd)
    //   if(cd < sd){
    //     setSuccess("")
    //     setError(" You can't Start meeting before allocated day!")
    //     console.log("Meeting can't be started today")
    //   }
    //   if( cd > ed){
    //     setSuccess("")
    //     setError("Meeting has expired")
    //     console.log("Meeting has expired")
    //   }
    //   if((cd <= ed) && (cd >= sd)){

    //     const StringSDate = meeting.start_date.toString();
    //     const startDate = new Date(meeting?.start_date).getDate();
    //     const startTimeHours = new Date(meeting?.start_time).getHours();
    //     const startTimeMins = new Date(meeting?.start_time).getMinutes();
    //     const startTimeSecs = new Date(meeting?.start_time).getSeconds();
    //     const newsd = new Date(StringSDate);
    //     newsd.setDate(startDate);

    //     const StringEDate = meeting.expiry_date.toString();
    //     const expiryDate = new Date(meeting?.expiry_date).getDate();
    //     const expiryTimeHours = new Date(meeting?.expiry_time).getHours();
    //     const expiryTimeMins = new Date(meeting?.expiry_time).getMinutes();
    //     const expiryTimeSecs = new Date(meeting?.expiry_time).getSeconds();
    //     const newed = new Date(StringEDate);
    //     newed.setDate(expiryDate);
        
        
    //     //stating HH to hh will give you 12h format
    //     const st = moment(newsd).set({h: startTimeHours, m: startTimeMins, s: startTimeSecs}).format('DD-MM-YYYY HH:mm:ss')
    //     const ct = moment(fullDateNow).format('DD-MM-YYYY HH:mm:ss');
    //     const et = moment(newed).set({h: expiryTimeHours, m: expiryTimeMins, s: expiryTimeSecs}).format('DD-MM-YYYY HH:mm:ss')
     

    //     console.log("Starting Time Date", st)
    //     console.log("Current Time Date", ct)
    //     console.log("Expiry Time Date", et)

    //     if ((ct <= et) && (ct >= st)){
    //       setError("")
    //       setSuccess("Starting Meeting..")
    //       setMeetingId(meeting?._id);
    //       setOpen(true);
    //       console.log("Meeting Started");
    //     }
        
    //     else{
    //       setSuccess("")
    //       setError("Meeting can't be joined")
    //       console.log("Meeting can't be joined");
    //     }
    //   }
      
      
    // } catch (err) {
    //     alert(err)
    // }
    
  };


  const onSubmit = async (e) =>{
    await axios.post("/user/compare-password-by-meetingId",{meetingId, password: value, user}).then((res)=>{
        console.log(res.data)
        if(res.data.msg === true){
          setSuccessDialog("Password is correct")
          console.log(successDialog)
          setErrorDialog("")
          setError("")
          setSuccess("Starting Meeting...")
          history.push(`/meetings/join-room/${meetingId}`)
        }
        
    }).catch((err) => {
      setSuccessDialog("");
      setErrorDialog(err.response.data.msg)
    });
   
    
}



  const handleClose = () => {
      setSuccessDialog("")
      setErrorDialog("")
      setValue('');
      setOpen(false);
  };

 

 
  const handleDelete = async (id) => {
    try {       
        if(window.confirm("Are you sure you want to delete this quiz?")){
            setLoading(true)
            await axios.delete(`/user/delete-meeting/${id}`, {
                headers: {Authorization: token}
            })
        }     
        setRefresh(!refresh)   
        setLoading(false)
    } catch (err) {
        alert(err.response.data.msg)
    }
  }

  return (

    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form noValidate onSubmit={handleSubmit(onSubmit)} >
      
          {errorDialog && !successDialog && showErrorMessage(errorDialog)}
          {successDialog && !errorDialog && showSuccessMessage(successDialog)}

          <DialogTitle id="form-dialog-title">Enter Meeting Password</DialogTitle>
          <DialogContent>
          <DialogContentText>
              Please enter password to enter into the meeting. 
              You won't be able to join meeting, 
              if you fail to enter correct password.
              We are sorry for inconvenience but this
              step exists to ensure your privacy and security.
          </DialogContentText>
          <TextField
            {...register('password')}
            autoComplete="0"
            name="password"
            variant="outlined"
            required
            fullWidth
            id="password"
            label="Password"
            type = "password"
            autoFocus
            onChange = {e =>  setValue(e.target.value)}
          />
        
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
                  Cancel
              </Button>
              <Button disabled ={!check} color="primary" type="submit" >
                  Send
              </Button>
          </DialogActions>          
          </form>
      </Dialog>

      <div className={classes.root}>
        {error && !success && showErrorMessage(error)}
        {success && !error && showSuccessMessage(success)}
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={meetings?.length}
            />
              {loading && Loading }
              {loading === false && ( <TableBody>
                {stableSort(meetings, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((meeting, index) => {
                    const isItemSelected = isSelected(meeting?._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (   
                      <TableRow
                        hover
                        role="checkbox"  
                        tabIndex={-1}
                        key={meeting._id}    
                      >
                      <TableCell padding="checkbox">
                        <h1></h1>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                          {meeting?.candidate_user_email}
                      </TableCell>
                        <TableCell align="right">{meeting?.pin}</TableCell>

                        <TableCell align="right">{moment(meeting?.start_time).format('HH:mm')}</TableCell>
                        <TableCell align="right">{moment(meeting?.start_date, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')}</TableCell>
                        
                        <TableCell align="right">{moment(meeting?.expiry_time).format('HH:mm')}</TableCell>
                        <TableCell align="right">{moment(meeting?.expiry_date, 'YYYY-MM-DD').format('MM-DD-YYYY')}</TableCell>

                        <TableCell align="right">
                          <Link
                            to = {`/meetings/update-schedule-meeting/${meeting?._id}`}
                          >
                            <i className="fas fa-edit  quiz__font__icons quiz__font__first__icon" title="Edit"  ></i>
                          </Link>                    
                         
                          <i className="fas fa-trash-alt quiz__font__icons" title="Remove" onClick={() => handleDelete(meeting?._id)} ></i>
                          
                          
{/*                           <i class="fa fa-phone quiz__font__icons" aria-hidden="true" onClick={() => handleEdit(meeting)}></i>
 */}                         
                          <i class="fa fa-phone quiz__font__icons" aria-hidden="true" onClick={() => handleClickOpen(meeting)}></i>

                          
   
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      
                      </TableRow> 
                      
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody> )}
              
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={meetings?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>  
    </>
    
  );
}