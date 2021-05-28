
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const {OAuth2} = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const Hogan = require('hogan.js');
var fs = require('fs');
var template = fs.readFileSync('views/email.hjs', 'utf-8');
var compiledTemplate = Hogan.compile(template);


const { 
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env;

const oauth2Client = new OAuth2 (
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

//send mail

const sendEmailToCandidate = (toEmail, toName, sentByName, button_url, message) => {
    oauth2Client.setCredentials({
        refresh_token : MAILING_SERVICE_REFRESH_TOKEN
    })
    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({

        service: "gmail",
        auth: {
            type : "OAuth2",
            user : SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken : MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to : toEmail,
        subject: "InterviewMe!",
        html: compiledTemplate.render({toName: toName, sentByName: sentByName, button_url: button_url, message: message})
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if(err) return err;
        return infor
    })
}

module.exports = sendEmailToCandidate
