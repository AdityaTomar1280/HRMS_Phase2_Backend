// services/resumeService.js
const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractTextFromWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    throw error;
  }
}

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

async function summarizeResume(resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Create a concise summary of the following resume: ${resumeText}\n\nSummary:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini API Error (Summary):", error);
    return "Unable to summarize resume.";
  }
}

async function compareResumeToJobDescription(resumeText, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const extractionPrompt = `From the following resume, extract the full name and email address. Respond STRICTLY in JSON format, WITHOUT code block markers:
{
    "name": "[Full Name]",
    "email": "[Email Address]"
}
Resume: ${resumeText}`;

    const analysisPrompt = `Analyze the following resume in relation to the job description. Provide a similarity score (0-100), list the common skills, and state whether the resume is a good fit for the job (Yes/No).

Job Description: ${jobDescription}
Resume: ${resumeText}

Respond STRICTLY in JSON format, WITHOUT code block markers:
{
    "similarityScore": [Score],
    "commonSkills": ["skill1", "skill2", ...],
    "preferred": "[Yes/No]"
}`;

    const extractionResult = await model.generateContent(extractionPrompt);
    let extractionText = (await extractionResult.response).text();
    extractionText = extractionText.replace(/```json\n|```/g, "");

    let extractionJsonResponse;
    try {
      extractionJsonResponse = JSON.parse(extractionText);
      if (!extractionJsonResponse.name || !extractionJsonResponse.email) {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      console.warn("Invalid extraction response:", e);
      extractionJsonResponse = { name: "N/A", email: "N/A" };
    }

    const analysisResult = await model.generateContent(analysisPrompt);
    let analysisText = (await analysisResult.response).text();
    analysisText = analysisText.replace(/```json\n|```/g, "");

    let analysisJsonResponse;
    try {
      analysisJsonResponse = JSON.parse(analysisText);
      if (
        typeof analysisJsonResponse.similarityScore !== "number" ||
        !Array.isArray(analysisJsonResponse.commonSkills) ||
        typeof analysisJsonResponse.preferred !== "string"
      ) {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      console.warn("Invalid analysis response:", e);
      analysisJsonResponse = {
        similarityScore: 0,
        commonSkills: [],
        preferred: "No",
      };
    }

    return {
      name: extractionJsonResponse.name,
      email: extractionJsonResponse.email,
      similarityScore: analysisJsonResponse.similarityScore,
      commonSkills: analysisJsonResponse.commonSkills,
      preferred: analysisJsonResponse.preferred,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      name: "N/A",
      email: "N/A",
      similarityScore: 0,
      commonSkills: [],
      preferred: "No",
    };
  }
}

module.exports = {
  extractTextFromWord,
  extractTextFromPDF,
  summarizeResume,
  compareResumeToJobDescription,
};