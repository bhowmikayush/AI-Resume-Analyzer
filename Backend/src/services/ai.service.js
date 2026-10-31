 
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const interviewReportSchema = z.object({
    candidateSummary: z.string(),
    matchScore: z.number().min(0).max(100),
    jobMatchAnalysis: z.string(),
    technicalSkillsAnalysis: z.string(),

    strengths: z.array(z.string()),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            expectedAnswer: z.string(),
        })
    ).length(5),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            expectedAnswer: z.string(),
        })
    ).length(3),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
            explanation: z.string(),
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number().int().min(1).max(7),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ).length(7),

    resumeImprovements: z.array(z.string()),
    finalRecommendations: z.array(z.string()),
});

const interviewReportJsonSchema = {
    type: "OBJECT",
    properties: {
        candidateSummary: { type: "STRING" },
        matchScore: { type: "NUMBER" },
        jobMatchAnalysis: { type: "STRING" },
        technicalSkillsAnalysis: { type: "STRING" },

        strengths: {
            type: "ARRAY",
            items: { type: "STRING" },
        },

        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    expectedAnswer: { type: "STRING" },
                },
                required: ["question", "intention", "expectedAnswer"],
            },
        },

        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    expectedAnswer: { type: "STRING" },
                },
                required: ["question", "intention", "expectedAnswer"],
            },
        },

        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: {
                        type: "STRING",
                        enum: ["low", "medium", "high"],
                    },
                    explanation: { type: "STRING" },
                },
                required: ["skill", "severity", "explanation"],
            },
        },

        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER" },
                    focus: { type: "STRING" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                    },
                },
                required: ["day", "focus", "tasks"],
            },
        },

        resumeImprovements: {
            type: "ARRAY",
            items: { type: "STRING" },
        },

        finalRecommendations: {
            type: "ARRAY",
            items: { type: "STRING" },
        },
    },

    required: [
        "candidateSummary",
        "matchScore",
        "jobMatchAnalysis",
        "technicalSkillsAnalysis",
        "strengths",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
        "resumeImprovements",
        "finalRecommendations",
    ],
};

async function generateInterviewReport({
    resumeData,
    selfDescriptionData,
    jobDescriptionData,
}) {
    if (
        typeof resumeData !== "string" ||
        !resumeData.trim() ||
        typeof selfDescriptionData !== "string" ||
        !selfDescriptionData.trim() ||
        typeof jobDescriptionData !== "string" ||
        !jobDescriptionData.trim()
    ) {
        throw new Error(
            "Resume, self-description, and job description are required."
        );
    }

    const prompt = `
You are an expert technical recruiter and interview coach.

Analyze the following candidate for the target job.

RESUME:
${resumeData}

SELF-DESCRIPTION:
${selfDescriptionData}

JOB DESCRIPTION:
${jobDescriptionData}

Return one JSON object matching the supplied JSON schema exactly.

IMPORTANT STRUCTURE RULES:
- technicalQuestions must contain exactly 5 OBJECTS, not strings.
- Each technical question object must have question, intention, expectedAnswer.
- behavioralQuestions must contain exactly 3 OBJECTS, not strings.
- Each behavioral question object must have question, intention, expectedAnswer.
- skillGaps must contain OBJECTS with skill, severity, explanation.
- preparationPlan must contain exactly 7 OBJECTS, one for each day from 1 through 7.
- Each preparation-plan object must have day, focus, tasks.
- strengths, resumeImprovements, finalRecommendations, and tasks must be arrays of strings.
- severity must be low, medium, or high.
- matchScore must be a number from 0 to 100.
- Do not invent candidate qualifications or experience.
- Base the analysis on the provided information.
- Return no Markdown or text outside the JSON object.
`;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: interviewReportJsonSchema,
                },
            });

            if (!response.text) {
                throw new Error("Gemini returned an empty response.");
            }

            let parsedReport;

            try {
                parsedReport = JSON.parse(response.text);
            } catch {
                throw new Error("Gemini returned invalid JSON.");
            }

            const result = interviewReportSchema.safeParse(parsedReport);

            if (!result.success) {
                throw new Error(
                    "Gemini report does not match the required schema."
                );
            }

            return result.data;
        } catch (error) {
            const message = error.message || "";

            const retryable =
                /503|429|500|UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL/i.test(
                    message
                );

            if (!retryable || attempt === 3) {
                throw error;
            }

            const delay = 1000 * 2 ** (attempt - 1);

            await sleep(delay);
        }
    }
}

module.exports = {
    generateInterviewReport,
};
