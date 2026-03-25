const Resume = require('../models/Resume');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ATS Analysis function (rule-based, works without AI API)
const analyzeResume = (text, targetRole) => {
  const lowerText = text.toLowerCase();

  // Common keywords for different roles
  const roleKeywords = {
    'Software Developer': ['javascript', 'python', 'java', 'c++', 'react', 'node.js', 'sql', 'git', 'agile', 'rest api', 'data structures', 'algorithms', 'oop', 'database'],
    'Web Developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node.js', 'responsive design', 'bootstrap', 'tailwind', 'jquery', 'webpack', 'rest api'],
    'Data Analyst': ['python', 'sql', 'excel', 'tableau', 'power bi', 'machine learning', 'pandas', 'numpy', 'statistics', 'data visualization', 'r', 'matplotlib'],
    'Frontend Developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'redux', 'webpack', 'figma', 'responsive design', 'css grid', 'flexbox'],
    'Backend Developer': ['node.js', 'python', 'java', 'rest api', 'graphql', 'mongodb', 'mysql', 'postgresql', 'docker', 'kubernetes', 'microservices', 'redis'],
    'Full Stack Developer': ['react', 'node.js', 'mongodb', 'javascript', 'html', 'css', 'rest api', 'git', 'docker', 'sql', 'express', 'typescript'],
    'DevOps Engineer': ['docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'ci/cd', 'terraform', 'ansible', 'linux', 'bash', 'monitoring', 'prometheus', 'grafana']
  };

  const commonKeywords = ['problem solving', 'team player', 'communication', 'leadership', 'project management', 'agile', 'scrum'];

  const targetKeywords = roleKeywords[targetRole] || roleKeywords['Software Developer'];
  const allKeywords = [...targetKeywords, ...commonKeywords];

  // Find matching keywords
  const keywordsFound = allKeywords.filter(kw => lowerText.includes(kw.toLowerCase()));
  const missingKeywords = targetKeywords.filter(kw => !lowerText.includes(kw.toLowerCase())).slice(0, 8);

  // Check resume sections
  const hasSections = {
    contactInfo: /email|phone|linkedin|github|address/i.test(text),
    experience: /experience|work|employment|intern/i.test(text),
    education: /education|degree|university|college|bachelor|master/i.test(text),
    skills: /skills|technologies|tools|proficient/i.test(text),
    projects: /projects|portfolio|developed|built|created/i.test(text)
  };

  // Section scores (0-20 each = 100 total)
  const sectionScores = {
    contactInfo: hasSections.contactInfo ? 18 : 5,
    experience: hasSections.experience ? 20 : 8,
    education: hasSections.education ? 18 : 5,
    skills: hasSections.skills ? (keywordsFound.length >= 5 ? 20 : 12) : 6,
    formatting: text.length > 200 ? 16 : 8
  };

  // ATS Score calculation
  const keywordScore = Math.min((keywordsFound.length / targetKeywords.length) * 40, 40);
  const sectionScore = Object.values(sectionScores).reduce((a, b) => a + b, 0) / 5;
  const lengthScore = text.length > 500 ? 15 : (text.length > 200 ? 10 : 5);

  const atsScore = Math.round(keywordScore + sectionScore + lengthScore);
  const finalScore = Math.min(Math.max(atsScore, 20), 95);

  // Generate suggestions
  const suggestions = [];

  if (missingKeywords.length > 3) {
    suggestions.push({
      category: 'Keywords',
      issue: `Missing important keywords: ${missingKeywords.slice(0, 4).join(', ')}`,
      fix: `Add these keywords naturally in your skills section and job descriptions: ${missingKeywords.slice(0, 4).join(', ')}`,
      priority: 'High'
    });
  }

  if (!hasSections.experience) {
    suggestions.push({
      category: 'Experience',
      issue: 'Work experience section is missing or unclear',
      fix: 'Add a clear "Work Experience" section with job titles, company names, dates, and bullet points describing your responsibilities',
      priority: 'High'
    });
  }

  if (!hasSections.skills) {
    suggestions.push({
      category: 'Skills',
      issue: 'Technical skills section is not clearly defined',
      fix: 'Add a dedicated "Technical Skills" section listing programming languages, frameworks, tools, and technologies',
      priority: 'High'
    });
  }

  if (!hasSections.projects) {
    suggestions.push({
      category: 'Projects',
      issue: 'No projects section found',
      fix: 'Add 2-3 relevant projects with tech stack used, your role, and impact/results achieved',
      priority: 'Medium'
    });
  }

  if (text.length < 300) {
    suggestions.push({
      category: 'Content',
      issue: 'Resume content is too brief',
      fix: 'Expand your resume with more detailed descriptions of your experience, skills, and achievements. Aim for 1-2 pages.',
      priority: 'Medium'
    });
  }

  suggestions.push({
    category: 'Format',
    issue: 'Ensure consistent formatting throughout',
    fix: 'Use consistent fonts, bullet points, and date formats. Keep margins uniform and use ATS-friendly fonts like Arial or Calibri.',
    priority: 'Low'
  });

  suggestions.push({
    category: 'Action Verbs',
    issue: 'Use strong action verbs to describe achievements',
    fix: 'Start each bullet point with action verbs like: Developed, Implemented, Designed, Optimized, Led, Built, Created, Improved',
    priority: 'Medium'
  });

  // Determine overall rating
  let overallRating;
  if (finalScore >= 80) overallRating = 'Excellent';
  else if (finalScore >= 65) overallRating = 'Good';
  else if (finalScore >= 45) overallRating = 'Average';
  else overallRating = 'Poor';

  // Strengths and weaknesses
  const strengths = [];
  const weaknesses = [];

  if (hasSections.experience) strengths.push('Work experience is clearly mentioned');
  if (hasSections.education) strengths.push('Education section is present');
  if (hasSections.skills) strengths.push('Technical skills are listed');
  if (keywordsFound.length >= 5) strengths.push(`Strong keyword presence (${keywordsFound.length} relevant keywords found)`);
  if (hasSections.projects) strengths.push('Projects are showcased');

  if (missingKeywords.length > 3) weaknesses.push(`Missing ${missingKeywords.length} important ${targetRole} keywords`);
  if (!hasSections.contactInfo) weaknesses.push('Contact information is incomplete or missing');
  if (text.length < 300) weaknesses.push('Resume content needs expansion');

  return {
    atsScore: finalScore,
    overallRating,
    keywordsFound,
    missingKeywords,
    suggestions,
    sectionScores,
    strengths,
    weaknesses
  };
};

// @desc    Analyze resume (text-based for demo)
// @route   POST /api/resume/analyze-text
// @access  Private
const analyzeResumeText = async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.user._id);
    const targetRole = user.targetRole || 'Software Developer';

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }

    const analysis = analyzeResume(text, targetRole);

    // Save to database
    const resume = await Resume.create({
      user: req.user._id,
      fileName: 'Text Resume Analysis',
      fileUrl: 'text-analysis',
      fileType: 'pdf',
      atsScore: analysis.atsScore,
      analysis: {
        overallRating: analysis.overallRating,
        keywordsFound: analysis.keywordsFound,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        sectionScores: analysis.sectionScores,
        extractedText: text.substring(0, 1000),
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses
      },
      isAnalyzed: true
    });

    // Update user resume score
    await User.findByIdAndUpdate(req.user._id, { resumeScore: analysis.atsScore });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully! 📊',
      analysis: {
        ...analysis,
        resumeId: resume._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resume analysis history
// @route   GET /api/resume/history
// @access  Private
const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-analysis.extractedText');

    res.status(200).json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume/:id
// @access  Private
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeResumeText, getResumeHistory, getResume };
