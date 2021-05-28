const mongoose = require('mongoose')
const CandidateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'Users' },
    projects: [{type: mongoose.Schema.ObjectId, ref: "Project"}],
   
    age: {
        type : Number,
        default: 0 
    },

    city: {
        type : String,
        default: "" 
    },

    experience: {
        type : String,
        default: "" 
    },

    
    
    career_level: {
        type : String,
        default: "" 
    },

    expected_salary:{
        type : Number,
        default: 0 
    },

    postal_address: {
        type: String,
        default: ""
    },

    job_preference: {
        desired_job_titles: [],
        previous_jobs_salary:{
            type: String,
            default: ""
        }
    },

    education: {
        qualification: {
            type : String,
            default: "" 
        },
        institute_name: {
            type: String,
            default: ""
        },
        completion_year: {
            type: String,
            default: ""
        }
    },

    phone_number:{
        type: String,
        default: ""        
    },
    skills:[],

}, {
    timestamps: true
})

module.exports = mongoose.model("Candidate", CandidateSchema);