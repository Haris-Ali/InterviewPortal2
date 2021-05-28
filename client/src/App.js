import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser, dispatchMakeVisible, dispatchMakeInvisible, dispatchToggleVisible} from './redux/actions/authAction'
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";

import { InfoSection, Pricing } from './components';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour, homeObjFive } from './pages/HomePage/Data';

import axios from 'axios';
import Login from './components/body/auth/Login';
import Register from './components/body/auth/Register';
import ForgotPassword from './components/body/auth/ForgotPassword';
import ResetPassword from './components/body/auth/ResetPassword';
import ActivationEmail from './components/body/auth/ActivationEmail';
import NotFound from './components/utils/NotFound/NotFound';
import Call from './components/Call';
import HomeOld from './components/body/home/Home';
import Profile from './components/body/profile/Profile';
import EditUser from './components/body/profile/EditUser';
import PrivateRoute from "./layouts/PrivateRoute";

import Testresult from "./components/TestResult.component";
import Questions from "./components/Question.component";
import Taketest from "./components/TakeTest.component";
import Dashboard from './components/Dashboard.component'


import GlobalStyle from './globalStyles';
import HomeLanding from './pages/HomePage/Home';
import Services from './pages/Services/Services';
import Products from './pages/Products/Products';
import SignUp from './pages/SignUp/SignUp';
import ScrollToTop from './components/ScrollToTop';
import { Navbar, Footer } from './components';

import Team from './pages/Team';
import { Reports, ReportsOne, ReportsTwo, ReportsThree } from './pages/Reports';
import Overview from './pages/Overview';
import Sidebar from './components/Sidebar';


import Loader from "react-loader-spinner";
import Buttons from "views/Components/Buttons.jsx";
import ExtendedForms from "views/Forms/ExtendedForms.jsx";
import Loading from './components/Loading'
import PostsBody from './components/Posts/PostsBody.js'
import H from './pages/HomePage/H.js'
import Wizard from './components/Profile_Completion/Wizard'
import ChangeRole from './components/ChangeRole'

import Checkout from './components/Multi-Form/Checkout';
import DeleteQuiz from './components/DeleteQuiz';
import UserProfile from './views/Pages/UserProfile.jsx'
import Get_Interview_Posts from './components/Make_Interview_Post.js/Get_Interview_Posts';
import Make_Interview_Posts from './components/Make_Interview_Post.js/Make_Interview_Posts';
import Employees from './components/FilterTable/Employees';
import Posts_Table from './components/FilterTable/Posts_Table';
import Edit_Interview_Posts from './components/Make_Interview_Post.js/Edit_Interview_Posts';
import Add_Candidate from './components/Make_Interview_Post.js/Add_Candidate';
import EnhancedTable2 from './components/EnahancedTable2';
import ApiCall from './components/ApiCall';
import Interview_Post_Page from './components/Make_Interview_Post.js/Interview_Post_Page';
import Candidate_Profile_Page from './components/Make_Interview_Post.js/Candidate_Profile_Page';
import Add_Interviewer from './components/Make_Interview_Post.js/Add_Interviewer';
import DashboardLanding from './components/Dashboard_Landing/DashboardLanding';
import DashboardLandingCandidate from './components/Dashboard_Landing/DashboardLandingCandidate';
import Update_Candidate from './components/Make_Interview_Post.js/Update_Candidate';
import Update_Interviewer from './components/Make_Interview_Post.js/Update_Interviewer';
import Interviewer_User_Profile from './components/Make_Interview_Post.js/Interviewer_User_Profile';
import Edit_Company from './components/Make_Interview_Post.js/Edit_Company';
import Add_Company from './components/Make_Interview_Post.js/Add_Company';
import Candidate_User_Profile from './components/Make_Interview_Post.js/Candidate_User_Profile';
import Add_Project from './components/Make_Interview_Post.js/Add_Project';
import Edit_Project from './components/Make_Interview_Post.js/Edit_Project';
import Admin_Quiz_Result from './components/Admin_Quiz_Result'
import Interviewer_Profile_Page from './components/Make_Interview_Post.js/Interviewer_Profile_Page';
import Interviewer_Schedule_Meeting from './components/Meetings/Interviewer_Schedule_Meeting';
import Interviewer_Schedule_Meeting_Table from './components/Meetings/Interviewer_Schedule_Meeting_Table';
import Update_Interviewer_Schedule_Meeting from './components/Meetings/Update_Interviewer_Schedule_Meeting';
import Candidate_Schedule_Meeting_Table from './components/Meetings/Candidate_Schedule_Meeting_Table';
// const loading = (
//   <Loader type="TailSpin" color="#00BFFF" height={40} width={40}/>
// )

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  const {user, isLogged, isAdmin} = auth
  const [loading, setLoading] = useState(true);
  let history = useHistory();
  const hist = createBrowserHistory();

  useEffect(() => {
    console.log("App.js auth.isLogged use Effect")
    
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
      const getToken = async () => {
        const res = await axios.post('/user/refresh_token', null)
        dispatch({type: 'GET_TOKEN', payload: res.data.access_token})        
      }
      getToken() 
    }
    else{
      setLoading(false)
    }
    // console.log("user: ", auth)
  },[auth?.isLogged, dispatch])

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(!firstLogin){
      setLoading(false)
    }
    else{
      setLoading(true)
      if(token){
        const getUser = () => {
          dispatch(dispatchLogin())
          return fetchUser(token).then(res => {
            console.log("App.js User id", res?.data?._id);
            try{
              dispatch(dispatchGetUser(res))
              console.log("App.js dispatch State", user)
              setLoading(false)    
            }
            catch(e) {
              console.log(res, e)
            }
          })
        }
        getUser()
      }
    }
    
  },[token, dispatch, auth?.isAdmin])


  return (
     
      <>
      {
        loading ? (
          <> 
            <Loading />
          </>
          
        ) : (
          <> 
          <Router history = {hist}>
            <GlobalStyle />
            <ScrollToTop />
           <div className="App">
           <React.Suspense fallback = {loading}>
              <Switch>
                <Route path = "/login">
                  <Navbar />  
                  <Login />
                  <Footer />
                  </Route>

                <Route path = "/checkout">   
                 <Checkout /> 
                </Route>


                <Route path = "/register">  
                  <Navbar /> 
                  {isLogged ? <NotFound /> : <Register />}
                  <Footer />
                </Route>
  
                <Route path = "/forgot_password">
                  <Navbar />  
                  {isLogged ? <NotFound /> : <ForgotPassword />}
                  <Footer />
                </Route>
  
                <Route path = "/user/reset/:token">
                  <Navbar />    
                  {isLogged ? <NotFound /> : <ResetPassword />}
                  <Footer />
                </Route>
            
                <Route path = "/user/activate/:activation_token">   
                  <Navbar />
                  <ActivationEmail />
                  <Footer />  
                </Route>
               
                <Route path = "/profile">   
                  <Navbar /> 
                  {isLogged ? <Profile /> : <NotFound />}
                  
                </Route>
  
                <Route path = "/edit_user/:id">   
                  <Navbar />
                  {isAdmin ? <EditUser /> : <NotFound />}
                  <Footer />
                </Route>
  
                
  
                <Route path = "/dashboard2">
                  <Navbar />   
                  {isAdmin ? <Dashboard user = {auth.user} role = {auth.isAdmin}/> : <NotFound />}
                </Route>
  
                <Route exact path = "/abouttest">
                  <Navbar />
                  {isAdmin ? <Testresult user = {auth.user} role = {auth.isAdmin} /> : <NotFound />}    
                  
                </Route>
  
                {/* <Route exact path="/abouttest" component={Testresult} /> */}
                
                <Route path = "/test">   
                  <Questions user = {auth.user} role = {auth.isAdmin}/>
                </Route>
  
                <Route path = "/taketest">
                  <Navbar />
                  {isLogged ? <Taketest namei = {auth?.user?.name} emaili = {auth?.user?.email}/> : <NotFound />}
                  
                </Route>
  
                <Route path = "/home">
                  <Navbar />      
                  <HomeLanding />
                  <Footer />
                </Route>
  
                <Route path = "/services">
                  <Navbar />      
                  <Services />
                  <Footer />
                </Route>
  
                <Route path = "/products">
                  <Navbar />    
                  <Products />
                  <Footer />
                </Route>
  
                <Route path = "/sign-up">
                  <Navbar />   
                  <SignUp />
                  <Footer />
                </Route>
  
                <Route path = "/main-menu">
                  <Navbar />
                  <Sidebar user = {auth?.user} role = {auth?.isAdmin}/>
                    
                  {/* <HomeLanding />   */}
                  {/* {isLogged ? <HomeOld user = {auth.user} role = {auth.isAdmin}/> : <NotFound />} */}
                  {isLogged ? <InfoSection {...homeObjFive}/> : <NotFound />}
                </Route>
                
  
                <Route exact path = "/">   
                  <Navbar />
                  <HomeLanding />
                  <Footer />
                </Route>

                
                <PrivateRoute path="/get-profile" component={isAdmin ? H: NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/admin-profile-completion" component={isAdmin ? Wizard: NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <PrivateRoute path="/posts/get-profile-posts" component={PostsBody}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/admin" component={isAdmin ? DashboardLanding: NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/candidate" component={!isAdmin ? DashboardLandingCandidate: NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/quiz/see-candidate-results" component={isAdmin ? Testresult : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/quiz/make-quiz" component={isAdmin ? Dashboard : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/quiz/delete-quiz" component={isAdmin ? DeleteQuiz : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <PrivateRoute path="/quiz/attempt-quiz" component={isLogged ? Taketest : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/quiz/quiz-board" component={isLogged ? Questions : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/posts/get-job-posts" component={isLogged ? Get_Interview_Posts : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/posts/make-job-posts" component={isAdmin ? Make_Interview_Posts : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/posts/gcp" component={isAdmin ? Posts_Table : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/posts/edit-job-posts/:id" component={isAdmin ? Edit_Interview_Posts : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/posts/update-job-posts" component={isAdmin ? EnhancedTable2 : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <PrivateRoute path="/posts/open-job-post-page/:id" component={isLogged ? Interview_Post_Page : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/user/open-candidate-profile-page/:id" component={isLogged ? Candidate_Profile_Page : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/user/open-interviewer-profile-page/:id" component={isLogged ? Interviewer_Profile_Page : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <PrivateRoute path="/api" component={ApiCall }  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <Route exact path="/change-role" render={(props) => <ChangeRole user={auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged}  {...props} />} />

                {/* see profile */}
                <PrivateRoute path="/update-profile-by-candidate" component={isLogged ? Update_Candidate : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/update-profile-by-interviewer" component={isAdmin ? Update_Interviewer : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                {/* Complete Profile Information */}
                <PrivateRoute path="/complete-interviewer-profile" component={isLogged ? Add_Interviewer : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/complete-candidate-profile" component={isLogged ? Add_Candidate : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />


                {/* Profile Pages for candidate and interviewer*/}
                <PrivateRoute path="/interviewer-profile" component={isAdmin ? Interviewer_User_Profile : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/candidate-profile" component={isLogged ? Candidate_User_Profile : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/edit-project/:id" component={isLogged ? Edit_Project : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <PrivateRoute path="/edit-company/:id" component={isAdmin ? Edit_Company : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/add-company" component={isAdmin ? Add_Company : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/add-project" component={isLogged ? Add_Project : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/quiz/admin_quiz_result" component={isLogged ? Admin_Quiz_Result : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                {/* Meetings */}
                <PrivateRoute path="/meetings/schedule-meeting" component={isAdmin ? Interviewer_Schedule_Meeting : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/meetings/see-schedule-meeting" component={isAdmin ? Interviewer_Schedule_Meeting_Table : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                <PrivateRoute path="/meetings/update-schedule-meeting/:id" component={isAdmin ? Update_Interviewer_Schedule_Meeting : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />
                
                <PrivateRoute path="/meetings/candidate-see-meetings-schedule" component={isLogged ? Candidate_Schedule_Meeting_Table : NotFound}  user = {auth?.user} isAdmin = {auth?.isAdmin} isLogged = {auth?.isLogged} />

                <Route path = "/meetings/join-room/:id">   
                  < Call />
                </Route>
                
               { /* <Route exact path="/landing" render={(props) => <Dashboard_Custom user={auth?.user} component = {HomeLanding} {...props} />} />*/ }

              </Switch>
           </React.Suspense>     
          </div>
        </Router>      
          </>
        )
      }     
      </>
    
    
  );
}

export default App;