import React, { useState, useEffect, Fragment } from "react";
import Test from "./TestElement.component";
import styles from "../componentsStyles/Dashboard.module.css";
import axios from "axios";
import Modal from "react-modal";
import modalstyles from "../componentsStyles/Modal.module.css";
import teststyles from "../componentsStyles/Testelement.module.css";
import { useHistory } from "react-router-dom";
import resultstyles from "../componentsStyles/TestResult.module.css";

import Loading from './Loading';
import EnhancedTable from "./EnhancedTable";
import EnhancedTable2 from "./EnahancedTable2";
import Admin_Quiz_Table from "./Admin_Quiz_Table";


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

Modal.setAppElement("#root");
function Dashboard({user, isAdmin}) {
  let history = useHistory();
  
  const [tests, setTests] = useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [topic, settopic] = useState("");
  const [amount, setamount] = useState("");
  const [time, settime] = useState("");
  const [expiry, setexpiry] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("firstlogin"),
    },
  };
  
  useEffect(() => {
    setLoading(true)
    console.log("Dashboard_test Opened")
    axios
      .post("/user/gettest", {email: user?.email}, options)
      .then((res) => {
        console.log(res)
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
      
  }, [modalIsOpen]);

 

  const onSubmit = async (event) => {
    event.preventDefault();
    const email = user?.email;
    const pin = 100;
    console.log({
      email, topic, amount, time, expiry, created: new Date() })
    try {
      const res = await axios.post("/user/addtest", {
       email, topic, amount, time, expiry, created: new Date() }
      )
      console.log("added");
        
      setmodalIsOpen(false);
      
    } catch (error) {
      console.log("error : " ,error.response.data.msg);
      alert(error.response.data.msg);
    }
    
  };

  return (
    <React.Fragment>
    <div>
        <h1
          className={styles.heading}
          style={{ background: "white", fontSize: "2em", padding: "2%" }}
        >
          Welcome {user.name}
        </h1>
      </div>
      <button
        className={styles.buttons}
        style={{ float: "left", display: "block" }}
        onClick={() => setmodalIsOpen(true)}
      >
        + Add Test
      </button>

      <br />
      <br />
      <br />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        className={modalstyles.modal}
        overlayClassName={modalstyles.overlay}
      >
        <Fragment className= "dashboard__fragment">
          <h1 className={modalstyles.heading}>Create Test</h1>
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
      <div className={teststyles.parent}>
        {/* <div className={resultstyles.row}>
          <div className={teststyles.element}>
            <strong>Pin</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Topic</strong>
          </div>
          <div className={teststyles.element}>
            <strong>No. of Ques</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Time Duration (Mins)</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Expiry</strong>
          </div>
        </div>
        <div className={styles.testcontainer}>
          {loading && <Loading/>}
          {loading === false && tests.map((obj) => (
            <Test key={obj._id} {...obj} />
          ))}
        </div>
      </div> */}
      {/* <br />
      <br />
      <EnhancedTable testsReceived = {tests} user = {user}/>
      <br />
      <br />
      <EnhancedTable2 testsReceived = {tests} user = {user}/>
      <br /> */}

      <Admin_Quiz_Table testsReceived = {tests} user = {user} wow ={tests}/>
   
      
    </div>
    </React.Fragment>
  );
}

export default Dashboard;
