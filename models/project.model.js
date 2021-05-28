const mongoose = require('mongoose')
const projectSchema = new mongoose.Schema({
    madeBy: { type: mongoose.Schema.ObjectId, ref: 'Candidate' },
    title: {
        type : String,
        default: "" 
    },
    project_URL: {
        type : String,
        default: "" 
    },
    project_description: {
        type : String,
        default: "" 
    },

    
}, {
    timestamps: true
})

module.exports = mongoose.model("Project", projectSchema);