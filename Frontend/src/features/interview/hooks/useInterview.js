 import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
} from "../services/interview.api";

import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    } = context;

    // Generate a new interview report using FormData
    const generateReport = async (formData) => {
        setLoading(true);

        try {
            // Pass FormData directly so Multer can receive the PDF
            const response = await generateInterviewReport(formData);

            // Support either response property name
            const generatedReport =
                response?.report || response?.interviewReport;

            if (generatedReport) {
                setReport(generatedReport);
            }

            return response;
        } catch (error) {
            console.error(
                "Error generating interview report:",
                error.response?.data || error.message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch an interview report by ID
    const getReportById = async (interviewId) => {
        setLoading(true);

        try {
            const response =
                await getInterviewReportById(interviewId);

            const fetchedReport =
                response?.report || response?.interviewReport;

            if (fetchedReport) {
                setReport(fetchedReport);
            }

            return response;
        } catch (error) {
            console.error(
                "Error fetching interview report by ID:",
                error.response?.data || error.message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch all interview reports
    const getAllReports = async () => {
        setLoading(true);

        try {
            const response = await getAllInterviewReports();

            setReports(response?.reports || []);

            return response;
        } catch (error) {
            console.error(
                "Error fetching all interview reports:",
                error.response?.data || error.message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getAllReports,
    };
};
