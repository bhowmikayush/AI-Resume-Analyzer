 
const express = require("express");

const interviewRouter = express.Router();

const authmiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middleware/file.middleware");

// Generate interview report
interviewRouter.post(
    "/",
    authmiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);


interviewRouter.get("/report/:interviewId", authmiddleware.authUser, interviewController.getInterviewReportController);

interviewRouter.get("/",authmiddleware.authUser,interviewController.getAllInterview)

module.exports = interviewRouter;
 
