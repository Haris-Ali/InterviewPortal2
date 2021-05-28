import React from "react";
import Buttons from "views/Components/Buttons.jsx";
import GridSystem from "views/Components/GridSystem.jsx";
import Panels from "views/Components/Panels.jsx";
import SweetAlert from "views/Components/SweetAlert.jsx";
import Notifications from "views/Components/Notifications.jsx";
import Icons from "views/Components/Icons.jsx";
import Typography from "views/Components/Typography.jsx";
import RegularForms from "views/Forms/RegularForms.jsx";
import ExtendedForms from "views/Forms/ExtendedForms.jsx";
import ValidationForms from "views/Forms/ValidationForms.jsx";
import Wizard from "views/Forms/Wizard.jsx";
import RegularTables from "views/Tables/RegularTables.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import GoogleMaps from "views/Maps/GoogleMaps.jsx";
import FullScreenMap from "views/Maps/FullScreenMap.jsx";
import VectorMap from "views/Maps/VectorMap.jsx";
import Charts from "views/Charts/Charts.jsx";
import Calendar from "views/Calendar/Calendar.jsx";
import Widgets from "views/Widgets/Widgets.jsx";
import UserProfile from "views/Pages/UserProfile.jsx";
import TimelinePage from "../views/Pages/Timeline.jsx";
import RTLSupport from "views/Pages/RTLSupport.jsx";

import pagesRoutes from "./pages.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Image from "@material-ui/icons/Image";
import Apps from "@material-ui/icons/Apps";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import GridOn from "@material-ui/icons/GridOn";
import Place from "@material-ui/icons/Place";
import WidgetsIcon from "@material-ui/icons/Widgets";
import Timeline from "@material-ui/icons/Timeline";
import DateRange from "@material-ui/icons/DateRange";

//Custom Pages

//Test Pages
import Testresult from "../components/TestResult.component";
import Questions from "../components/Question.component";
import Taketest from "../components/TakeTest.component";
import Dashboard from '../components/Dashboard.component'
import Call from '../components/Call.js'
import PostsBody from '../components/Posts/PostsBody.js'
import Profile from '../components/body/profile/Profile';
import Register from '../components/body/auth/Register';
import HomeLanding from '../pages/HomePage/Home';
import EnhancedTable2 from "../components/EnahancedTable2.js";
import Add_Interviewer from "../components/Make_Interview_Post.js/Add_Interviewer.js";
import AssessmentIcon from '@material-ui/icons/Assessment';
import CallIcon from '@material-ui/icons/Call';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import Interviewer_Schedule_Meeting_Table from "../components/Meetings/Interviewer_Schedule_Meeting_Table.js";
import Interviewer_Schedule_Meeting from "../components/Meetings/Interviewer_Schedule_Meeting.js";


const dashRoutes = [
  {
    path: "/admin",
    name: "Main Menu",
    icon: DashboardIcon,
  },

  {
    collapse: true,
    path: "/quiz",
    name: "Quiz",
    state: "openQuiz",
    icon: AssessmentIcon,
    views: [
      {
        path: "/quiz/make-quiz",
        name: "Make Quiz",
        mini: "MQ",
        component: Dashboard
      },
    ]
  },
  {
    collapse: true,
    path: "/posts",
    name: "Job Ads",
    state: "openJob",
    icon: "content_paste",
    views: [
      {
        path: "/posts/make-job-posts",
        name: "Make Posts",
        mini: "MP",
        component: PostsBody 
      },

      {
        path: "/posts/update-job-posts",
        name: "Update Posts",
        mini: "MP",
        component: EnhancedTable2 
      },

      {
        path: "/posts/get-CV-posts",
        name: "Check CVs",
        mini: "CCV",
        component: Profile
      },

    ]
  },
  // {
  //   path: "/candidate",
  //   name: "Switch to Candidate Console",
  //   mini: "CC",
  //   component: HomeLanding
  // },
  {
    collapse: true,
    path: "/meetings",
    name: "Meetings",
    state: "openMeetings",
    icon: CallIcon,
    views: [
      {
        path: "/meetings/schedule-meeting",
        name: "Schedule Meeting",
        mini: "SM",
        component: Interviewer_Schedule_Meeting
      },

      {
        path: "/meetings/see-schedule-meeting",
        name: "Meetings Menu",
        mini: "MM",
        component: Interviewer_Schedule_Meeting_Table
      },

    ]
  },
  // { path: "/call", name: "Make Call", icon: CallIcon, component: Call },
  { path: `/change-role`, name: "Candidate Console", icon: PersonIcon, component: HomeLanding },
  { path: `/home`, name: "Home", icon: HomeIcon, component: HomeLanding },
];
export default dashRoutes;
