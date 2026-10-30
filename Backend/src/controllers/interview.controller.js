 
const { PDFParse } = require("pdf-parse");

const {
    generateInterviewReport: generateAIInterviewReport,
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        // 1. Validate authenticated user
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required. Please log in and try again.",
            });
        }

        // 2. Validate uploaded resume
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume as a PDF file.",
            });
        }

        // 3. Validate PDF file type
        const isPdf =
            resumeFile.mimetype === "application/pdf" ||
            resumeFile.originalname?.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Please upload a PDF resume.",
            });
        }

        // 4. Validate request body
        const { selfDescription, jobDescription } = req.body;

        if (
            typeof selfDescription !== "string" ||
            !selfDescription.trim() ||
            typeof jobDescription !== "string" ||
            !jobDescription.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Self-description and job description are required.",
            });
        }

        // 5. Validate uploaded file buffer
        if (!resumeFile.buffer || resumeFile.buffer.length === 0) {
            return res.status(400).json({
                success: false,
                message: "The uploaded resume file is empty.",
            });
        }

        // 6. Extract text from PDF using pdf-parse v2.4.5
        let resumeText;
        const parser = new PDFParse({
            data: resumeFile.buffer,
        });

        try {
            const pdfData = await parser.getText();
            resumeText = pdfData.text?.trim();
        } catch (pdfError) {
            console.error("PDF Parsing Error:", pdfError);

            return res.status(400).json({
                success: false,
                message:
                    "Unable to read the PDF. Please upload a valid, readable PDF resume.",
            });
        } finally {
            await parser.destroy();
        }

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                message:
                    "No readable text was found in the PDF resume. Scanned PDFs may require OCR.",
            });
        }

        // 7. Generate the AI interview report
        const aiReport = await generateAIInterviewReport({
            resumeData: resumeText,
            selfDescriptionData: selfDescription.trim(),
            jobDescriptionData: jobDescription.trim(),
        });

        // 8. Validate AI response
        if (!aiReport || typeof aiReport !== "object") {
            throw new Error(
                "The AI service returned an invalid response."
            );
        }

        if (
            !Array.isArray(aiReport.technicalQuestions) ||
            !Array.isArray(aiReport.behavioralQuestions) ||
            !Array.isArray(aiReport.skillGaps) ||
            !Array.isArray(aiReport.preparationPlan) ||
            typeof aiReport.matchScore !== "number" ||
            !Number.isFinite(aiReport.matchScore)
        ) {
            throw new Error(
                "The AI report is missing required fields or has an invalid format."
            );
        }

        if (
            aiReport.matchScore < 0 ||
            aiReport.matchScore > 100
        ) {
            throw new Error(
                "The AI match score must be between 0 and 100."
            );
        }

        // 9. Map technical questions
        const technicalQuestions =
            aiReport.technicalQuestions.map((q) => ({
                question: q.question || "",
                intention: q.intention || "",
                answer: q.expectedAnswer || "",
            }));

        // 10. Map behavioral questions
        const behavioralQuestions =
            aiReport.behavioralQuestions.map((q) => ({
                question: q.question || "",
                intention: q.intention || "",
                answer: q.expectedAnswer || "",
            }));

        // 11. Map skill gaps
        const skillGaps = aiReport.skillGaps.map((gap) => ({
            skills: gap.skill || "",
            severity: gap.severity || "medium",
        }));

        // 12. Prepare report data
        const reportData = {
            user: userId,
            jobDescription: jobDescription.trim(),
            resume: resumeText,
            selfDescription: selfDescription.trim(),
            matchScore: aiReport.matchScore,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan: aiReport.preparationPlan,
        };

        // 13. Save report to MongoDB
        const interviewReport =
            await interviewReportModel.create(reportData);

        // 14. Return successful response
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            report: interviewReport,
        });
    } catch (error) {
        console.error(
            "Generate Interview Report Error:",
            error.stack || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate the interview report.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
}


async function getInterviewReportController(req, res) {
    const {intertviewId} = req.params;
    const interviewReport = await interviewReportModel.findOne({_id: intertviewId ,user: req.user._id});
    if (!interviewReport) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found.",
        });
    }
    return res.status(200).json({
        success: true,
        report: interviewReport,
    });
}

async function getAllInterview(req, res) {
    const interviewReports = (await interviewReportModel.find({ user: req.user._id })).toSorted({createdAt: -1}).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
     res.status(200).json({
        success: true,
        reports: interviewReports,
    });
    

}


module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllInterview,
};
 
