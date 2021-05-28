import React, { useEffect, useState } from 'react'
// import EmployeeForm from "./EmployeeForm";
import PageHeader from "./components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "./components/useTable";
// import * as employeeService from "../../services/employeeService";
import Controls from "./components/controls/Controls";
import { Search } from "@material-ui/icons";
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
        
    },
    searchInput: {
        width: '75%'
    }
}))


const headCells = [
    { id: 'fullName', label: 'Employee Name' },
    { id: 'email', label: 'Email Address (Personal)' },
    { id: 'mobile', label: 'Mobile Number' },
    { id: 'department', label: 'Department', disableSorting: true },
]

export default function Employees({user}) {
    const classes = useStyles();
    const [records, setRecords] = useState([])
    const [tests, setTests] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

    const [loading, setLoading] = useState(false);
    const options = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("firstlogin"),
        },
      };
    useEffect(() => {
        console.log("Employees")
        setLoading(true)
        axios
          .post("/user/gettest", {email: user?.email}, options)
          .then((res) => {
            console.log(res)
            for (let x of res.data) {
              for (let y of topics) {
                if (y["id"] == x["topic"]) x.topicname = y["name"];
              }
            }
            setRecords(res.data);
            setLoading(false)
          })
          .catch((err) => {
            if (!localStorage.getItem("firstlogin")){
              // history.push("/");
            } 
            else alert("couldn't fetch please reload");
          });
      }, []);
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.fullName.toLowerCase().includes(target.value))
            }
        })
    }

    return (
        <>
        { loading ? (
            <>
            {records && <h1> Accepted</h1>}
            <h1> Record</h1>
            </>
        ):(
            <>
                <PageHeader
                    title="New Employee"
                    subTitle="Form design with validation"
                    icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
                />
                <Paper className={classes.pageContent}>
                    {/* <EmployeeForm /> */}
                    <Toolbar>
                        <Controls.Input
                            label="Search Employees"
                            className={classes.searchInput}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start">
                                    <Search />
                                </InputAdornment>)
                            }}
                            onChange={handleSearch}
                        />
                    </Toolbar>
                    <TblContainer>
                        <TblHead />
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting()?.map(item =>
                                    (<TableRow key={item.id}>
                                        <TableCell>{item.pin}</TableCell>
                                        <TableCell>{item.amount}</TableCell>
                                        <TableCell>{item.time}</TableCell>
                                        <TableCell>N/A</TableCell>
                                    </TableRow>)
                                )
                            }
                        </TableBody>
                    </TblContainer>
                    <TblPagination />
                </Paper>
            </>
        )}
    </>
        
        
    )
}
