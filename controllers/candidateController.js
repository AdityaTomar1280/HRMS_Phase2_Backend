// const Candidate = require('../models/Candidate');
// //const Candidate = require('../service/Candidate');

// exports.saveSelectedCandidates = async (req, res) => {
//   try {
//     const { candidates } = req.body;

//     if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
//       return res.status(400).json({ message: 'No candidates provided.' });
//     }

//     // If you want to update existing candidates or add new ones (upsert)
//     const operations = candidates.map((candidate) => {
//       return {
//         updateOne: {
//           filter: { email: candidate.email },
//           update: candidate,
//           upsert: true, // Create if doesn't exist
//         },
//       };
//     });

//     const result = await Candidate.bulkWrite(operations);

//     res.status(200).json({
//       message: 'Candidates saved successfully',
//       saved: result.upsertedCount + result.modifiedCount,
//       total: candidates.length,
//     });
//   } catch (error) {
//     console.error('Error saving candidates:', error);
//     res
//       .status(500)
//       .json({ message: 'Failed to save candidates', error: error.message });
//   }
// };

// exports.getAllCandidates = async (req, res) => {
//   try {
//     const candidates = await Candidate.find().sort({ createdAt: -1 });
//     res.status(200).json(candidates);
//   } catch (error) {
//     console.error('Error fetching candidates:', error);
//     res
//       .status(500)
//       .json({ message: 'Failed to fetch candidates', error: error.message });
//   }
// };

// const Candidate = require('../models/Candidate');

// exports.saveSelectedCandidates = async (req, res) => {
//   try {
//     const { candidates } = req.body;

//     if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
//       return res.status(400).json({ message: 'No candidates provided.' });
//     }

//     // If you want to update existing candidates or add new ones (upsert)
//     const operations = candidates.map((candidate) => {
//       return {
//         updateOne: {
//           filter: { email: candidate.email },
//           update: candidate,
//           upsert: true, // Create if doesn't exist
//         },
//       };
//     });

//     const result = await Candidate.bulkWrite(operations);

//     res.status(200).json({
//       message: 'Candidates saved successfully',
//       saved: result.upsertedCount + result.modifiedCount,
//       total: candidates.length,
//     });
//   } catch (error) {
//     console.error('Error saving candidates:', error);
//     res
//       .status(500)
//       .json({ message: 'Failed to save candidates', error: error.message });
//   }
// };

// exports.getAllCandidates = async (req, res) => {
//   try {
//     const candidates = await Candidate.find().sort({ updatedAt: -1 });
//     res.status(200).json(candidates);
//   } catch (error) {
//     console.error('Error fetching candidates:', error);
//     res
//       .status(500)
//       .json({ message: 'Failed to fetch candidates', error: error.message });
//   }
// };

// exports.deleteCandidate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: 'Candidate ID is required.' });
//     }

//     const result = await Candidate.findByIdAndDelete(id);

//     if (!result) {
//       return res.status(404).json({ message: 'Candidate not found.' });
//     }

//     res.status(200).json({
//       message: 'Candidate deleted successfully',
//       deletedCandidate: result,
//     });
//   } catch (error) {
//     console.error('Error deleting candidate:', error);
//     res.status(500).json({
//       message: 'Failed to delete candidate',
//       error: error.message,
//     });
//   }
// };

// // New functions for interview tracking

// exports.updateInterviewStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { interviewStatus, note, nextInterviewDate } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: 'Candidate ID is required.' });
//     }

//     const candidate = await Candidate.findById(id);

//     if (!candidate) {
//       return res.status(404).json({ message: 'Candidate not found.' });
//     }

//     // Update interview status
//     if (interviewStatus) {
//       candidate.interviewStatus = interviewStatus;
//     }

//     // Add note if provided
//     if (note) {
//       candidate.interviewNotes.push({
//         stage: interviewStatus || candidate.interviewStatus,
//         note: note,
//       });
//     }

//     // Update next interview date if provided
//     if (nextInterviewDate) {
//       candidate.nextInterviewDate = new Date(nextInterviewDate);
//     }

//     candidate.updatedAt = Date.now();
//     await candidate.save();

//     res.status(200).json({
//       message: 'Interview status updated successfully',
//       candidate: candidate,
//     });
//   } catch (error) {
//     console.error('Error updating interview status:', error);
//     res.status(500).json({
//       message: 'Failed to update interview status',
//       error: error.message,
//     });
//   }
// };

// exports.getInterviewTrackingData = async (req, res) => {
//   try {
//     // Get count of candidates in each interview stage
//     const stageCounts = await Candidate.aggregate([
//       { $group: { _id: '$interviewStatus', count: { $sum: 1 } } },
//       { $sort: { _id: 1 } },
//     ]);

//     // Get candidates with upcoming interviews
//     const upcomingInterviews = await Candidate.find({
//       nextInterviewDate: { $exists: true, $ne: null, $gte: new Date() },
//     })
//       .sort({ nextInterviewDate: 1 })
//       .limit(10);

//     // Get recently updated candidates
//     const recentlyUpdated = await Candidate.find()
//       .sort({ updatedAt: -1 })
//       .limit(5);

//     res.status(200).json({
//       stageCounts,
//       upcomingInterviews,
//       recentlyUpdated,
//     });
//   } catch (error) {
//     console.error('Error fetching interview tracking data:', error);
//     res.status(500).json({
//       message: 'Failed to fetch interview tracking data',
//       error: error.message,
//     });
//   }
// };

const Candidate = require('../models/Candidate');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

exports.saveSelectedCandidates = async (req, res) => {
  try {
    const { candidates } = req.body;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: 'No candidates provided.' });
    }

    // If you want to update existing candidates or add new ones (upsert)
    const operations = candidates.map((candidate) => {
      return {
        updateOne: {
          filter: { email: candidate.email },
          update: candidate,
          upsert: true, // Create if doesn't exist
        },
      };
    });

    const result = await Candidate.bulkWrite(operations);

    res.status(200).json({
      message: 'Candidates saved successfully',
      saved: result.upsertedCount + result.modifiedCount,
      total: candidates.length,
    });
  } catch (error) {
    console.error('Error saving candidates:', error);
    res
      .status(500)
      .json({ message: 'Failed to save candidates', error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .sort({ updatedAt: -1 })
      .select('-resumeFile.data'); // Exclude resume file data for list view

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch candidates', error: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    const candidate = await Candidate.findById(id).select('-resumeFile.data');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      message: 'Failed to fetch candidate',
      error: error.message,
    });
  }
};

exports.getCandidateResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    const candidate = await Candidate.findById(id).select('resumeFile');

    if (!candidate || !candidate.resumeFile || !candidate.resumeFile.data) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    // Set the content type header based on the stored file type
    res.set('Content-Type', candidate.resumeFile.contentType);

    // Send the file data
    res.send(candidate.resumeFile.data);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      message: 'Failed to fetch resume',
      error: error.message,
    });
  }
};

exports.storeResumeFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Read the file data
    const fileData = await readFile(req.file.path);

    // Store the file in the database
    candidate.resumeFile = {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: fileData,
    };

    // Clean up the temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    await candidate.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error('Error storing resume:', error);
    res.status(500).json({
      message: 'Failed to store resume',
      error: error.message,
    });
  }
};

exports.updateCandidateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Update allowed profile fields
    const allowedFields = [
      'phoneNumber',
      'location',
      'skills',
      'experience',
      'education',
    ];

    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        candidate[field] = profileData[field];
      }
    });

    await candidate.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      candidate: candidate,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    const result = await Candidate.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.status(200).json({
      message: 'Candidate deleted successfully',
      deletedCandidate: result,
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      message: 'Failed to delete candidate',
      error: error.message,
    });
  }
};

// Functions for interview tracking

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewStatus, note, nextInterviewDate } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Candidate ID is required.' });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Update interview status
    if (interviewStatus) {
      candidate.interviewStatus = interviewStatus;
    }

    // Add note if provided
    if (note) {
      candidate.interviewNotes.push({
        stage: interviewStatus || candidate.interviewStatus,
        note: note,
      });
    }

    // Update next interview date if provided
    if (nextInterviewDate) {
      candidate.nextInterviewDate = new Date(nextInterviewDate);
    }

    candidate.updatedAt = Date.now();
    await candidate.save();

    res.status(200).json({
      message: 'Interview status updated successfully',
      candidate: candidate,
    });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({
      message: 'Failed to update interview status',
      error: error.message,
    });
  }
};

exports.getInterviewTrackingData = async (req, res) => {
  try {
    // Get count of candidates in each interview stage
    const stageCounts = await Candidate.aggregate([
      { $group: { _id: '$interviewStatus', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Get candidates with upcoming interviews
    const upcomingInterviews = await Candidate.find({
      nextInterviewDate: { $exists: true, $ne: null, $gte: new Date() },
    })
      .sort({ nextInterviewDate: 1 })
      .limit(10)
      .select('-resumeFile.data');

    // Get recently updated candidates
    const recentlyUpdated = await Candidate.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('-resumeFile.data');

    res.status(200).json({
      stageCounts,
      upcomingInterviews,
      recentlyUpdated,
    });
  } catch (error) {
    console.error('Error fetching interview tracking data:', error);
    res.status(500).json({
      message: 'Failed to fetch interview tracking data',
      error: error.message,
    });
  }
};
