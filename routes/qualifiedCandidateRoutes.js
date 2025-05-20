
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const qualifiedCandidateController = require("../controllers/qualifiedCandidateController");

// // Configure multer for resume file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../temp"));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage });

// // Basic candidate routes
// router.post("/qualified-candidates", qualifiedCandidateController.saveSelectedCandidates);
// router.get("/qualified-candidates", qualifiedCandidateController.getAllCandidates);
// router.get("/qualified-candidates/:id", qualifiedCandidateController.getCandidateById);
// router.delete("/qualified-candidates/:id", qualifiedCandidateController.deleteCandidate);

// // Resume file routes
// router.get("/qualified-candidates/:id/resume", qualifiedCandidateController.getCandidateResume);
// router.post(
//   "/qualified-candidates/:id/resume",
//   upload.single("resumeFile"),
//   qualifiedCandidateController.storeResumeFile
// );

// // Profile update route
// router.put(
//   "/qualified-candidates/:id/profile",
//   qualifiedCandidateController.updateCandidateProfile
// );

// // Interview tracking routes
// router.put(
//   "/qualified-candidates/:id/interview-status",
//   qualifiedCandidateController.updateInterviewStatus
// );
// router.get("/interview-tracking", qualifiedCandidateController.getInterviewTrackingData);


// router.post('/qualified-candidates', qualifiedCandidateController.saveToQualifiedCandidates);
// module.exports = router;
