// models/QualifiedCandidate.js
const mongoose = require('mongoose');

// const QualifiedCandidateSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true }, // Unique email in this collection
//   resumeSummary: { type: String },
//   similarityScore: { type: Number, default: 0 },
//   // You might want to add a field to indicate the source or job this qualification is for
//   // jobProfile: { type: String },
//   savedAt: { type: Date, default: Date.now }
// });

const QualifiedCandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: String,
  location: String,
  resumeSummary: { type: String },
  similarityScore: { type: Number },
  keySkills: [String],
  commonSkills: [String],
  totalExperienceYears: { type: Number, default: 0 },
  mainDomain: { type: String },
  education: [
    {
      degree: String, // Example: "Bachelor of Science in Computer Science"
      institution: String, // Example: "University of California"
      year: String, // Example: "2015-2019"
    },
  ],
  interviewStatus: {
    type: String,
    enum: [
      "Not Started",
      "Resume Screening",
      "Phone Interview",
      "Technical Assessment",
      "On-site Interview",
      "Reference Check",
      "Offer Extended",
      "Hired",
      "Rejected",
    ],
    default: "Not Started",
  },
  interviewNotes: [
    {
      stage: String,
      note: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  nextInterviewDate: { type: Date },
  resumeFile: {
    filename: String,
    contentType: String,
    data: Buffer,
  },
  companiesWorked: [
    {
      companyName: String,
      role: String,
      duration: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  roleName: { type: String },
});

// Update the updatedAt field before saving
QualifiedCandidateSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('QualifiedCandidate', QualifiedCandidateSchema);