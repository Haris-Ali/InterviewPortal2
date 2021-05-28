const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const cors = require('./cors')

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgot', userCtrl.forgotPassword)
router.post('/reset', auth,  userCtrl.resetPassword)
router.get('/infor', auth, userCtrl.getUserInfor)
router.get('/all_infor',cors.corsWithOptions,  userCtrl.getUsersAllInfor)
router.get('/logout', userCtrl.logout)
router.patch('/update', auth, userCtrl.updateUser)

router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)
router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)
router.patch('/changeRole/:id', userCtrl.changeRole)


// Social Login
router.post('/google_login', userCtrl.googleLogin)
router.post('/facebook_login', userCtrl.facebookLogin)

//test
router.post('/addtest', userCtrl.addtest)
router.post('/gettest', userCtrl.gettest)
router.post('/getresults', userCtrl.getresults)
router.post('/test', userCtrl.testapi)
router.post('/submittest', userCtrl.submittest)
router.delete('/deletetest',userCtrl.deletetest)
router.delete('/delete-test/:id', userCtrl.deletetest_via_testId)
router.patch('/edit-test-via-testId', userCtrl.edittest_via_testId)

//Interviewer
router.post('/addinterviewer',userCtrl.addinterviewer)

router.post('/get-interviewer-by-userId',userCtrl.getinterviewer_via_userId)
router.get('/getinterviewers',userCtrl.getinterviewers)
router.delete('/deleteinterviewer',userCtrl.deleteinterviewer)



//candidate
router.post('/get-candidate-by-userId',userCtrl.getcandidate_via_userId)
router.post('/get-candidate',userCtrl.getcandidate_via_candidate_id)
router.patch('/add-candidate-by-userId',userCtrl.addcandidate_via_user_id)
router.patch('/update-candidate-by-userId',userCtrl.updatecandidate_via_user_id)

//interviewer
router.post('/get-interviewer',userCtrl.getinterviewer_via_interviewer_id)
router.post('/get-interviewer-by-postId',userCtrl.getinterviewer_via_post_id)
router.patch('/add-interviewer-by-userId',userCtrl.addinterviewer_via_user_id)
router.patch('/update-interviewer-by-userId',userCtrl.updateinterviewer_via_user_id)

//post
router.post('/add-post',userCtrl.addpost)
router.post('/get-post',userCtrl.getpost)
router.get('/get-all-users-posts',userCtrl.getallusersposts)
router.post('/get-all-posts',userCtrl.getallposts)
router.delete('/delete-post/:id', userCtrl.deletepost)
router.patch('/edit-post', userCtrl.updatepost)

//company
router.patch('/update-company-by-companyId',  userCtrl.updatecompany_via_company_id)
router.delete('/delete-company/:id',  userCtrl.deletecompany_via_company_id)
router.post('/add-company-by-userId',  userCtrl.addcompany_via_user_id)


//project
router.patch('/update-project-by-projectId',  userCtrl.updateproject_via_project_id)
router.delete('/delete-project/:id',  userCtrl.deleteproject_via_project_id)
router.post('/add-project-by-userId',  userCtrl.addproject_via_user_id)



//sending Emails
router.post('/send-email-to-interviewer',userCtrl.send_email_to_interviewer)
router.post('/send-email-to-candidate',userCtrl.send_email_to_candidate)

//notifications
router.post('/pop-notifications', userCtrl.pop_notifications)

//schedule call
router.post('/get-meetings', userCtrl.getmeetings)
router.post('/get-meeting-by-meetingId', userCtrl.getmeeting_via_meetingId)
router.post('/add-meeting', userCtrl.addmeeting)
router.delete('/delete-meeting/:id',  userCtrl.deletemeeting_via_meetingId)
router.patch('/update-meeting-by-meetingId',  userCtrl.updatemeeting_via_meeting_id)
router.post('/get-meetings-via-userId-for-candidate', userCtrl.getmeetings_via_userId_for_candidate)
router.post('/compare-password-by-meetingId', userCtrl.compare_meeting_password_via_meetingId)
router.post('/update-started-meeting-by-meetingId', userCtrl.updatestarted_via_meetingId)

// For checking
router.get('/preview', function(req, res){
    res.render('../views/email.hjs', {firstName: "Will"})
})
router.post('/push', userCtrl.push_notifications)

//customUser
router.post('/add-testing-user', userCtrl.addTestingUser)

module.exports = router;