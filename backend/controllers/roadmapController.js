const User = require('../models/User');
const DSAProblem = require('../models/DSAProblem');
const InterviewSession = require('../models/InterviewSession');

// Learning roadmaps by skill level and role
const roadmaps = {
  beginner: {
    'Software Developer': [
      {
        week: 1, title: 'Programming Fundamentals',
        topics: ['Variables & Data Types', 'Conditionals & Loops', 'Functions', 'Basic I/O'],
        resources: ['Python.org Tutorial', 'JavaScript.info', 'CS50 Harvard'],
        estimatedTime: '10 hours', status: 'recommended'
      },
      {
        week: 2, title: 'Data Structures Basics',
        topics: ['Arrays & Strings', 'Lists & Dictionaries', 'Basic sorting', 'Searching algorithms'],
        resources: ['GeeksForGeeks', 'LeetCode Easy problems'],
        estimatedTime: '12 hours', status: 'recommended'
      },
      {
        week: 3, title: 'OOP Concepts',
        topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'],
        resources: ['Real Python OOP', 'Java OOP tutorials'],
        estimatedTime: '10 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'Version Control & Basics',
        topics: ['Git basics', 'GitHub workflow', 'Branching & merging', 'Pull requests'],
        resources: ['Git official docs', 'GitHub Learning Lab'],
        estimatedTime: '8 hours', status: 'upcoming'
      },
      {
        week: 5, title: 'Basic Web Technologies',
        topics: ['HTML fundamentals', 'CSS basics', 'JavaScript basics', 'DOM manipulation'],
        resources: ['MDN Web Docs', 'freeCodeCamp'],
        estimatedTime: '15 hours', status: 'upcoming'
      },
      {
        week: 6, title: 'Introduction to Databases',
        topics: ['SQL basics', 'CRUD operations', 'Database design', 'Normalization'],
        resources: ['SQLZoo', 'W3Schools SQL'],
        estimatedTime: '10 hours', status: 'upcoming'
      }
    ],
    'Web Developer': [
      {
        week: 1, title: 'HTML & CSS Mastery',
        topics: ['Semantic HTML5', 'CSS Box Model', 'Flexbox', 'CSS Grid'],
        resources: ['MDN Web Docs', 'CSS-Tricks', 'freeCodeCamp'],
        estimatedTime: '12 hours', status: 'recommended'
      },
      {
        week: 2, title: 'JavaScript Fundamentals',
        topics: ['ES6+ Features', 'DOM Manipulation', 'Events & Listeners', 'Async/Await'],
        resources: ['JavaScript.info', 'You Don\'t Know JS'],
        estimatedTime: '15 hours', status: 'recommended'
      },
      {
        week: 3, title: 'Responsive Design',
        topics: ['Media Queries', 'Mobile-first design', 'Bootstrap/Tailwind', 'CSS Variables'],
        resources: ['Bootstrap docs', 'Tailwind CSS docs'],
        estimatedTime: '10 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'React.js Basics',
        topics: ['Components & Props', 'State Management', 'React Hooks', 'React Router'],
        resources: ['React.dev official', 'React Tutorial by Scrimba'],
        estimatedTime: '20 hours', status: 'upcoming'
      }
    ],
    'Data Analyst': [
      {
        week: 1, title: 'Python for Data Analysis',
        topics: ['Python basics', 'NumPy', 'Pandas DataFrames', 'Data cleaning'],
        resources: ['Kaggle Python course', 'Pandas documentation'],
        estimatedTime: '15 hours', status: 'recommended'
      },
      {
        week: 2, title: 'Statistics Fundamentals',
        topics: ['Descriptive statistics', 'Probability', 'Distributions', 'Hypothesis testing'],
        resources: ['Khan Academy Statistics', 'StatQuest YouTube'],
        estimatedTime: '12 hours', status: 'recommended'
      },
      {
        week: 3, title: 'Data Visualization',
        topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard design principles'],
        resources: ['Matplotlib docs', 'Seaborn gallery'],
        estimatedTime: '10 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'SQL for Analysis',
        topics: ['SELECT queries', 'JOINs', 'Aggregations', 'Window functions'],
        resources: ['Mode Analytics SQL', 'LeetCode SQL problems'],
        estimatedTime: '12 hours', status: 'upcoming'
      }
    ]
  },
  intermediate: {
    'Software Developer': [
      {
        week: 1, title: 'Advanced Data Structures',
        topics: ['Trees & BST', 'Heaps', 'Graphs', 'Tries'],
        resources: ['CLRS Textbook', 'Visualgo.net', 'LeetCode Medium'],
        estimatedTime: '15 hours', status: 'recommended'
      },
      {
        week: 2, title: 'Algorithm Design',
        topics: ['Dynamic Programming', 'Backtracking', 'Greedy algorithms', 'Divide & Conquer'],
        resources: ['Aditya Verma DP series', 'LeetCode 150'],
        estimatedTime: '20 hours', status: 'recommended'
      },
      {
        week: 3, title: 'System Design Basics',
        topics: ['Scalability concepts', 'Caching', 'Load balancing', 'Database design'],
        resources: ['System Design Primer', 'Grokking System Design'],
        estimatedTime: '15 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'Design Patterns',
        topics: ['Singleton', 'Factory', 'Observer', 'Strategy patterns'],
        resources: ['Refactoring Guru', 'Head First Design Patterns'],
        estimatedTime: '12 hours', status: 'upcoming'
      },
      {
        week: 5, title: 'Recursion & Advanced DP',
        topics: ['Memoization', 'Tabulation', 'Tree DP', '2D DP problems'],
        resources: ['Striver DP series', 'LeetCode Hard DP'],
        estimatedTime: '20 hours', status: 'upcoming'
      }
    ],
    'Web Developer': [
      {
        week: 1, title: 'Advanced React',
        topics: ['Context API', 'useReducer', 'Custom Hooks', 'React Performance'],
        resources: ['React Advanced Patterns', 'Kent C. Dodds Blog'],
        estimatedTime: '15 hours', status: 'recommended'
      },
      {
        week: 2, title: 'State Management',
        topics: ['Redux Toolkit', 'Zustand', 'React Query', 'State Architecture'],
        resources: ['Redux Toolkit docs', 'TanStack Query docs'],
        estimatedTime: '12 hours', status: 'recommended'
      },
      {
        week: 3, title: 'Backend Integration',
        topics: ['REST API consumption', 'Authentication flow', 'Error handling', 'WebSockets'],
        resources: ['Axios docs', 'Socket.io docs'],
        estimatedTime: '10 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'Testing & Quality',
        topics: ['Unit testing with Jest', 'React Testing Library', 'E2E with Cypress', 'CI/CD'],
        resources: ['Testing Library docs', 'Cypress docs'],
        estimatedTime: '12 hours', status: 'upcoming'
      }
    ],
    'Data Analyst': [
      {
        week: 1, title: 'Machine Learning Basics',
        topics: ['Linear regression', 'Classification', 'Clustering', 'Model evaluation'],
        resources: ['Scikit-learn tutorials', 'Andrew Ng ML Course'],
        estimatedTime: '20 hours', status: 'recommended'
      },
      {
        week: 2, title: 'Advanced SQL',
        topics: ['CTEs', 'Subqueries', 'Stored procedures', 'Query optimization'],
        resources: ['Advanced SQL techniques', 'PostgreSQL docs'],
        estimatedTime: '12 hours', status: 'recommended'
      },
      {
        week: 3, title: 'Business Intelligence',
        topics: ['Tableau', 'Power BI', 'Dashboard design', 'KPIs and metrics'],
        resources: ['Tableau public gallery', 'Power BI learning'],
        estimatedTime: '15 hours', status: 'upcoming'
      }
    ]
  },
  advanced: {
    'Software Developer': [
      {
        week: 1, title: 'System Design Mastery',
        topics: ['Microservices architecture', 'Event-driven systems', 'CAP theorem', 'Consistent hashing'],
        resources: ['Designing Data-Intensive Applications', 'System Design Interview book'],
        estimatedTime: '20 hours', status: 'recommended'
      },
      {
        week: 2, title: 'Advanced Algorithms',
        topics: ['Graph algorithms', 'Network flow', 'String algorithms', 'Computational geometry'],
        resources: ['Competitive Programming 3', 'USACO Guide'],
        estimatedTime: '25 hours', status: 'recommended'
      },
      {
        week: 3, title: 'Distributed Systems',
        topics: ['Consensus algorithms', 'Distributed transactions', 'Kafka', 'gRPC'],
        resources: ['MIT 6.824', 'Martin Kleppmann book'],
        estimatedTime: '20 hours', status: 'upcoming'
      },
      {
        week: 4, title: 'Cloud Architecture',
        topics: ['AWS/GCP/Azure', 'Serverless', 'Container orchestration', 'IaC with Terraform'],
        resources: ['AWS Well-Architected', 'Google Cloud Architecture'],
        estimatedTime: '20 hours', status: 'upcoming'
      }
    ]
  }
};

// @desc    Get user's learning roadmap
// @route   GET /api/roadmap
// @access  Private
const getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { skillLevel, targetRole } = user;

    // Get roadmap for user's level and role
    let roadmap = roadmaps[skillLevel]?.[targetRole] ||
                  roadmaps[skillLevel]?.['Software Developer'] ||
                  roadmaps['beginner']['Software Developer'];

    // Get user's DSA stats to update completion
    const solvedProblems = await DSAProblem.countDocuments({ user: req.user._id, status: 'Solved' });
    const totalInterviews = await InterviewSession.countDocuments({ user: req.user._id, status: 'completed' });

    // Add progress to roadmap
    roadmap = roadmap.map((item, index) => ({
      ...item,
      isCompleted: index === 0 && solvedProblems > 0,
      progress: index === 0 ? Math.min(Math.round((solvedProblems / 20) * 100), 100) : 0
    }));

    // Get suggested resources based on skill level
    const suggestedResources = {
      beginner: [
        { name: 'freeCodeCamp', url: 'https://freecodecamp.org', type: 'Free Course' },
        { name: 'CS50 Harvard', url: 'https://cs50.harvard.edu', type: 'Free Course' },
        { name: 'The Odin Project', url: 'https://theodinproject.com', type: 'Free Course' },
        { name: 'LeetCode', url: 'https://leetcode.com', type: 'Practice' }
      ],
      intermediate: [
        { name: 'LeetCode 150', url: 'https://leetcode.com/studyplan/top-interview-150/', type: 'Practice' },
        { name: 'Striver\'s A2Z Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course', type: 'DSA Course' },
        { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'System Design' },
        { name: 'NeetCode 150', url: 'https://neetcode.io', type: 'Practice' }
      ],
      advanced: [
        { name: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net', type: 'Book' },
        { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', type: 'Course' },
        { name: 'Competitive Programming', url: 'https://codeforces.com', type: 'Practice' },
        { name: 'DDIA Book', url: 'https://dataintensive.net', type: 'Book' }
      ]
    };

    res.status(200).json({
      success: true,
      roadmap: {
        skillLevel,
        targetRole,
        weeks: roadmap,
        suggestedResources: suggestedResources[skillLevel] || suggestedResources.beginner,
        userStats: {
          solvedProblems,
          totalInterviews,
          completionPercentage: Math.min(Math.round((solvedProblems / 50) * 100), 100)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update skill level
// @route   PUT /api/roadmap/skill-level
// @access  Private
const updateSkillLevel = async (req, res) => {
  try {
    const { skillLevel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skillLevel },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Skill level updated! Your roadmap has been personalized.',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRoadmap, updateSkillLevel };
