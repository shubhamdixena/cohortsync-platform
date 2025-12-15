// User data
export const currentUser = {
  id: "1",
  name: "Jane Smith",
  initials: "JS",
  email: "jane.smith@example.com",
  title: "Social Entrepreneur at Impact Ventures",
  bio: "Passionate about creating positive social impact through innovative solutions.",
  location: "Mumbai, India",
  joinedDate: "March 2022",
  avatar: "/placeholder-user.jpg",
  phone: "+91 98765 43210",
  cohort: "Jagriti Yatra 2022",
  skills: ["Social Innovation", "Impact Measurement", "Strategic Planning", "Community Building", "Fundraising"],
  social: {
    linkedin: "https://linkedin.com/in/janesmith",
    twitter: "https://twitter.com/janesmith",
    website: "https://janesmith.org",
    github: "https://github.com/janesmith"
  }
}

// Sample posts data
export const posts = [
  {
    id: "1",
    author: {
      name: "Rahul Kumar",
      initials: "RK",
      title: "Tech Entrepreneur • Mumbai",
    },
    content:
      "Just finished an incredible mentoring session with some amazing young entrepreneurs. The energy and passion they bring to solving real-world problems is truly inspiring! 🚀",
    timestamp: "2 hours ago",
    likes: 24,
    comments: [
      {
        author: { name: "Priya Sharma", initials: "PS" },
        content: "That sounds amazing! Would love to hear more about their projects.",
        timestamp: "1 hour ago",
      },
      {
        author: { name: "Amit Patel", initials: "AP" },
        content: "Mentoring is such a rewarding experience. Keep up the great work!",
        timestamp: "45 minutes ago",
      },
    ],
    shares: 5,
    tags: ["mentoring", "entrepreneurship", "inspiration"],
  },
  {
    id: "2",
    author: {
      name: "Anjali Patel",
      initials: "AP",
      title: "Social Impact Consultant • Delhi",
    },
    content:
      "Excited to share that our rural education initiative has reached 500+ children across 15 villages! This wouldn't have been possible without the incredible support from the Jagriti community. Thank you all! 🙏",
    timestamp: "4 hours ago",
    likes: 67,
    comments: 12,
    shares: 18,
    tags: ["education", "rural", "impact", "gratitude"],
    image: "/placeholder.jpg",
  },
  {
    id: "3",
    author: {
      name: "Sanjay Mehta",
      initials: "SM",
      title: "Sustainable Agriculture Expert • Pune",
    },
    content:
      "Sharing some insights from our recent workshop on sustainable farming practices. The response from local farmers has been overwhelming! Here are the key takeaways: 1) Organic composting can increase yield by 30% 2) Water conservation techniques can reduce usage by 40% 3) Crop rotation improves soil health significantly",
    timestamp: "6 hours ago",
    likes: 43,
    comments: [
      {
        author: { name: "Kavita Singh", initials: "KS" },
        content: "This is fantastic work! Are you planning to expand to other regions?",
        timestamp: "3 hours ago",
      },
    ],
    shares: 9,
    tags: ["agriculture", "sustainability", "farming", "workshop"],
  },
  {
    id: "4",
    author: {
      name: "Meera Gupta",
      initials: "MG",
      title: "Healthcare Innovation • Bangalore",
    },
    content:
      "Looking for collaborators on a new telemedicine project aimed at providing healthcare access to remote areas. If you're working in healthcare tech or have experience with rural communities, let's connect!",
    timestamp: "8 hours ago",
    likes: 31,
    comments: 8,
    shares: 12,
    tags: ["healthcare", "telemedicine", "collaboration", "rural"],
  },
  {
    id: "5",
    author: {
      name: "Vikram Thakur",
      initials: "VT",
      title: "Clean Energy Advocate • Jaipur",
    },
    content:
      "Just returned from an incredible solar energy conference in Germany. The innovations in renewable energy are mind-blowing! Can't wait to implement some of these ideas in our upcoming projects in Rajasthan.",
    timestamp: "12 hours ago",
    likes: 28,
    comments: [
      {
        author: { name: "Neha Kapoor", initials: "NK" },
        content: "Would love to hear more about what you learned! Any insights you can share?",
        timestamp: "8 hours ago",
      },
      {
        author: { name: "Rohit Sharma", initials: "RS" },
        content: "Solar energy is the future! Excited to see your projects in action.",
        timestamp: "6 hours ago",
      },
    ],
    shares: 7,
    tags: ["solar", "renewable", "energy", "innovation", "conference"],
  },
]

// Sample members data
export const members = [
  {
    id: "1",
    name: "Rahul Kumar",
    initials: "RK",
    title: "Tech Entrepreneur",
    location: "Mumbai",
    coordinates: { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
    email: "rahul.kumar@example.com",
    bio: "Passionate tech entrepreneur with 8+ years of experience building scalable solutions. Currently working on AI-powered tools for social impact.",
    expertise: ["Technology", "Startups", "Mentoring"],
    skills: ["JavaScript", "Python", "AI/ML", "Product Management", "Team Leadership"],
    joinDate: "January 2022",
    cohort: "Mumbai Entrepreneurs 2022",
    industry: "Technology",
    subgroups: ["AI & Tech", "Startup Founders", "Mumbai Chapter"],
    avatar: "/placeholder-user.jpg",
    isOnline: true,
    color: "blue",
    social: {
      linkedin: "https://linkedin.com/in/rahulkumar",
      twitter: "https://twitter.com/rahulkumar",
      website: "https://rahulkumar.dev",
    },
    lookingFor: [
      "Co-founder with business development experience",
      "Seed funding for AI startup",
      "Connections in healthcare industry",
      "Mentorship on scaling teams",
    ],
    offering: [
      "Technical mentorship for early-stage startups",
      "Product development consultation",
      "Introductions to tech investors",
      "Code reviews and architecture guidance",
      "Speaking at tech events",
    ],
    experience: [
      {
        title: "Founder & CEO",
        company: "TechForGood Solutions",
        duration: "2020 - Present",
        description:
          "Building AI-powered tools for social impact organizations to optimize their operations and increase reach.",
      },
      {
        title: "Senior Software Engineer",
        company: "Microsoft India",
        duration: "2018 - 2020",
        description:
          "Led development of cloud-based solutions for enterprise clients, focusing on scalability and performance.",
      },
      {
        title: "Software Developer",
        company: "Infosys",
        duration: "2016 - 2018",
        description: "Developed web applications and mobile solutions for various clients across different industries.",
      },
    ],
    referrals: [
      {
        organization: "Y Combinator",
        type: "Startup Accelerator Application",
        category: "Accelerator",
      },
      {
        organization: "Accel Partners",
        type: "Venture Capital Introduction",
        category: "Funding",
      },
      {
        organization: "Google for Startups",
        type: "Program Referral",
        category: "Program",
      },
    ],
  },
  {
    id: "2",
    name: "Anjali Patel",
    initials: "AP",
    title: "Social Impact Consultant",
    location: "Delhi",
    coordinates: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
    email: "anjali.patel@example.com",
    bio: "Dedicated social impact consultant with expertise in education and rural development. Passionate about creating sustainable change in underserved communities.",
    expertise: ["Education", "Rural Development", "Policy"],
    skills: ["Project Management", "Policy Analysis", "Community Engagement", "Grant Writing", "Impact Measurement"],
    joinDate: "March 2022",
    cohort: "Social Impact Makers 2022",
    industry: "Social Impact",
    subgroups: ["Education Reform", "Rural Development", "Policy Advocacy"],
    avatar: "/placeholder-user.jpg",
    isOnline: false,
    color: "green",
    social: {
      linkedin: "https://linkedin.com/in/anjalipatel",
      website: "https://anjalipatel.org",
    },
    lookingFor: [
      "Partnerships with educational institutions",
      "Funding for rural education programs",
      "Technology solutions for remote learning",
      "Research collaborators on education policy",
    ],
    offering: [
      "Grant writing and fundraising support",
      "Rural community engagement strategies",
      "Education program design and evaluation",
      "Policy research and advocacy",
      "Impact measurement frameworks",
    ],
    experience: [
      {
        title: "Senior Consultant",
        company: "Dalberg Advisors",
        duration: "2019 - Present",
        description: "Leading social impact projects across education, healthcare, and rural development sectors.",
      },
      {
        title: "Program Manager",
        company: "Teach for India",
        duration: "2017 - 2019",
        description:
          "Managed education programs in rural communities, focusing on teacher training and curriculum development.",
      },
    ],
    referrals: [
      {
        organization: "Gates Foundation",
        type: "Grant Application Support",
        category: "Funding",
      },
      {
        organization: "Ashoka Foundation",
        type: "Fellowship Nomination",
        category: "Fellowship",
      },
    ],
  },
  {
    id: "3",
    name: "Sanjay Mehta",
    initials: "SM",
    title: "Sustainable Agriculture Expert",
    location: "Pune",
    coordinates: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
    email: "sanjay.mehta@example.com",
    bio: "Agricultural scientist turned entrepreneur, focused on sustainable farming practices and empowering smallholder farmers through technology and training.",
    expertise: ["Agriculture", "Sustainability", "Training"],
    skills: ["Sustainable Farming", "Soil Science", "Crop Management", "Farmer Training", "Agricultural Technology"],
    joinDate: "February 2022",
    cohort: "Sustainable Agriculture 2022",
    industry: "Agriculture",
    subgroups: ["Sustainable Farming", "AgriTech", "Farmer Empowerment"],
    avatar: "/placeholder-user.jpg",
    isOnline: true,
    color: "emerald",
    social: {
      linkedin: "https://linkedin.com/in/sanjaymehta",
    },
    lookingFor: [
      "AgriTech startup partnerships",
      "Distribution channels for organic products",
      "Research collaboration on soil health",
      "Connections with agricultural cooperatives",
    ],
    offering: [
      "Sustainable farming workshops and training",
      "Soil health assessment and consultation",
      "Organic farming certification guidance",
      "Agricultural technology evaluation",
      "Farmer network introductions",
    ],
    experience: [
      {
        title: "Founder",
        company: "GreenHarvest Solutions",
        duration: "2021 - Present",
        description:
          "Providing sustainable agriculture solutions and training to smallholder farmers across Maharashtra.",
      },
      {
        title: "Agricultural Scientist",
        company: "ICRISAT",
        duration: "2018 - 2021",
        description: "Research on drought-resistant crops and sustainable farming practices for semi-arid regions.",
      },
    ],
    referrals: [
      {
        organization: "NABARD",
        type: "Agricultural Loan Facilitation",
        category: "Funding",
      },
      {
        organization: "FPO Connect",
        type: "Farmer Producer Organization Network",
        category: "Network",
      },
    ],
  },
  {
    id: "4",
    name: "Meera Gupta",
    initials: "MG",
    title: "Healthcare Innovation",
    location: "Bangalore",
    coordinates: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
    email: "meera.gupta@example.com",
    bio: "Healthcare innovator working at the intersection of technology and medicine. Focused on making quality healthcare accessible to underserved populations.",
    expertise: ["Healthcare", "Technology", "Innovation"],
    skills: ["Healthcare Technology", "Telemedicine", "Medical Devices", "Health Policy", "Digital Health"],
    joinDate: "April 2022",
    cohort: "Healthcare Innovators 2022",
    industry: "Healthcare",
    subgroups: ["HealthTech", "Telemedicine", "Medical Innovation"],
    avatar: "/placeholder-user.jpg",
    isOnline: false,
    color: "purple",
    social: {
      linkedin: "https://linkedin.com/in/meeragupta",
      website: "https://healthinnovate.in",
    },
    lookingFor: [
      "Healthcare technology co-founders",
      "Regulatory guidance for medical devices",
      "Partnerships with rural healthcare providers",
      "Clinical trial collaborators",
    ],
    offering: [
      "Healthcare technology consultation",
      "Telemedicine platform development",
      "Medical device design and testing",
      "Healthcare policy insights",
      "Clinical research methodology",
    ],
    experience: [
      {
        title: "Co-founder & CTO",
        company: "HealthTech Innovations",
        duration: "2020 - Present",
        description: "Developing telemedicine solutions for rural healthcare access and remote patient monitoring.",
      },
      {
        title: "Senior Product Manager",
        company: "Philips Healthcare",
        duration: "2018 - 2020",
        description: "Led product development for medical imaging devices and healthcare software solutions.",
      },
    ],
    referrals: [
      {
        organization: "BIRAC",
        type: "Biotech Startup Funding",
        category: "Funding",
      },
      {
        organization: "AIIMS Delhi",
        type: "Clinical Trial Partnership",
        category: "Research",
      },
    ],
  },
  {
    id: "5",
    name: "Vikram Thakur",
    initials: "VT",
    title: "Clean Energy Advocate",
    location: "Jaipur",
    coordinates: { lat: 26.9124, lng: 75.7873 }, // Jaipur coordinates
    email: "vikram.thakur@example.com",
    bio: "Clean energy advocate and solar entrepreneur. Working to accelerate renewable energy adoption across rural India through innovative financing and technology solutions.",
    expertise: ["Renewable Energy", "Solar", "Policy"],
    skills: ["Solar Technology", "Energy Policy", "Project Finance", "Rural Electrification", "Clean Energy"],
    joinDate: "May 2022",
    cohort: "Clean Energy Advocates 2022",
    industry: "Clean Energy",
    subgroups: ["Solar Energy", "Rural Electrification", "Energy Policy"],
    avatar: "/placeholder-user.jpg",
    isOnline: true,
    color: "yellow",
    social: {
      linkedin: "https://linkedin.com/in/vikramthakur",
      twitter: "https://twitter.com/vikramcleanenergy",
    },
    lookingFor: [
      "Clean energy project financing",
      "Solar installation partnerships",
      "Government policy connections",
      "Rural electrification opportunities",
    ],
    offering: [
      "Solar project development consultation",
      "Clean energy policy advocacy",
      "Rural electrification project management",
      "Renewable energy financing guidance",
      "Solar technology training programs",
    ],
    experience: [
      {
        title: "Founder & CEO",
        company: "SolarVillage Energy",
        duration: "2019 - Present",
        description: "Providing affordable solar energy solutions to rural communities across Rajasthan and Gujarat.",
      },
      {
        title: "Energy Policy Analyst",
        company: "TERI (The Energy and Resources Institute)",
        duration: "2017 - 2019",
        description: "Research and policy analysis on renewable energy adoption and rural electrification strategies.",
      },
    ],
    referrals: [
      {
        organization: "IREDA",
        type: "Renewable Energy Financing",
        category: "Funding",
      },
      {
        organization: "Solar Power Association of India",
        type: "Industry Network Access",
        category: "Network",
      },
    ],
  },
]

// Sample resources data
export const resources = [
  {
    id: "1",
    title: "The Lean Startup Methodology",
    description: "A comprehensive guide to building successful startups using lean principles and validated learning.",
    category: "Entrepreneurship",
    type: "PDF",
    author: "Eric Ries",
    downloadCount: 234,
    rating: 4.8,
    tags: ["startup", "methodology", "business"],
  },
  {
    id: "2",
    title: "Design Systems Handbook",
    description: "How to create scalable design systems for modern web applications and maintain consistency.",
    category: "Design",
    type: "PDF",
    author: "Design Team",
    downloadCount: 156,
    rating: 4.6,
    tags: ["design", "systems", "ui"],
  },
  {
    id: "3",
    title: "Funding Your Social Enterprise",
    description: "A practical guide to securing funding for social impact ventures and sustainable business models.",
    category: "Funding",
    type: "Video",
    author: "Social Impact Hub",
    downloadCount: 89,
    rating: 4.9,
    tags: ["funding", "social", "enterprise"],
  },
]

// Sample cohorts data
export const cohorts = [
  {
    id: "1",
    name: "Mumbai Entrepreneurs",
    description: "A vibrant community of entrepreneurs from Mumbai working on innovative solutions",
    memberCount: 45,
    category: "Entrepreneurship",
    location: "Mumbai, India",
    createdAt: "2023-01-15",
    isActive: true,
    tags: ["entrepreneurship", "mumbai", "innovation"],
    image: "/placeholder-cohort.jpg",
  },
  {
    id: "2",
    name: "Social Impact Makers",
    description: "Dedicated to creating positive social change through sustainable business models",
    memberCount: 32,
    category: "Social Impact",
    location: "Pan India",
    createdAt: "2023-02-20",
    isActive: true,
    tags: ["social-impact", "sustainability", "change"],
    image: "/placeholder-cohort.jpg",
  },
  {
    id: "3",
    name: "Tech Innovators",
    description: "Technology enthusiasts and startup founders building the next generation of tech solutions",
    memberCount: 28,
    category: "Technology",
    location: "Bangalore, India",
    createdAt: "2023-03-10",
    isActive: true,
    tags: ["technology", "innovation", "startups"],
    image: "/placeholder-cohort.jpg",
  },
]

// Sample cohort posts data
export const cohortPosts = [
  {
    id: "1",
    cohortId: "1",
    author: {
      name: "Rajesh Mehta",
      initials: "RM",
      title: "Founder, GreenTech Solutions",
    },
    content:
      "Excited to share our latest milestone - we've successfully deployed our water purification system in 50 villages across Maharashtra! The impact has been incredible.",
    timestamp: "3 hours ago",
    likes: 18,
    comments: 4,
    shares: 2,
    tags: ["milestone", "impact", "water"],
  },
  {
    id: "2",
    cohortId: "2",
    author: {
      name: "Sneha Patel",
      initials: "SP",
      title: "Social Entrepreneur",
    },
    content:
      "Looking for mentorship on scaling our education initiative. We're currently serving 500+ underprivileged children and want to expand to neighboring states.",
    timestamp: "5 hours ago",
    likes: 12,
    comments: 6,
    shares: 3,
    tags: ["mentorship", "education", "scaling"],
  },
]
