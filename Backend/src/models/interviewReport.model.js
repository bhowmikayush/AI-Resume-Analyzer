const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({

    question:{
        type: String,
        required: [true, "Question is required"]
    },
    intention :{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{

        type: String,
        required: [true, "Answer is required"]
    },
    _id: false


})

const BehavioralQuestionSchema = new mongoose.Schema({
    
    question:{
        type: String,
        required: [true, "Question is required"]
    },
    intention :{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{

        type: String,
        required: [true, "Answer is required"]
    },
    _id: false


})

const skillGapSchema = new mongoose.Schema({

    skills:{
        type: String,
        required: [true, "Skills is required"]
    },
    severity :{
        type: String,
        enum: ['low', 'medium', 'high']
    } ,
    _id: false

})

const preparationplanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"]
    },
    focus:{
        type: String,
        required: [true, "Focus is required"]
    },
    tasks :[{
        type: String,
        required: [true, "Task is required"]
    }]


})

const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required"]
    },
    resume:{
        type: String,
    },
    selfDescription:{
        type: String,
    },
    matchScore:{
        type: Number,
        min:0,
        max:100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [BehavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationplanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReportModel;