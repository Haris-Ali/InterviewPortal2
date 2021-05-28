const mongoose = require('mongoose')
const meetingSchema = new mongoose.Schema({
    madeBy: { type: mongoose.Schema.ObjectId, ref: 'Interviewer' },
    candidate_user_email: { 
        type : String,
        required: [true, "Please enter your email!"],
        trim: true 
    },
    pin:{
        type: String,
        required: true,
        default: "0"
    },
    expiry_date: {
        type: Date,
        default: ""
    },
    expiry_time: {
        type: Date,
        default: ""
    },
    start_date: {
        type: Date,
        default: ""
    },
    start_time: {
        type: Date,
        default: ""
    },
    call_start_time: {
        type: Date,
        default: ""
    },
    call_ending_time:{
        type: Date,
        default: ""
    },
    password: {
        type : String,
        required: [true, "Please enter your password!"]
    },
    started : {
        type: Number,
        default: 0 //0 for not started, 1 for started
    },
    joined: {
        type: Number,
        default: 0 //0 for not joined, 1 for joined
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Meeting", meetingSchema);