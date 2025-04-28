// const mongoose = require('mongoose');

// const candidateSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   resumeSummary: { type: String },
//   similarityScore: { type: Number },
//   interviewStatus: {
//     type: String,
//     enum: [
//       'Not Started',
//       'Resume Screening',
//       'Phone Interview',
//       'Technical Assessment',
//       'On-site Interview',
//       'Reference Check',
//       'Offer Extended',
//       'Hired',
//       'Rejected',
//     ],
//     default: 'Not Started',
//   },
//   interviewNotes: [
//     {
//       stage: String,
//       note: String,
//       createdAt: { type: Date, default: Date.now },
//     },
//   ],
//   nextInterviewDate: { type: Date },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Update the updatedAt field before saving
// candidateSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Candidate', candidateSchema);

const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeSummary: { type: String },
  similarityScore: { type: Number },
  interviewStatus: {
    type: String,
    enum: [
      'Not Started',
      'Resume Screening',
      'Phone Interview',
      'Technical Assessment',
      'On-site Interview',
      'Reference Check',
      'Offer Extended',
      'Hired',
      'Rejected',
    ],
    default: 'Not Started',
  },
  interviewNotes: [
    {
      stage: String,
      note: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  nextInterviewDate: { type: Date },
  // Resume file storage
  resumeFile: {
    filename: String,
    contentType: String,
    data: Buffer,
  },
  // Additional profile details
  phoneNumber: String,
  location: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      duration: String,
      description: String,
    },
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
candidateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);
