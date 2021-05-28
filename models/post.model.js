const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'Interviewer' },
    title: {
        type : String,
        default: "" 
    },
    salary: {
        type : Number,
        default: 0 
    },
    job_description: {
        type : String,
        default: "" 
    },
    workhours:{
        type : Number,
        default: 0 
    },
    post_picture: {
        type : String,
        default: "https://res.cloudinary.com/xapper72/image/upload/v1619373955/avatar/job-post-default_bu5cbs.jpg"
    },
    skills : [],
    location:{
        type : String,
        default: "" 
    },
    experience: {
        type : String,
        default: "" 
    },
    qualification: {
        type : String,
        default: "" 
    },
    career_level: {
        type : String,
        default: "" 
    },
    expiry_date: {
        type: Date,
        default: ""
    },
    expiry_time: {
        type: Date,
        default: ""
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Post", postSchema);