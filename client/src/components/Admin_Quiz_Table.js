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
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Loader from "react-loader-spinner";
import Loading from './Loading';

import "../componentsStyles/Admin_Quiz_Table.css"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Modal from "react-modal";
import modalstyles from "../componentsStyles/Modal.module.css";

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
  { id: 'topic', numeric: false, disablePadding: true, label: 'Topic' },
  { id: 'pin', numeric: true, disablePadding: false, label: 'Pin' },
  { id: 'NoOfQues', numeric: true, disablePadding: false, label: 'No of Questions' },
  { id: 'timeDuration', numeric: true, disablePadding: false, label: 'Time Duration(Mins)' },
  { id: 'expiry', numeric: true, disablePadding: false, label: "Expiry" },
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
        Quiz History
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


export default function Admin_Quiz_Table({user, testsReceived}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('pin');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [amount, setamount] = useState("");
  const [time, settime] = useState("");
  const [expiry, setexpiry] = useState(new Date());
  const [tests, setTests] = useState([]);
  const [posts, setPosts] = useState([])
  const [topic, settopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const token = useSelector(state => state.token) 
  const [testIdToEdit, setTestIdToEdit] = useState("");

  const LoadingMiniSpinner = () => {
    return (  
        <Loader className= {classes.loader} type="TailSpin" color="#00BFFF" height={100} width={100}/>
    )
  }
  const handleRequestSort = (event) => {
    const isAsc =  order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
  };


  const handleClick = (event, testID) => {
    const selectedIndex = selected.indexOf(testID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, testID);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, tests?.length - page * rowsPerPage);
  
  
  

  const topics = [
    { id: 1, name: "<--select category-->" },
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
    { id: 11, name: "Entertainment: Film" },
    { id: 12, name: "Entertainment: Music" },
    { id: 13, name: "Entertainment: Musicals & Theatres" },
    { id: 14, name: "Entertainment: Television" },
    { id: 15, name: "Entertainment: Video Games" },
    { id: 16, name: "Entertainment: Board Games" },
    { id: 17, name: "Science & Nature" },
    { id: 18, name: "Science: Computers" },
    { id: 19, name: "Science: Mathematics" },
    { id: 20, name: "Mythology" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Politics" },
    { id: 25, name: "Art" },
    { id: 26, name: "Celebrities" },
    { id: 27, name: "Animals" },
    { id: 28, name: "Vehicles" },
    { id: 29, name: "Entertainment: Comics" },
    { id: 30, name: "Science: Gadgets" },
    { id: 31, name: "Entertainment: Japanese Anime & Manga" },
    { id: 32, name: "Entertainment: Cartoon & Animations" },
  ];
  
 
  

  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("firstlogin"),
    },
  };

  const getQuiz = async () =>{
    setLoading(true)
    axios
      .post("/user/gettest", {email: user?.email}, options)
      .then((res) => {
        for (let x of res.data) {
          for (let y of topics) {
            if (y["id"] == x["topic"]) x.topicname = y["name"];
          }
        }    
        setTests(res.data);
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
    getQuiz()
  }, [refresh, modalIsOpen]);

  useEffect(()=>{

  }, [modalIsOpen])

  const handleEdit = async (id) => {
    try {
      console.log("handle edit test id: ",id);       
      setTestIdToEdit(id);
      setmodalIsOpen(true);
        
    } catch (err) {
        alert(err.response.data.msg)
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    const email = user?.email;
    const pin = 100;
    console.log({
      email, topic, amount, time, expiry, created: new Date() })
    try {
      const res = await axios.patch("/user/edit-test-via-testId", {
       testId: testIdToEdit, email, topic, amount, time, expiry, created: new Date() }
      )
      console.log("added");
      setRefresh(!refresh) 
      setmodalIsOpen(false);
      
    } catch (error) {
      console.log("error : " ,error.response.data.msg);
      alert(error.response.data.msg);
    }
    
  };
  const handleDelete = async (id) => {
    try {       
        if(window.confirm("Are you sure you want to delete this quiz?")){
            setLoading(true)
            await axios.delete(`/user/delete-test/${id}`, {
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        className={modalstyles.modal}
        overlayClassName={modalstyles.overlay}
        >
        <Fragment className= "dashboard__fragment">
          <h1 className={modalstyles.heading}>Edit Test</h1>
          <form onSubmit={onSubmit}>
            <label className={modalstyles.labels} htmlFor="topic">
              Topic:
            </label>
            <select
              id="topic"
              name="topic"
              className={modalstyles.inputs}
              onChange={(e) => settopic(e.target.value.toString())}
            >
              {topics.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
            <br />
            <label className={modalstyles.labels} htmlFor="amount">
              Number of Questions:
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              className={modalstyles.inputs}
              onChange={(e) => setamount(e.target.value)}
            />
            <br />
            <label className={modalstyles.labels} htmlFor="time">
              Time Duration (Mins):
            </label>
            <input
              type="text"
              id="time"
              name="time"
              className={modalstyles.inputs}
              onChange={(e) => settime(e.target.value)}
            />
            <br />
            <label className={modalstyles.labels} htmlFor="expiry">
              Expiry:
            </label>
            <input
              type="date"
              id="expiry"
              name="expiry"
              className={modalstyles.inputs}
              onChange={(e) => setexpiry(e.target.value)}
            />
            <br />
            <button className={modalstyles.buttons} type="submit">
              Submit
            </button>
            <br />
          </form>
        </Fragment>
      </Modal>

      <div className={classes.root}>
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
              rowCount={tests?.length}
            />
              {loading && Loading }
              {loading === false && ( <TableBody>
                {stableSort(tests, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((test, index) => {
                    const isItemSelected = isSelected(test?._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (   
                      <TableRow
                        hover
                        role="checkbox"  
                        tabIndex={-1}
                        key={test._id}    
                      >
                      <TableCell padding="checkbox">
                        <h1></h1>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                          {test?.topicname}
                      </TableCell>
                        <TableCell align="right">{test?.pin}</TableCell>
                        <TableCell align="right">{test?.amount}</TableCell>
                        <TableCell align="right">{test?.time}</TableCell>
                        <TableCell align="right">{moment(test?.expiry, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')}</TableCell>

                        <TableCell align="right">                    
                          <i className="fas fa-edit  quiz__font__icons quiz__font__first__icon" title="Edit" onClick={() => handleEdit(test?._id)} ></i>
                          <i className="fas fa-trash-alt quiz__font__icons" title="Remove" onClick={() => handleDelete(test?._id)} ></i>
                          
                          <Link
                            to={{ pathname: "/quiz/admin_quiz_result", state: {test} }}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <i class="fas fa-eye quiz__font__icons"> </i>
                          </Link>
   
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
            count={tests?.length}
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