  
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const {
    generateInterviewReport,
} = require("./src/services/ai.service");

const {
    resumeData,
    selfDescriptionData,
    jobDescriptionData,
} = require("./src/services/temp");

async function startServer() {
    try {
        await connectDB();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });

        const report = await generateInterviewReport({
            resumeData,
            selfDescriptionData,
            jobDescriptionData,
        });

         
    } catch (error) {
        console.error("Application Error:", error.message);
    }
}

startServer();
 
