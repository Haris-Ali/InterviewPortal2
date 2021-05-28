const mongoose = require('mongoose')
const interviewerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'Users' },
    posts: [{type: mongoose.Schema.ObjectId, ref: "Post"}],
    companies: [{type: mongoose.Schema.ObjectId, ref: "Company"}],
    
    age: {
        type : Number,
        default: 0 
    },

    city: {
        type : String,
        default: "" 
    },
    phone_number: {
        type : String,
        default: "" 
    },

    postal_address: {
        type : String,
        default: "" 
    },


    education: {
        qualification: {
            type: String,
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

    
    

}, {
    timestamps: true
})

module.exports = mongoose.model("Interviewer", interviewerSchema);