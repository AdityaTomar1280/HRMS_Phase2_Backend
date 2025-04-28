const {
  extractTextFromWord,
  extractTextFromPDF,
  summarizeResume,
  compareResumeToJobDescription,
} = require("../services/resumeServices");

const handleResumeUpload = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const jobDescription = req.body.jobDescription;
  if (!jobDescription) {
    return res.status(400).send("Job description is required.");
  }

  try {
    const resumeAnalyses = [];
    for (const file of req.files) {
      let resumeText = "";
      const filePath = file.path;
      const filename = file.originalname;

      try {
        if (
          file.mimetype === "application/msword" ||
          file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          resumeText = await extractTextFromWord(filePath);
        } else if (file.mimetype === "application/pdf") {
          resumeText = await extractTextFromPDF(filePath);
        } else {
          resumeAnalyses.push({
            filename,
            name: "N/A",
            email: "N/A",
            similarityScore: 0,
            commonSkills: [],
            preferred: "No",
            error: "Unsupported file type.",
            resumeSummary: "Unsupported file type.",
          });
          continue;
        }
      } catch (err) {
        console.error(`Error processing ${filename}:`, err);
        resumeAnalyses.push({
          filename,
          name: "N/A",
          email: "N/A",
          similarityScore: 0,
          commonSkills: [],
          preferred: "No",
          error: "Failed to extract text.",
          resumeSummary: "Failed to extract text.",
        });
        continue;
      }

      const analysis = await compareResumeToJobDescription(resumeText, jobDescription);
      const resumeSummary = await summarizeResume(resumeText);

      resumeAnalyses.push({
        filename,
        ...analysis,
        resumeSummary,
      });
    }

    res.status(200).json(resumeAnalyses);
  } catch (error) {
    console.error("Overall Error:", error);
    res.status(500).json({ message: "Analysis failed." });
  }
};

module.exports = { handleResumeUpload };