 import axios from "axios";

// Update the base URL if your backend runs on a different port
const API = axios.create({
    baseURL: "http://localhost:3000/api/interview",
    withCredentials: true,
});

// Generate a new interview report
export const generateInterviewReport = async (formData) => {
    if (!(formData instanceof FormData)) {
        throw new Error(
            "Expected FormData containing jobDescription, selfDescription, and resume."
        );
    }

    try {
        const response = await API.post("/", formData);

        return response.data;
    } catch (error) {
        console.error(
            "Generate interview report failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get a specific interview report by ID
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await API.get(
            `/report/${encodeURIComponent(interviewId)}`
        );

        return response.data;
    } catch (error) {
        console.error(
            "Get interview report failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};

// Get all interview reports for the authenticated user
export const getAllInterviewReports = async () => {
    try {
        const response = await API.get("/");

        return response.data;
    } catch (error) {
        console.error(
            "Get all interview reports failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export default API;
