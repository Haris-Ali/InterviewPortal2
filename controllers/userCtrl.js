const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {google, containeranalysis_v1alpha1} = require('googleapis')
const {OAuth2} = google.auth
const fetch = require('node-fetch')

const axios = require("axios");
const sendMail = require('./sendMail');
const sendEmail = require('./sendMail');
const moment = require('moment')
// models
var mongoose = require('mongoose');
const Users = require('../models/userModel')
const test = require("../models/test.model");
const result = require("../models/result.model");
const Interviewer = require("../models/Interviewer.model.js")
const Candidate = require("../models/candidate.model.js")
const Post = require("../models/post.model.js")
const Project = require("../models/project.model.js")
const Company = require("../models/company.model.js")
const Meeting = require("../models/meeting.js")
const sendEmailToCandidate = require("./sendMailToCandidate")

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)
const {CLIENT_URL, ACTIVATION_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;
const userCtrl = {
    register: async (req, res) =>{
        
        try{
            const { name, email, password, role } = req.body;
            console.log(role + "is the role")
            if (!name || !email || !password){
                return res.status(400).json({msg : "Please fill in all fields"})
            }
            if(name.length < 3){
                return res.status(400).json({msg : "Name must be atleast 3 characters"})
            }
            if(name.length > 12){
                return res.status(400).json({msg : "Name must not be greater than 12 characters"})
            }
            if(!validateName(name)){
                return res.status(400).json({msg : "Name can be alphanumeric only"})
            }    

            if(!validateEmail(email)){
                return res.status(400).json({msg : "Invalid Email"})
            }
            
            const user = await Users.findOne({email});
            if(user) return res.status(400).json({msg : "This email has already been registered"})
            
            if(password.length < 6){
                return res.status(400).json({msg : "Password must be atleast 6 characters"})
            }
            if(password.length > 12){
                return res.status(400).json({msg : "Password must not be greater than 12 characters"})
            }
            if(!validatePassword(password)){
                return res.status(400).json({msg : "Password should have atleast 1 ASCII character, digit, lower letter and Upper letter"})
            }
            const passwordHash = await bcrypt.hash(password, 12);
            // console.log({password, passwordHash});
            // console.log(req.body);
            const newUser = {
                name, email, role, password: passwordHash
            }
            
            console.log(newUser);
            
            const activation_token = createActivationToken(newUser)
            // console.log({activation_token});
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, "Verify Your Email Address")

            res.json({msg : "Register Success! Please activate your email to start"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail:  async (req, res) => {
        try {
            const {activation_token} = req.body;
            const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET)
            // console.log({ACTIVATION_TOKEN_SECRET});
            // console.log({activation_token}); 
            // console.log(user); // if we copypaste the activation code from email ahead of activate/ then send req by postman here we will get to see user
            
            const {name, email, password, role} = user;
            const check = await Users.findOne({email});
            if(check) return res.status(400).json({msg : "This email has already been registered"})

            const newUser = new Users({
                name, email, password, role
            })
            await newUser.save()
            

            // new part
            var new_user  = await Users.findOne({email});
            const newInterviewer = new Interviewer({
                user: mongoose.Types.ObjectId(new_user._id)
            })
            await newInterviewer.save()
            
            const newCandidate = new Candidate({
                user: mongoose.Types.ObjectId(new_user._id)
            })
            await newCandidate.save()
            //new part ending


            res.json({msg : "Account has been activated"})

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    login: async (req, res) =>{
        try {
            const {email, password} = req.body;
            if(!password || !email){
                return res.status(400).json({msg : "Please fill all the fields"})
            }
            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg : "This email doesn't exist"})

           
            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) return res.status(400).json({msg : "Password is incorrect"})
            
            
            // console.log(user);

            //following code will refresh the cookie for 7 days after respective login
            //send the POST req to Login then Get request to path in cookie with postman
            //goto cookies option to see it wok
            //check expiry date to see the magic  
            const refresh_token = createRefreshToken({id: user._id});
            res.cookie("refreshtoken", refresh_token ,{
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7*24*60*60*100 //7days
            });

            res.json({msg : "You logged In"})
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    },
    getAccessToken: async (req,res) => {
        try {
            //here refreshtoken is not varaible but the name which we gave to cookie while creating it in login part
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})
            jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err,user)=>{
                if(err) return res.status(400).json({msg : "Please login now!"})
                //console.log(user); //user is recognized here by its id = user._id
                const access_token = createAccessToken({id: user.id})
                res.json({access_token}) //this token is same as the one which was sent to the email containing user information
                
            })
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    },
    forgotPassword: async (req, res) =>{
        try {
            const {email} = req.body;
            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg : "This email doesn't exist"})
            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/user/reset/${access_token}`
            sendEmail(email,url,"Reset Your password");
            res.json({msg : "To reset your password, Please check your email"});
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    },
    resetPassword: async (req,res) =>{
        try {
            const {password} = req.body;
            // if(!password){
            //     return res.status(400).json({msg : "Please fill all the fields"})
            // }
            // if(password.length < 6){
            //     return res.status(400).json({msg : "Password must be atleast 6 characters"})
            // }
            // if(password.length > 12){
            //     return res.status(400).json({msg : "Password must not be greater than 12 characters"})
            // }
            // if(!validatePassword(password)){
            //     return res.status(400).json({msg : "Password should have atleast 1 ASCII character, digit, lower letter and Upper letter"})
            // }

            const passwordHash = await bcrypt.hash(password, 12);
            // console.log(req.user);
            await Users.findOneAndUpdate({_id: req.user.id},{
                password: passwordHash
            })
            return res.json({msg : "Password changed successfully"})
        } catch (error) {
             return res.status(500).json({msg : error.message})
        }
    },
    getUserInfor: async (req, res) => {
        try {
             console.log("get-user")
             const users = await Users.findById(req.user.id).select('-password')
             res.json(users);
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            // if user role comes then admin access will be denied from middleware
            // if admin with role : 1 comes then middleware will display req.user information
            // change it from db atlas and send req to infor and then to all_infor and see req.user here
            // console.log(req.user);
            const users = await Users.find().select('-password')
            
            res.json(users)
        } catch (error ) {
            return res.status(500).json({msg: error.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path : '/user/refresh_token'})
            return res.json({msg: "Logged Out."})
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {name, avatar} = req.body;
            await Users.findByIdAndUpdate({_id : req.user.id},{
                name, avatar
            })
            res.json({msg: "Update Successful!"})
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    push_notifications: async (req, res) => {
        try {
            console.log("push-notifications")
            const {candi, inte} = req.body;
            const user = await Users.findOne({_id : req.body.userId})
            user.candidate_notifications.push(candi);
            user.interviewer_notifications.push(inte);
            
            user.save();
            // console.log(user)
            res.json({msg: "Update Successful!"})
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    pop_notifications: async (req, res) => {
        try {
            console.log("pop-notifications")
            const user = await Users.findOne({_id : req.body.userId})
               if (!user) return res.status(400).json({msg : "User not found"})
            let blank = []
            if (user?.role === 1){
                user.interviewer_notifications = blank
            }
            else if (user?.role === 0){
                user.candidate_notifications = blank
            }
            console.log(user)
            user.save();
            console.log(user)
            res.json({msg: "Update Successful!"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            console.log(req.user); // this will print user which is stored in header authorization
            const {role} = req.body;
            await Users.findOneAndUpdate({_id: req.params.id}, {
                role
            })
            res.json({msg : "Role Updated Successfully!"}) 
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser : async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)
            res.json({msg : "User Deleted Successfully!"}) 
        } catch (error) {
            return res.status(500).json({msg: err.message})
        } 
    },
    googleLogin: async (req, res) => {
        try {
            const {tokenId} = req.body
            console.log("heyy",tokenId)
            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})        
            const {email_verified, email, name, picture} = verify.payload
            const password = email + process.env.GOOGLE_SECRET
            const passwordHash = await bcrypt.hash(password, 12)
            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})
            const user = await Users.findOne({email})
            if(user){
                // const isMatch = await bcrypt.compare(password, user.password)
                // if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })
                await newUser.save()
                
                 // new part
                 var new_user  = await Users.findOne({email});
                 const newInterviewer = new Interviewer({
                     user: mongoose.Types.ObjectId(new_user._id)
                 })
                 await newInterviewer.save()
                 
                 const newCandidate = new Candidate({
                     user: mongoose.Types.ObjectId(new_user._id)
                 })
                 await newCandidate.save()
                 //new part ending


                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({msg: "Login success!"})
            }
        } catch (err) {
            // return res.status(500).json({msg: err.message})
            console.log(err)
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const {accessToken, userID} = req.body
            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`         
            const data = await fetch(URL).then(res => res.json()).then(res => {return res})
            const {email, name, picture} = data
            const password = email + process.env.FACEBOOK_SECRET
            const passwordHash = await bcrypt.hash(password, 12)
            const user = await Users.findOne({email})
            if(user){
                // const isMatch = await bcrypt.compare(password, user.password)
                // if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})
                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()   
                
                
                 // new part
                 var new_user  = await Users.findOne({email});
                 const newInterviewer = new Interviewer({
                     user: mongoose.Types.ObjectId(new_user._id)
                 })
                 await newInterviewer.save()
                 
                 const newCandidate = new Candidate({
                     user: mongoose.Types.ObjectId(new_user._id)
                 })
                 await newCandidate.save()
                 //new part ending


                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({msg: "Login success!"})
            }
        } catch (err) {
            // return res.status(500).json({msg: err.message})
        }
    },
    addtest: async (req, res) => {
        try {
            // console.log(req.body)
            // + Math.floor((Math.random() * (9000-500))
            const pin = (await test.countDocuments({}).exec()  + (Math.floor((Math.random() * (9000-500)) + 1000) ));
            //   const pin = req.body.pin;
            //   const email = req.user.email.toLowerCase();
            const email = req.body.email;
            const amount = req.body.amount;
            const topic = req.body.topic;
            const time = req.body.time;

            console.log("Expiry Date from req.body", req.body.expiry);
            console.log("Expiry Date after parsing", Date.parse(req.body.expiry));
            const expiry = Date.parse(req.body.expiry);
            const created = Date.parse(req.body.created);
        
            const newtest = new test({
            pin,
            email,
            amount,
            topic,
            time,
            expiry,
            created,
            });
            console.log(newtest, " is test")
            newtest
            .save()
            .then(() => res.send("test added!"))
            .catch((err) => res.status(400).json("error : " + err));
            res.json({msg: "test success!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    edittest_via_testId: async (req, res) => {
        try {
            // console.log(req.body)
            console.log("edit-test-via-test-id")
            // const pin = (await test.countDocuments({}).exec() + 1000);
            const pin = (await test.countDocuments({}).exec()  + (Math.floor((Math.random() * (9000-500)) + 1000) ));
            //   const pin = req.body.pin;
            //   const email = req.user.email.toLowerCase();
            const email = req.body.email;
            const amount = req.body.amount;
            const topic = req.body.topic;
            const time = req.body.time;
            const expiry = Date.parse(req.body.expiry);
            const created = Date.parse(req.body.created);
            await test.findByIdAndUpdate({_id : req.body.testId},{
                pin,
                email,
                amount,
                topic,
                time,
                expiry,
                created,
            })
            
            res.json({msg: "test updated successfully!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    gettest: async (req, res) => {
        try {
            const email = req.body.email;
            console.log("heyyy ",email)
            const doc = await test.find({ email }).sort("-created").exec();
            return res.send(doc);

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    gettest_via_testId: async (req, res) => {
        try {
            
            const doc = await test.findOne({_id: mongoose.Types.ObjectId(req.body.testId) }).sort("-created").exec();
            console.log(doc)
            return res.send(doc);

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getresults: async (req, res) =>{
        try {
            const pin = req.body.pin;
            const resultdoc = await result.find({ pin }).exec();
            return res.send(resultdoc);
        } catch (err) {
            return res.status(400).send();
        }
    },
    addmeeting: async (req, res) =>{
        try {
            console.log("add-meeting");
            console.log("The body is ", req.body)
            const testid = req.body.pin;
            const email = req.body.candidate_user_email;

            const Interviewer_userId = req.body.userId;
            let {expiry_date, expiry_time, start_date, start_time, password} = req.body;
            // console.log("Expiry date from req.body: ", expiry_date)

            const newDateStart = new Date(start_date)
            start_date = new Date(newDateStart.getTime() + (5 * 60 * 60 * 1000)) //converting into pakistani timezone
            // console.log("Start date after: ", start_date)

            const newDateExpiry = new Date(expiry_date)
            expiry_date = new Date(newDateExpiry.getTime() + (5 * 60 * 60 * 1000)) //converting into pakistani timezone
            // console.log("Expiry date after: ", expiry_date)


            const passwordHash = await bcrypt.hash(password, 12);
            
            // const isMatch = await bcrypt.compare(password, user.password);  //for comparing password
            console.log("email is ", expiry_date)
            const doc = await test.findOne({ pin: testid }).exec();
            if (!doc) return res.status(400).json({msg : "Test doesn't exist!"})

            if (Date.parse(doc.expiry) < Date.now()) return res.status(400).json({ msg: "Test has expired!" });
            
            const check = await result.findOne({ pin: testid, email }).exec();
            if (check) return res.status(400).json({ msg: "Test already taken!" });

            const checkSameQuiz = await Meeting.findOne({ pin: testid, candidate_user_email : email }).exec();
            if(checkSameQuiz)  return res.status(400).send({ msg: "You already have Registered the same quiz for respective Candidate" });
            
            const candidate_user = await Users.findOne({email: email}).exec();
            if(!candidate_user) return res.status(400).send({ msg: "Candidate doesn't exist with this email" });
            

            const interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies').exec();
            if(!interviewer) return res.status(400).send({ msg: "Interviewer Not found" });
            const interviewerId = mongoose.Types.ObjectId(interviewer._id)

            //notification to candidate
            candidate_user.candidate_notifications.push(`Meeting has been scheduled for you by ${interviewer?.user?.name}`)
            candidate_user.candidate_notifications.push(`A Test has been assigned to you. Enter pin : ${testid} to attempt it`)
            candidate_user.candidate_notifications.push(`Enter ${password} as password to join meeting when it starts`);
            candidate_user.candidate_notifications.push(`An email has been sent by ${interviewer?.user?.name}`)
           


            const newMeeting = new Meeting({
                madeBy: interviewerId, pin: testid, candidate_user_email: email, 
                start_date, start_time,
                expiry_date, expiry_time,
                password: passwordHash
            })

            // send email to candidate
            const meetingId = mongoose.Types.ObjectId(newMeeting._id);
            const toEmail = candidate_user?.email;
            const toName = candidate_user?.name;
            const sentByName = interviewer?.user?.name;
            const button_url = `http://localhost:3000/meetings/join-room/${meetingId}`           
            const message = "Please join the meeting with following Id"
            await sendEmailToCandidate(toEmail, toName, sentByName, button_url, message);

            await newMeeting.save()
            await candidate_user.save();

            res.json({msg : "Meeting has been added"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },
    updatemeeting_via_meeting_id: async (req, res) =>{

        try {
            console.log("update-meeting-via-meeting-id");
            console.log("The body is ", req.body)
            const testid = req.body.pin;
            const email = req.body.candidate_user_email;
            
            const Interviewer_userId = req.body.userId;

            let {meetingId, expiry_date, expiry_time, start_date, start_time, password} = req.body;
            //console.log("Expiry date from req.body: ", expiry_date)
            

            const newDateStart = new Date(start_date)
            start_date = new Date(newDateStart.getTime() + (5 * 60 * 60 * 1000)) //converting into pakistani timezone
           
            // console.log("Start date after: ", start_date)

            const newDateExpiry = new Date(expiry_date)
            expiry_date = new Date(newDateExpiry.getTime() + (5 * 60 * 60 * 1000)) //converting into pakistani timezone
            
            //console.log("Expiry date after: ", expiry_date)

            //bcrypting the password
            const passwordHash = await bcrypt.hash(password, 12);

            // console.log("email is ", expiry_date, expiry_time)
            const doc = await test.findOne({ pin: testid }).exec();
            if (!doc) return res.status(400).json({msg : "Test doesn't exist!"})

            if (Date.parse(doc.expiry) < Date.now()) return res.status(400).json({ msg: "Test has expired!" });
            
            const check = await result.findOne({ pin: testid, email }).exec();
            if (check) return res.status(400).json({ msg: "Test already taken!" });

            const checkSameQuiz = await Meeting.findOne({ pin: testid, candidate_user_email : email }).exec();
            if(checkSameQuiz)  return res.status(400).send({ msg: "You already have Registered the same quiz for respective Candidate" });
            
            const candidate_user = await Users.findOne({email: email}).exec();
            if(!candidate_user) return res.status(400).send({ msg: "Candidate doesn't exist with this email" });
            

            const interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies').exec();
            if(!interviewer) return res.status(400).send({ msg: "Interviewer Not found" });
            const interviewerId = mongoose.Types.ObjectId(interviewer._id)

            //notification to candidate
            candidate_user.candidate_notifications.push(`Meeting has been scheduled for you by ${interviewer?.user?.name}`)
            candidate_user.candidate_notifications.push(`A Test has been assigned to you. Enter pin : ${testid} to attempt it`)
            candidate_user.candidate_notifications.push(`Enter ${password} as password to join meeting when it starts`);
            candidate_user.candidate_notifications.push(`An email has been sent by ${interviewer?.user?.name}`)
            

            //updating meeting
            const meeting = await Meeting.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.meetingId)},    
            {
                madeBy: interviewerId, pin: testid, candidate_user_email: email, 
                start_date, start_time,
                expiry_date, expiry_time, 
                password: passwordHash        
            })

            // send email to candidate
            const toEmail = candidate_user?.email;
            const toName = candidate_user?.name;
            const sentByName = interviewer?.user?.name;
            const button_url = `http://localhost:3000/meetings/join-room/${meetingId}`           
            const message = "Please join the meeting with following Id"

            await sendEmailToCandidate(toEmail, toName, sentByName, button_url, message);
            await candidate_user.save();

            res.json({msg : "Meeting has been added"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },  
    compare_meeting_password_via_meetingId: async (req, res) =>{

        try {
            console.log("compare-meeting-password-via-meetingId");
            console.log("The body is ", req.body)
            let {meetingId, password, user} = req.body;

            let meeting = await Meeting.findOne({_id: mongoose.Types.ObjectId(req.body.meetingId)}).exec();
                if(!meeting)  return res.status(400).send({ msg: "Meeting not found" });
            let sendBool = false;
            await bcrypt.compare(password, meeting.password, (err, data) => {
                if (err) return res.status(500).json({msg: err.message})
                if (data) {
                    console.log("correct")
                    sendBool = true;
                    return res.json({msg: true})
                    // return res.json({msg: true})
                } else {
                    console.log("wrong")
                    return res.status(500).json({msg: "Wrong Password"})
                }
            })
            //
            // if(user?.role === 1){
            //     meeting = await Meeting.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.meetingId)},    
            //     {
            //           started: 1
            //     })
                
            // }
            // if(user?.role === 0){
            //     meeting = await Meeting.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.meetingId)},    
            //     {
            //           joined: 1
            //     })
            // }
            

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },
    getmeetings: async (req, res) => {
        try {
            console.log("get-meetings")
            const {userId} = req.body;
            // console.log("req body userId",userId)
            let interviewer = await Interviewer.findOne({user : mongoose.Types.ObjectId(userId)}).populate("user").exec();
                if(!interviewer) return res.status(400).json({msg: "Interviewer not found"})
            // console.log(interviewer)
            const interviewerId = mongoose.Types.ObjectId(interviewer._id);
            console.log("madeBy: ",interviewerId)
            const doc = await Meeting.find({ madeBy: mongoose.Types.ObjectId(interviewer._id) }).sort("-created").exec();
                if (!doc) {
                    console.log("document not found")
                    res.status(400).json({msg: "Meeting not found"})
                }  
            return res.send(doc);
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getmeeting_via_meetingId: async (req, res) => {
        try {
            console.log("get-meeting-via-meetingId")
            const {meetingId} = req.body;
            console.log(req.body)
            const doc = await Meeting.findOne({ _id: mongoose.Types.ObjectId(req.body.meetingId) }).sort("-created").exec();
                if (!doc) {
                    console.log("document not found")
                    res.status(400).json({msg: "Meeting not found"})
                }  
            return res.send(doc);

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updatestarted_via_meetingId: async (req, res) => {
        try {
            console.log("get-meeting-via-meetingId")
            const {meetingId} = req.body;
           
            await Meeting.findByIdAndUpdate({_id : mongoose.Types.ObjectId(req.body.meetingId)},{
                started: 1
            })
            res.json({msg: "Update Successful!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getmeetings_via_userId_for_candidate: async (req, res) => {
        try {
            console.log("getmeetings-via-userId-for-candidate")
            const {userId} = req.body;

            console.log("req body userId",userId)

            let user = await Users.findOne({_id : mongoose.Types.ObjectId(userId)}).exec();
                if(!user) return res.status(400).json({msg: "user not found"})
            
            console.log(user)

            
            const doc = await Meeting.find({ candidate_user_email: user?.email }).sort("-created").exec();
                if (!doc) {
                    console.log("document not found")
                }
                if(doc){
                    console.log("document :", doc)
                }
            
            return res.send(doc);
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deletemeeting_via_meetingId: async (req, res ) => {
        
        try {
            console.log("delete-meeting-via-meetingid")
            console.log(req.params.id)

            let meeting = await Meeting.findOneAndDelete({_id: mongoose.Types.ObjectId(req.params.id)})
                if(!meeting) return res.status(400).json({msg : "Meeting not found"})    
            
            res.json({msg: "Company has been deleted"})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message})
            
        }
    },  
    testapi: async (req, res) =>{
        console.log("The body is ", req.body)
        const testid = req.body.pin;
        const email = req.body.emaili;
        console.log("email is ", email)
        const doc = await test.findOne({ pin: testid }).exec();
        if (!doc) {
          return res.status(400).send({ message: "Test doesn't exist!" });
        }
        if (Date.parse(doc.expiry) < Date.now()) {
          return res.status(400).send({ message: "Test has expired!! " });
        }
        const check = await result.findOne({ pin: testid, email }).exec();
        if (check) {
          return res.status(400).send({ message: "Test already taken!" });
        }
        const questions = await axios.get("https://opentdb.com/api.php", {
          params: {
            amount: doc.amount,
            category: doc.topic,
          },
        });
        questions.data.time = doc.time;
        if (questions.data.response_code == 0) {
            return res.send(questions.data);
        }
        
        else
          return res
            .status(400)
            .send({ message: "Couldn't fetch test details. Try again!" });
    },
    submittest: async (req, res) =>{
        const score = parseInt(req.body.score);
        const email = req.body.email;
        const name = req.body.name;
        const pin = req.body.pin;
      
        const resultEntry = new result({ email, name, pin, score });
        console.log(resultEntry)
        resultEntry
          .save()
          .then(() => {
              console.log("yo result has been added")
              res.send("result added!")
            })
          .catch((err) => {
              console.log("error arose:", err)
              res.status(400).json("error : " + err)});       
    },
    deletetest: async (req, res) => {
        try {
            const {selected} = req.body;
            selected.map( async (testID, index) => {
                await test.findByIdAndDelete(testID)
            })
            res.send("deleted all record")
        } catch (error) {
            console.log("error arose:", error)
            res.status(400).json("error : " + error); 
        }
    },
    deletetest_via_testId: async (req, res) => {
        try {
            console.log('delete test by test Id')
            const testToDelete =  await test.findByIdAndDelete(req.params.id)
            res.json({msg : "User Deleted Successfully!"})            
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    addTestingUser: async(req,res)=>{
        try {
            console.log("Add-testing-user")
            const {name, email, password, role} = req.body;
            const check = await Users.findOne({email});
            if(check) return res.status(400).json({msg : "This email has already been registered"})

            const newUser = new Users({
                name, email, password, role
            })
            await newUser.save()
            



            var new_user  = await Users.findOne({email});
            console.log("Add-Interviewer")
            const newInterviewer = new Interviewer({
                user: mongoose.Types.ObjectId(new_user._id)
            })
            await newInterviewer.save()
            
            const newCandidate = new Candidate({
                user: mongoose.Types.ObjectId(new_user._id)
            })
            await newCandidate.save()
            res.send("Interview and Candidate profile has been added")
        } catch (error) {
            res.status(400).json("error : " + error); 
        }
        
    },
    addinterviewer: async (req, res ) => {
        try {
            console.log("Add-Interviewer")
            const {user, age, city} = req.body;
            const newInterviewer = new Interviewer({
                user, age, city
            })
            await newInterviewer.save()
            res.send("Interviewer has been adeded")
        } catch (error) {
            res.status(400).json("error : " + error); 
        }
    },
    getinterviewer_via_interviewer_id: async (req, res ) => {
        try {
            console.log("get-interviewer-by-interviewer-id")
            console.log(req.body.interviewerId)
            const interviewer = await Interviewer.findOne({_id: mongoose.Types.ObjectId(req.body?.interviewerId)}).populate('user companies posts').exec();
            if (!interviewer) return res.status(400).send("interviewer profile is not present anymore")
            console.log(interviewer)
            res.send(interviewer);
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    getinterviewer_via_userId: async (req, res ) => {
        try {
            console.log("get-Interviewer-by-userId")
            const interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies').exec();
            console.log(interviewer)
            // console.log(interviewer.age)
            res.send(interviewer);
            
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    getinterviewer_via_post_id : async (req, res ) => {
        try {
            console.log("get-interviewer_via_interviewer_id")
            post = await Post.findOne({_id: mongoose.Types.ObjectId(req.body.postId)}).populate('postedBy')
                if(!post) return res.status(400).json({msg : "post not found"})    
            const interviewer = await Interviewer.findOne({_id: mongoose.Types.ObjectId(post.postedBy._id)}).populate('user posts companies').exec();
                if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})
            console.log("Interviewe: ",interviewer)
            res.send(interviewer);
            
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    getcandidate_via_userId: async (req, res ) => {
        try {
            console.log("get-Candidate-by-userId")
            const candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user projects').exec();
            console.log(candidate)
            res.send(candidate);
            
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    getcandidate_via_candidate_id: async (req, res ) => {
        try {
            console.log("get-candidate-by-candidate-id")
            console.log(req.body.candidateId)
            const candidate = await Candidate.findOne({_id: mongoose.Types.ObjectId(req.body?.candidateId)}).populate('user projects').exec();
            if (!candidate) return res.status(400).send("Candidate profile is not present anymore")
            console.log(candidate)
            res.send(candidate);
            
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    getinterviewers: async (req, res ) => {
        try {
            console.log("get-Interviewers")
            const interviewers = await Interviewer.find().populate('user')
            if (!interviewers){
                console.log("Interviewers not found")
                return res.status(400).json({msg : "Interviewers not found"})    
            }
            console.log("Interviewer:",interviewers)
            res.send(interviewers)
        } catch (err) {
            console.log("error", err)
            return res.status(400).send();
        }
    },
    deleteinterviewer: async( req, res) => {
        try {
            console.log("delete-interviewer")
            const interviewer = await Interviewer.findOneAndDelete({user: mongoose.Types.ObjectId(req.body.userId)})
            if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})    
            else{
                res.json({msg : "Interviewer Deleted Successfully!"}) 
            } 
        } catch (error) {
            return res.status(500).json({msg: err.message})
        } 
    },
    addpost: async (req,res) =>{
        try {
            console.log("Add-Post")
            // console.log(req.body.expiryDate);
            // console.log(req.body.expiryTime);
            const {title, salary, job_description, work_hours, post_picture, skills, location, experience, qualification, careerLevel, expiryDate, expiryTime} = req.body
            console.log("Post body :", req.body)
            let interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user')
            if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})    
            else{
                console.log("interviewer:", interviewer._id)
            }

            const post = new Post({
                title,salary,job_description,skills, location, experience, expiry_date: expiryDate, expiry_time: expiryTime, qualification, career_level: careerLevel, workhours: work_hours, post_picture, postedBy: mongoose.Types.ObjectId(interviewer._id)
            })
            
            await Interviewer.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
                {$push: 
                    { posts : mongoose.Types.ObjectId(post._id)
                    }
                })

            await post.save();
            console.log("Post :", post)
            res.json({msg : "Post has been added"})
        } catch (error) {
            res.status(400).json("error : " + error); 
        }
    },
    getpost: async(req, res) =>{
        console.log("get-post")
        try {
            post = await Post.findOne({_id: mongoose.Types.ObjectId(req.body.postId)}).populate('postedBy')
                if(!post) return res.status(400).json({msg : "post not found"})    
                console.log("Post: ", post)

            res.send(post)
            
        } catch (error) {
            res.status(400).json("error : " + error); 
            
        }
    },
    deletepost:async(req, res) =>{
        try {
            console.log("delete-post")
            let post = await Post.findOneAndDelete({_id: mongoose.Types.ObjectId(req.params.id)}).populate('postedBy')
                if(!post) return res.status(400).json({msg : "post not found"})    
                console.log("Post", post)

            let interviewer_id = mongoose.Types.ObjectId(post.postedBy._id);
            let interviewer = await Interviewer.findOne({_id: mongoose.Types.ObjectId(interviewer_id)}).populate('user posts')
                if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})

            console.log("Interviewer before deletion",interviewer)
    

            await Interviewer.findOneAndUpdate({_id : mongoose.Types.ObjectId(interviewer_id)},  
            {$pull: 
                { posts : mongoose.Types.ObjectId(req.params.id)
                }
            })
            console.log("Interviewer before deletion",interviewer)
            res.send("deleted post")
        } catch (error) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    getallposts: async(req, res) =>{
        try {
            console.log("get-all-posts")
            console.log("userId : ",req.body)
            const interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts').exec();
            if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})    
            else{
                console.log("interviewer:", interviewer._id)
            }
            console.log(interviewer.posts)
            res.send(interviewer.posts)
            
        } catch (error) {
            console.log("error", error)
            res.status(400).json("error : " + error); 
            
        }
    },
    getallusersposts: async (req, res) =>{
        try {
            console.log("get-all-users-posts")
            const posts = await Post.find().populate('postedBy')
                if(!posts) return res.status(400).json({msg : "posts not found"})    
            let posts_array = posts;
            let user;
            let error;
            let post;
            let new_array = new Array();
            let custom_Object;
            for (var i = 0; i < posts_array.length; i++) {
                post = posts_array[i]
                user = await Users.findOne({_id: mongoose.Types.ObjectId(post.postedBy.user)});

                if(!user) {
                    error = "User Not found"
                    break;
                }
                custom_Object = {
                    "_id" : post._id,
                    "title" : post.title,
                    "salary" : post.salary,
                    "job_description" : post.job_description,
                    "post_picture" : post.post_picture,
                    "createdAt": post.createdAt,
                    "postedBy_id" : user._id,
                    "postedBy_name" : user.name,
                    "postedBy_avatar": user.avatar
                }
                new_array.push(custom_Object)
            }

            if(error) {
                res.status(400).json("User found")
            }
            if (!error){
                res.send(new_array)
            }
            

        } catch (error) {
            console.log("error", error)
            res.status(400).json("error : " + error); 
            
        }
    },
    updatepost: async (req, res) => {
        try {
            console.log("Edit-Post")
            // const {postId, title, salary, job_description, work_hours, post_picture} = req.body
            // console.log("Post body workhours :", req.body.work_hours)

            
            // await Post.findOneAndUpdate({_id : mongoose.Types.ObjectId(postId)},  
            //     {
            //         title, salary, job_description, workhours: work_hours, post_picture
            //     })
                
            // res.json({msg : "Post has been Updated"})

            const {postId ,title, salary, job_description, work_hours, post_picture, skills, location, experience, qualification, careerLevel, expiryDate, expiryTime} = req.body
            console.log("Post body workhours :", req.body.work_hours)
     
            await Post.findOneAndUpdate({_id : mongoose.Types.ObjectId(postId)},  
                {
                    title,salary,job_description,skills, location, experience, expiry_date: expiryDate, expiry_time: expiryTime, qualification, career_level: careerLevel, workhours: work_hours, post_picture
                })
            res.json({msg : "Post has been Updated"})
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    changeRole: async (req, res) => {
        try {
            console.log("ChangeRole req.params.id: : ",req.params.id);
            console.log("role to change =", req.body.role) 
            const {role} = req.body;
            await Users.findOneAndUpdate({_id: req.params.id}, {
                role
            })
            res.json({msg : "Role Updated Successfully!"}) 
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },
    send_email_to_interviewer : async (req, res) =>{
        try {
            console.log("send email to interviewer");
            const {interviewer_user_Id, candidate_user_Id, message} = req.body;
            
            const interviewer = await (await Users.findOne({_id : mongoose.Types.ObjectId(interviewer_user_Id)}));
            if(!interviewer) return res.status(400).json("The Interviewer with this id is no more available")
            
            const candidate = await Users.findOne({_id : mongoose.Types.ObjectId(candidate_user_Id)});
            if(!candidate) return res.status(400).json("The candidate with this id is no more available")

            const candidate_profile = await Candidate.findOne({user : mongoose.Types.ObjectId(candidate_user_Id)}).populate('user');
            if(!candidate_profile) return res.status(400).json("The candidate profile with this id is no more available")
            
            //adding notification and saving
            const interviewerToEdit = await (await Users.findOne({_id : mongoose.Types.ObjectId(interviewer_user_Id)}));
                 if(!interviewerToEdit) return res.status(400).json("The Interviewer with this id is no more available")         
            interviewerToEdit.interviewer_notifications.push(`An email has been sent by ${candidate_profile?.user?.name}`)
            interviewerToEdit.save();
            
            const toEmail = interviewer.email;
            const toName = interviewer.name;
            const sentByName = candidate.name;
            const button_url = `http://localhost:3000/user/open-candidate-profile-page/${candidate_profile._id}`
            
            console.log(button_url) 
            
            sendEmailToCandidate(toEmail, toName, sentByName, button_url, message);
            res.json("Email has been sent");
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    send_email_to_candidate : async (req, res) =>{
        try {
            console.log("send email to candidate");
            const {interviewer_user_Id, candidate_user_Id, message} = req.body;
            
            const candidate = await Users.findOne({_id : mongoose.Types.ObjectId(candidate_user_Id)});
            if(!candidate) return res.status(400).json("The candidate with this id is no more available")

            console.log(candidate.email)
            const interviewer = await Users.findOne({_id : mongoose.Types.ObjectId(interviewer_user_Id)});
            if(!interviewer) return res.status(400).json("The interviewer with this id is no more available")

            const interviewer_profile = await Interviewer.findOne({user : mongoose.Types.ObjectId(interviewer_user_Id)}).populate('user');
            if(!interviewer_profile) return res.status(400).json("The interviewer profile with this id is no more available")
  
            //adding notification and saving
            const candidateToEdit = await Users.findOne({_id : mongoose.Types.ObjectId(candidate_user_Id)});
                if(!candidateToEdit) return res.status(400).json("The candidate with this id is no more available")         
            candidateToEdit.candidate_notifications.push(`An email has been sent by ${interviewer_profile?.user?.name}`)
            candidateToEdit.save();

            const toEmail = candidate.email;
            const toName = candidate.name;
            const sentByName = interviewer.name;
            const button_url = `http://localhost:3000/user/open-interviewer-profile-page/${interviewer_profile._id}`
            
            console.log(button_url) 
            
            sendEmailToCandidate(toEmail, toName, sentByName, button_url, message);
            res.json("Email has been sent");
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },
    addcandidate_via_user_id: async (req, res ) => {
        try {
            console.log("add-candidate-via-user-id")
            const {
                userId,
                expected_salary,
                age,
                city,
                experience,           
                career_level,
                postal_address,
                phone_number,
                skills,
               
                // Education
                qualification,
                institute_name,
                completion_year,


                //Add Project
                title,
                project_URL, 
                project_description, 

                // Job Preference
                previous_jobs_salary, desired_job_titles
                
                
            } = req.body;

            // console.log(req.body)

            var job_preference_Obj = { 
                desired_job_titles: req.body.desired_job_titles,
                previous_jobs_salary: req.body.previous_jobs_salary ,    
            };

            var education_Obj = { 
                qualification: req.body.qualification,
                institute_name: req.body.institute_name,
                completion_year: req.body.completion_year
            };
            
            let candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user projects')
            if(!candidate) return res.status(400).json({msg : "Candidate not found"})


            await Candidate.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
                {
                    userId, 
                    age, 
                    city, 
                    experience,
                    career_level,
                    expected_salary,
                    postal_address,
                    skills,
                    phone_number,
                    job_preference: job_preference_Obj,
                    education: education_Obj            
                })

            const project = new Project({
                title,
                project_URL, 
                project_description,
                madeBy: mongoose.Types.ObjectId(candidate._id) 
            })

            await Candidate.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
            {$push: 
                { projects : mongoose.Types.ObjectId(project._id)
                }
            })
            
            await project.save();

            // candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('projects')
            // if(!candidate) return res.status(400).json({msg : "Candidate not found"})
            // console.log(candidate);

            res.json({msg : "Information has been added"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    updatecandidate_via_user_id: async (req, res ) => {
        try {
            console.log("update-candidate-via-user-id")
            const {
                userId,
                expected_salary,
                age,
                city,
                experience,           
                career_level,
                postal_address,
                phone_number,
                skills,
               
                // Education
                qualification,
                institute_name,
                completion_year,


                // Job Preference
                previous_jobs_salary, desired_job_titles
                
                
            } = req.body;

            // console.log(req.body)

            var job_preference_Obj = { 
                desired_job_titles: req.body.desired_job_titles,
                previous_jobs_salary: req.body.previous_jobs_salary ,    
            };

            var education_Obj = { 
                qualification: req.body.qualification,
                institute_name: req.body.institute_name,
                completion_year: req.body.completion_year
            };
            
            let candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user projects')
            if(!candidate) return res.status(400).json({msg : "Candidate not found"})


            await Candidate.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
                {
                    userId, 
                    age, 
                    city, 
                    experience,
                    career_level,
                    expected_salary,
                    postal_address,
                    skills,
                    phone_number,
                    job_preference: job_preference_Obj,
                    education: education_Obj            
                })

            // candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('projects')
            // if(!candidate) return res.status(400).json({msg : "Candidate not found"})
            // console.log(candidate);

            res.json({msg : "Information has been updated"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    addinterviewer_via_user_id: async (req, res ) => {
        try {
            console.log("add-interviewer-via-user-id")
            const {
                userId,
                age,
                city,
                phone_number,
                postal_address,
            
                // Education
                qualification,
                institute_name,
                completion_year,

                //Add a company
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no

            } = req.body;

            // console.log(req.body)


            var education_Obj = { 
                qualification: req.body.qualification,
                institute_name: req.body.institute_name,
                completion_year: req.body.completion_year
            };
            
            let interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            if(!interviewer) return res.status(400).json({msg : "interviewer not found"})


            await Interviewer.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
                {
                    userId,
                    age,
                    city,
                    phone_number,
                    postal_address,
                    education: education_Obj            
                })

            const company = new Company({
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no,
                madeBy: mongoose.Types.ObjectId(interviewer._id) 
            })

            await Interviewer.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
            {$push: 
                { companies : mongoose.Types.ObjectId(company._id)
                }
            })
            
            await company.save();

            // interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            // if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})
            // console.log(interviewer);

            res.json({msg : "Information has been added"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    updateinterviewer_via_user_id: async (req, res ) => {
        try {
            console.log("update-interviewer-via-user-id")
            const {
                userId,
                age,
                city,
                phone_number,
                postal_address,
            
                // Education
                qualification,
                institute_name,
                completion_year,

            } = req.body;

            // console.log(req.body)


            var education_Obj = { 
                qualification: req.body.qualification,
                institute_name: req.body.institute_name,
                completion_year: req.body.completion_year
            };
            
            let interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            if(!interviewer) return res.status(400).json({msg : "interviewer not found"})


            await Interviewer.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
                {
                    userId,
                    age,
                    city,
                    phone_number,
                    postal_address,
                    education: education_Obj            
                })


            // interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            // if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})
            // console.log(interviewer);

            res.json({msg : "Information has been added"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    updatecompany_via_company_id: async (req, res ) => {
        try {
            console.log("update-company-by-company-id")
            const {
                //Add a company
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no

            } = req.body;

            const company = await Company.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.companyId)},    
            {
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no,             
            })
            console.log(company)
            res.json({msg : "Information has been updated"})
            
        } catch (err) {
            console.log("error", err.message)
            return res.status(500).json({msg: err.message})
        }
    },
    deletecompany_via_company_id: async (req, res ) => {
        
        try {
            console.log("delete-company-via-company-id")
            console.log(req.params.id)
            let company = await Company.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).populate('madeBy');
                if(!company) return res.status(400).json({msg : "Company not found"})
            
            let interviewer_id = mongoose.Types.ObjectId(company.madeBy._id);
            let interviewer = await Interviewer.findOne({_id: mongoose.Types.ObjectId(interviewer_id)})
                if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})

            console.log("Interviewer before deletion",interviewer)

            company = await Company.findOneAndDelete({_id: mongoose.Types.ObjectId(req.params.id)})
                if(!company) return res.status(400).json({msg : "Company not found"})    

            await Interviewer.findOneAndUpdate({_id : mongoose.Types.ObjectId(interviewer_id)},  
            {$pull: 
                { companies : mongoose.Types.ObjectId(req.params.id)
                }
            })
            console.log("Interviewer after deletion",interviewer)
            res.json({msg: "Company has been deleted"})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message})
            
        }
    },  
    addcompany_via_user_id: async (req, res ) => {
        try {
            console.log("add-company-via-user-id")
            const {
                userId,
                

                //Add a company
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no

            } = req.body;

            // console.log(req.body)

            
            let interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            if(!interviewer) return res.status(400).json({msg : "interviewer not found"})


            const company = new Company({
                company_name,
                ceo_name,
                company_address,
                company_description,
                industry,
                ownership_type,
                origin,
                employees_no,
                operating_since,
                offices_no,
                contact_email,
                contact_no,
                madeBy: mongoose.Types.ObjectId(interviewer._id) 
            })

            await Interviewer.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
            {$push: 
                { companies : mongoose.Types.ObjectId(company._id)
                }
            })
            
            await company.save();

            // interviewer = await Interviewer.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user posts companies')
            // if(!interviewer) return res.status(400).json({msg : "Interviewer not found"})
            // console.log(interviewer);

            res.json({msg : "Company has been added"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    updateproject_via_project_id: async (req, res ) => {
        try {
            console.log("update-company-by-project-id")
            const {
                projectId,
                
                //Add a Project
                title,
                project_URL, 
                project_description, 

            } = req.body;

            const project = await Project.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.projectId)},    
            {
                title,
                project_URL, 
                project_description,           
            })
            console.log(project)
            res.json({msg : "Information has been updated"})
            
        } catch (err) {
            console.log("error", err.message)
            return res.status(500).json({msg: err.message})
        }
    },
    deleteproject_via_project_id: async (req, res ) => {
        
        try {
            console.log("delete-company-via-project-id")
            console.log(req.params.id)
            let project = await Project.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).populate('madeBy');
                if(!project) return res.status(400).json({msg : "Project not found"})
            
            let candidate_id = mongoose.Types.ObjectId(project.madeBy._id);
            let candidate = await Candidate.findOne({_id: mongoose.Types.ObjectId(candidate_id)})
                if(!candidate) return res.status(400).json({msg : "Candidate not found"})

            console.log("Candidate before deletion",candidate)

            project = await Project.findOneAndDelete({_id: mongoose.Types.ObjectId(req.params.id)})
                if(!project) return res.status(400).json({msg : "Company not found"})    

            await Candidate.findOneAndUpdate({_id : mongoose.Types.ObjectId(candidate_id)},  
            {$pull: 
                { projects : mongoose.Types.ObjectId(req.params.id)
                }
            })
            console.log("Candidate after deletion",candidate)
            res.json({msg: "Project has been deleted"})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message})
            
        }
    },  
    addproject_via_user_id: async (req, res ) => {
        try {
            console.log("add-project-via-user-id")
            const {
                userId,
                
                //Add a Project
                title,
                project_URL, 
                project_description, 

            } = req.body;

            // console.log(req.body)

            
            let candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('user projects')
            if(!candidate) return res.status(400).json({msg : "Candidate not found"})


            const project = new Project({
                title,
                project_URL, 
                project_description,
                madeBy: mongoose.Types.ObjectId(candidate._id) 
            })

            await Candidate.findOneAndUpdate({user : mongoose.Types.ObjectId(req.body.userId)},  
            {$push: 
                { projects : mongoose.Types.ObjectId(project._id)
                }
            })
            
            await project.save();

            // candidate = await Candidate.findOne({user: mongoose.Types.ObjectId(req.body.userId)}).populate('projects')
            // if(!candidate) return res.status(400).json({msg : "Candidate not found"})
            // console.log(candidate);

            res.json({msg : "Project has been added"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}
function validatePassword(pass) {
    const re = /^(?=(.*\d){1})(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[!@#$%]){1})[0-9a-zA-Z!@#$%]{6,12}$/;
    return re.test(pass);
}

function validateName(name) {
    const re = /^[a-zA-Z0-9]{3,12}$/;
    return re.test(name);
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payLoad) => {
    return jwt.sign(payLoad, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: "5m"})
}

const createAccessToken = (payLoad) => {
    return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7m"})
}

const createRefreshToken = (payLoad) => {
    return jwt.sign(payLoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
}

module.exports = userCtrl;