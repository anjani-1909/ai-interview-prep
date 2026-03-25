const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');

// Interview questions bank (fallback when AI is not available)
const questionsBank = {
  'Software Developer': {
    Easy: [
      'What is the difference between == and === in JavaScript?',
      'Explain the concept of Object-Oriented Programming.',
      'What is a RESTful API? Explain its key principles.',
      'What is the difference between GET and POST requests?',
      'Explain what is a variable scope in programming.'
    ],
    Medium: [
      'Explain the difference between SQL and NoSQL databases. When would you use each?',
      'What is the time complexity of quicksort? Explain best and worst cases.',
      'Describe the SOLID principles in software development.',
      'What is the difference between process and thread? Explain with examples.',
      'How does garbage collection work in Java/Python?'
    ],
    Hard: [
      'Design a URL shortener system like bit.ly. Discuss scalability.',
      'Explain CAP theorem and how it applies to distributed systems.',
      'How would you design a rate limiter for an API?',
      'Explain the concept of database sharding and when to use it.',
      'How does a load balancer work? Describe different load balancing algorithms.'
    ]
  },
  'Web Developer': {
    Easy: [
      'What is the difference between HTML, CSS, and JavaScript?',
      'Explain the CSS Box Model.',
      'What is responsive design? How do you implement it?',
      'What is the difference between inline, block, and inline-block elements?',
      'Explain what is DOM (Document Object Model).'
    ],
    Medium: [
      'Explain the concept of Virtual DOM in React. Why is it beneficial?',
      'What is CORS and how do you handle it in web applications?',
      'Explain different CSS positioning methods (static, relative, absolute, fixed, sticky).',
      'What are Web Workers and when would you use them?',
      'Explain the difference between cookies, localStorage, and sessionStorage.'
    ],
    Hard: [
      'How would you optimize a React application for performance?',
      'Explain Server-Side Rendering (SSR) vs Client-Side Rendering (CSR). Trade-offs?',
      'How does browser rendering pipeline work?',
      'Design a real-time notification system for a web app.',
      'Explain Progressive Web Apps (PWA) and their key features.'
    ]
  },
  'Data Analyst': {
    Easy: [
      'What is the difference between mean, median, and mode?',
      'Explain what is a DataFrame in pandas.',
      'What is the purpose of data normalization?',
      'Explain the difference between supervised and unsupervised learning.',
      'What is a null hypothesis in statistics?'
    ],
    Medium: [
      'Explain the concept of overfitting and underfitting in machine learning.',
      'What is the difference between a JOIN and UNION in SQL?',
      'Explain Principal Component Analysis (PCA) and when to use it.',
      'How do you handle missing data in a dataset?',
      'What is A/B testing and how do you design an A/B test?'
    ],
    Hard: [
      'Design a recommendation engine for an e-commerce platform.',
      'How would you detect anomalies in a time-series dataset?',
      'Explain the bias-variance tradeoff in machine learning models.',
      'How do you evaluate the performance of a classification model?',
      'Design a data pipeline for real-time analytics.'
    ]
  },
  'Frontend Developer': {
    Easy: [
      'Explain Flexbox vs CSS Grid. When do you use each?',
      'What is event bubbling and event capturing in JavaScript?',
      'What are React Hooks? Explain useState and useEffect.',
      'What is the purpose of key prop in React lists?',
      'Explain the concept of props and state in React.'
    ],
    Medium: [
      'Explain React Context API vs Redux for state management.',
      'What is code splitting in webpack/React? How does it improve performance?',
      'Explain different ways to handle asynchronous operations in JavaScript.',
      'What is TypeScript? What are its advantages over JavaScript?',
      'How do you implement lazy loading in React?'
    ],
    Hard: [
      'Design a component library from scratch. What are the key considerations?',
      'How would you implement micro-frontends architecture?',
      'Explain web accessibility (a11y) and how to implement it.',
      'How do you optimize bundle size in a webpack application?',
      'Implement a custom hook for infinite scrolling.'
    ]
  },
  'Backend Developer': {
    Easy: [
      'What is middleware in Express.js?',
      'Explain the difference between authentication and authorization.',
      'What is an ORM? Give examples.',
      'Explain what REST stands for.',
      'What is the difference between SQL and NoSQL?'
    ],
    Medium: [
      'Explain JWT authentication. How does it work?',
      'What is database indexing and why is it important?',
      'Explain the concept of caching. What tools would you use?',
      'How do you handle database transactions?',
      'What is the difference between vertical and horizontal scaling?'
    ],
    Hard: [
      'Design a microservices architecture for an e-commerce platform.',
      'How would you implement a job queue system?',
      'Explain event-driven architecture patterns.',
      'How do you handle distributed transactions?',
      'Design a caching strategy for a high-traffic API.'
    ]
  },
  'Full Stack Developer': {
    Easy: [
      'Explain the MVC (Model-View-Controller) pattern.',
      'What is the difference between synchronous and asynchronous programming?',
      'Explain what is JWT and how authentication works.',
      'What is CRUD? Give examples in both SQL and MongoDB.',
      'Explain the difference between PUT and PATCH HTTP methods.'
    ],
    Medium: [
      'How would you implement real-time features in a web app?',
      'Explain the concept of WebSockets vs HTTP polling.',
      'How do you secure a web application from common vulnerabilities (XSS, CSRF, SQL Injection)?',
      'What is Docker and why is it useful for full-stack development?',
      'Explain CI/CD pipeline and its importance.'
    ],
    Hard: [
      'Design a scalable chat application like WhatsApp.',
      'How would you implement a full-text search engine?',
      'Explain GraphQL vs REST. When would you choose GraphQL?',
      'Design a multi-tenant SaaS application architecture.',
      'How would you implement role-based access control (RBAC)?'
    ]
  },
  'DevOps Engineer': {
    Easy: [
      'What is the difference between Docker and a Virtual Machine?',
      'Explain what Kubernetes is and its main components.',
      'What is Infrastructure as Code (IaC)?',
      'What is the purpose of a load balancer?',
      'Explain what is a CI/CD pipeline.'
    ],
    Medium: [
      'Explain blue-green deployment strategy.',
      'How does Kubernetes auto-scaling work?',
      'What is the difference between monitoring and observability?',
      'Explain the concept of container orchestration.',
      'How do you implement secrets management in cloud environments?'
    ],
    Hard: [
      'Design a highly available deployment architecture for a global application.',
      'How would you implement disaster recovery for a production system?',
      'Explain service mesh architecture using Istio.',
      'How do you implement GitOps practices?',
      'Design a monitoring and alerting system for microservices.'
    ]
  }
};

// AI-like feedback generator (rule-based when AI API not available)
const generateFeedback = (question, answer, role) => {
  const wordCount = answer.trim().split(/\s+/).length;
  const hasKeywords = answer.length > 50;

  let score = 0;
  let technicalAccuracy = '';
  let communicationFeedback = '';
  let suggestions = '';
  const strengths = [];
  const improvements = [];

  // Score based on answer length and quality
  if (wordCount < 10) {
    score = Math.floor(Math.random() * 3) + 1;
    technicalAccuracy = 'The answer is too brief and lacks technical depth.';
    improvements.push('Provide more detailed explanations');
    improvements.push('Include specific examples');
  } else if (wordCount < 30) {
    score = Math.floor(Math.random() * 2) + 4;
    technicalAccuracy = 'The answer covers basic points but needs more elaboration.';
    strengths.push('Understood the basic concept');
    improvements.push('Add concrete examples');
    improvements.push('Explain the underlying concepts more thoroughly');
  } else if (wordCount < 80) {
    score = Math.floor(Math.random() * 2) + 6;
    technicalAccuracy = 'Good understanding demonstrated with reasonable detail.';
    strengths.push('Clear explanation of core concepts');
    strengths.push('Adequate answer length');
    improvements.push('Consider discussing edge cases');
    improvements.push('Mention real-world applications');
  } else {
    score = Math.floor(Math.random() * 2) + 8;
    technicalAccuracy = 'Excellent! Comprehensive answer with good technical depth.';
    strengths.push('Thorough explanation');
    strengths.push('Good use of examples');
    strengths.push('Demonstrates deep understanding');
    improvements.push('Practice conciseness for time-constrained interviews');
  }

  // Communication feedback
  if (wordCount < 20) {
    communicationFeedback = 'Try to communicate your thoughts more clearly and in complete sentences.';
  } else if (wordCount < 50) {
    communicationFeedback = 'Communication is adequate. Work on structuring your answer with a clear introduction and conclusion.';
  } else {
    communicationFeedback = 'Good communication skills. Your answer is well-structured and easy to follow.';
  }

  suggestions = `For this type of question in a ${role} interview, consider the STAR method (Situation, Task, Action, Result) for behavioral questions, or use clear technical definitions followed by examples for technical questions.`;

  return { score, technicalAccuracy, communicationFeedback, suggestions, strengths, improvements };
};

// @desc    Start new interview session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Please select a role' });
    }

    const roleQuestions = questionsBank[role] || questionsBank['Software Developer'];
    const diff = difficulty || 'Medium';
    const allQuestions = roleQuestions[diff] || roleQuestions['Medium'];

    // Pick 5 random questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(5, allQuestions.length));

    const questions = selectedQuestions.map(q => ({
      question: q,
      userAnswer: '',
      isAnswered: false,
      aiEvaluation: {}
    }));

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      difficulty: diff,
      questions,
      status: 'in-progress'
    });

    res.status(201).json({
      success: true,
      message: 'Interview session started! Good luck! 🎯',
      session: {
        _id: session._id,
        role: session.role,
        difficulty: session.difficulty,
        questions: session.questions,
        status: session.status,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interview/:sessionId/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Session already completed' });
    }

    const question = session.questions[questionIndex];
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Generate AI-like feedback
    const feedback = generateFeedback(question.question, answer, session.role);

    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].isAnswered = true;
    session.questions[questionIndex].aiEvaluation = feedback;

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted and evaluated! 📊',
      feedback,
      questionIndex
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete interview session
// @route   POST /api/interview/:sessionId/complete
// @access  Private
const completeInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Calculate overall score
    const answeredQuestions = session.questions.filter(q => q.isAnswered);
    const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.aiEvaluation?.score || 0), 0);
    const overallScore = answeredQuestions.length > 0
      ? Math.round(totalScore / answeredQuestions.length)
      : 0;

    // Generate overall feedback
    let overallFeedback = '';
    if (overallScore >= 8) {
      overallFeedback = `Excellent performance! You scored ${overallScore}/10. You demonstrated strong technical knowledge and communication skills. You're well-prepared for ${session.role} interviews!`;
    } else if (overallScore >= 6) {
      overallFeedback = `Good job! You scored ${overallScore}/10. You have a solid foundation. Focus on deepening your technical knowledge and providing more detailed examples in your answers.`;
    } else if (overallScore >= 4) {
      overallFeedback = `Keep practicing! You scored ${overallScore}/10. You understand the basics but need to work on your depth of knowledge. Review the concepts and practice explaining them clearly.`;
    } else {
      overallFeedback = `You scored ${overallScore}/10. Don't be discouraged! Use this as a learning opportunity. Study the topics thoroughly and practice explaining concepts out loud.`;
    }

    session.status = 'completed';
    session.overallScore = overallScore;
    session.overallFeedback = overallFeedback;
    session.completedAt = new Date();
    session.duration = Math.round((new Date() - session.createdAt) / 60000);

    await session.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalInterviews: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Interview completed! Check your results. 🎉',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's interview history
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      user: req.user._id,
      status: 'completed'
    }).sort({ completedAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single session
// @route   GET /api/interview/:sessionId
// @access  Private
const getSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { startInterview, submitAnswer, completeInterview, getInterviewHistory, getSession };
