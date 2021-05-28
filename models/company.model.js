const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    madeBy: { type: mongoose.Schema.ObjectId, ref: 'Interviewer' },
    company_name: {
        type: String,
        default: ""
    },
    ceo_name: {
        type: String,
        default: ""
    },    
    company_address: {
        type: String,
        default: ""
    },
    company_description:{
        type: String,
        defualt: ""
    },
    industry: {
        type: String,
        default: ""
    },
    ownership_type : {
        type: String,
        defualt: ""  //public/ private/ sole partnership/ government/ ngo
    },
   
    origin: {
        type: String,
        default: ""
    },
    employees_no: {
        type: String,
        default: ""
    },
    operating_since :{
        type: String,
        default: ""
    },
    offices_no: {
        type: Number,
        default: 0,
    },
    contact_email: {
        type: String,
        default: "",
    },
    contact_no: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Company", companySchema);