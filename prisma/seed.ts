// prisma/seed.ts
import { PrismaClient, UserRole, MemberStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Comprehensive list of 40 dummy users with detailed profiles
const memberDataList = [
  {
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    initials: 'JS',
    title: 'Social Entrepreneur at Impact Ventures',
    bio: 'Passionate about creating positive social impact through innovative solutions and community engagement.',
    location: 'Mumbai, India',
    skills: ['Social Innovation', 'Impact Measurement', 'Community Building'],
    expertise: ['Sustainability', 'Social Enterprise'],
    experience: ['Founder at Social Ventures (5 years)', 'Impact Consultant at NGO Partners (3 years)'],
    education: ['Masters in Social Entrepreneurship - LSE', 'Bachelor in Economics - Delhi University'],
    lookingFor: ['Partnerships', 'Funding Opportunities', 'Mentorship'],
    offering: ['Strategic Guidance', 'Network Access', 'Impact Expertise'],
    website: 'https://janesmith.social',
    twitter: '@janesmith',
    linkedin: 'linkedin.com/in/janesmith',
    cohort: '2022',
  },
  {
    email: 'rahul.kumar@example.com',
    name: 'Rahul Kumar',
    initials: 'RK',
    title: 'Tech Entrepreneur • Scaling Startups',
    bio: 'Building tech startups with social impact at the core. Passionate about using technology for good.',
    location: 'Mumbai, India',
    skills: ['Technology', 'Entrepreneurship', 'Mentoring', 'Product Development'],
    expertise: ['SaaS', 'Mobile Apps', 'AI/ML'],
    experience: ['Founder & CEO at TechForGood (6 years)', 'CTO at Digital Solutions Inc (4 years)'],
    education: ['Bachelor in Computer Science - IIT Mumbai', 'Nanodegree in AI - Udacity'],
    lookingFor: ['Technical Co-founders', 'Investors', 'Tech Partnerships'],
    offering: ['Technical Mentorship', 'Product Guidance', 'Network in Tech'],
    website: 'https://rahulkumar.tech',
    github: 'github.com/rahulkumar',
    linkedin: 'linkedin.com/in/rahulkumar',
    cohort: '2021',
  },
  {
    email: 'anjali.patel@example.com',
    name: 'Anjali Patel',
    initials: 'AP',
    title: 'Social Impact Consultant',
    bio: 'Focused on rural development and education initiatives. 10+ years of experience in development sector.',
    location: 'Delhi, India',
    skills: ['Education', 'Rural Development', 'Impact Assessment'],
    expertise: ['Program Design', 'Monitoring & Evaluation', 'Community Engagement'],
    experience: ['Development Consultant at World Bank (7 years)', 'Program Manager at UNICEF (5 years)'],
    education: ['Masters in Public Administration - Delhi School of Economics', 'Bachelor in Social Work - Delhi University'],
    lookingFor: ['Project Collaborations', 'Research Partners', 'Field Implementation'],
    offering: ['Program Design Expertise', 'Impact Measurement Framework', 'Policy Guidance'],
    linkedin: 'linkedin.com/in/anjalipatel',
    cohort: '2020',
  },
  {
    email: 'sanjay.mehta@example.com',
    name: 'Sanjay Mehta',
    initials: 'SM',
    title: 'Sustainable Agriculture Expert',
    bio: 'Promoting sustainable farming practices and organic agriculture. Connected with 5000+ farmers.',
    location: 'Pune, India',
    skills: ['Agriculture', 'Sustainability', 'Environment', 'Farmer Training'],
    expertise: ['Organic Farming', 'Agricultural Technology', 'Supply Chain'],
    experience: ['Founder at GreenFields Initiative (8 years)', 'Agriculture Scientist at ICAR (6 years)'],
    education: ['Masters in Agricultural Sciences - University of Pune', 'PhD in Sustainable Agriculture (ongoing)'],
    lookingFor: ['Technology Partners', 'Market Access', 'Research Collaboration'],
    offering: ['Agricultural Expertise', 'Farmer Network Access', 'Training Programs'],
    website: 'https://greenfields.farm',
    linkedin: 'linkedin.com/in/sanjaymehta',
    cohort: '2019',
  },
  {
    email: 'meera.gupta@example.com',
    name: 'Meera Gupta',
    initials: 'MG',
    title: 'Healthcare Innovation Lead',
    bio: 'Building healthcare solutions for underserved rural areas. Digital health enthusiast.',
    location: 'Bangalore, India',
    skills: ['Healthcare', 'Innovation', 'Technology', 'Digital Health'],
    expertise: ['Telemedicine', 'Health Tech', 'Public Health'],
    experience: ['Co-founder at HealthConnect (4 years)', 'Healthcare Consultant at McKinsey (5 years)'],
    education: ['Masters in Health Administration - AIIMS Delhi', 'Bachelor in Medicine - Bangalore Medical College'],
    lookingFor: ['Healthcare Partnerships', 'Government Collaborations', 'Tech Integration'],
    offering: ['Medical Expertise', 'Healthcare Networks', 'Regulatory Guidance'],
    linkedin: 'linkedin.com/in/meeragupta',
    cohort: '2022',
  },
  {
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    initials: 'PS',
    title: 'Education Technology Pioneer',
    bio: 'Building EdTech solutions to democratize quality education. Passionate about inclusive learning.',
    location: 'Hyderabad, India',
    skills: ['EdTech', 'Curriculum Design', 'Online Learning'],
    expertise: ['E-Learning Platforms', 'Pedagogy', 'Student Engagement'],
    experience: ['Founder at LearnHub (5 years)', 'Education Manager at TCS (4 years)'],
    education: ['Masters in Education Technology - University of Hyderabad', 'Bachelor in Education - Central University'],
    lookingFor: ['Technology Partners', 'School Networks', 'Funding'],
    offering: ['EdTech Expertise', 'Curriculum Content', 'Training'],
    twitter: '@priyasharma_ed',
    linkedin: 'linkedin.com/in/priyasharma',
    cohort: '2021',
  },
  {
    email: 'vikram.singh@example.com',
    name: 'Vikram Singh',
    initials: 'VS',
    title: 'Environmental Conservation Leader',
    bio: 'Working on forest conservation and biodiversity projects across Eastern India.',
    location: 'Kolkata, India',
    skills: ['Environmental Conservation', 'Biodiversity', 'Wildlife'],
    expertise: ['Forest Management', 'Community Conservation', 'Climate Action'],
    experience: ['Director at Forest Protection Initiative (7 years)', 'Biologist at Wildlife Institute (5 years)'],
    education: ['PhD in Forest Ecology - University of Kolkata', 'Masters in Biology - Delhi University'],
    lookingFor: ['Conservation Partnerships', 'Research Funding', 'International Collaborations'],
    offering: ['Conservation Expertise', 'Research Data', 'Field Implementation'],
    linkedin: 'linkedin.com/in/vikramsingh',
    cohort: '2020',
  },
  {
    email: 'neha.kapoor@example.com',
    name: 'Neha Kapoor',
    initials: 'NK',
    title: 'Women Empowerment Advocate',
    bio: 'Dedicated to women empowerment through skill development and financial inclusion.',
    location: 'Chandigarh, India',
    skills: ['Women Empowerment', 'Financial Inclusion', 'Skill Development'],
    expertise: ['Microfinance', 'Vocational Training', 'Gender Studies'],
    experience: ['Executive Director at Women First (6 years)', 'Program Officer at SEWA (4 years)'],
    education: ['Masters in Gender Studies - Delhi University', 'Bachelor in Commerce - Chandigarh University'],
    lookingFor: ['Funding Partners', 'Skill Training Content', 'Market Linkages'],
    offering: ['Women Networks', 'Training Programs', 'Policy Advocacy'],
    twitter: '@nehakapoor_women',
    linkedin: 'linkedin.com/in/nehakapoor',
    cohort: '2021',
  },
  {
    email: 'arjun.prabhu@example.com',
    name: 'Arjun Prabhu',
    initials: 'AP',
    title: 'Fintech Innovator',
    bio: 'Creating financial technology solutions for underbanked communities. Payment systems expert.',
    location: 'Bangalore, India',
    skills: ['Fintech', 'Blockchain', 'Payment Systems', 'Software Engineering'],
    expertise: ['Digital Payments', 'Cryptocurrency', 'Financial Inclusion'],
    experience: ['CTO at PayTech Solutions (5 years)', 'Software Engineer at Goldman Sachs (6 years)'],
    education: ['Masters in Computer Science - University of Bangalore', 'Bachelor in IT - VIT University'],
    lookingFor: ['Technical Partnerships', 'Enterprise Clients', 'Regulatory Support'],
    offering: ['Technical Expertise', 'Open Source Solutions', 'Dev Team'],
    github: 'github.com/arjunprabhu',
    linkedin: 'linkedin.com/in/arjunprabhu',
    cohort: '2022',
  },
  {
    email: 'deepa.nair@example.com',
    name: 'Deepa Nair',
    initials: 'DN',
    title: 'Sustainable Fashion Entrepreneur',
    bio: 'Building sustainable fashion brands with ethical supply chains. Promoting responsible consumption.',
    location: 'Kochi, India',
    skills: ['Fashion', 'Sustainability', 'Supply Chain', 'Social Enterprise'],
    expertise: ['Ethical Fashion', 'Sustainable Materials', 'Artisan Collaboration'],
    experience: ['Founder at EcoStyle Creations (4 years)', 'Fashion Designer at International Brands (5 years)'],
    education: ['Masters in Fashion Design - NIFT Delhi', 'Bachelor in Textiles - University of Kochi'],
    lookingFor: ['Supplier Networks', 'Market Access', 'Impact Investors'],
    offering: ['Fashion Expertise', 'Supply Chain Support', 'Artisan Networks'],
    website: 'https://ecostylecreations.com',
    linkedin: 'linkedin.com/in/deepanair',
    cohort: '2021',
  },
  {
    email: 'rohan.kapoor@example.com',
    name: 'Rohan Kapoor',
    initials: 'RK',
    title: 'Urban Development Strategist',
    bio: 'Focused on sustainable urban development and smart city solutions. Working across 20+ cities.',
    location: 'Gurgaon, India',
    skills: ['Urban Development', 'Smart Cities', 'Infrastructure', 'Planning'],
    expertise: ['City Planning', 'Transportation', 'Sustainability in Cities'],
    experience: ['Urban Consultant at McKinsey (6 years)', 'City Planner at Ministry of Urban Affairs (5 years)'],
    education: ['Masters in Urban Planning - School of Planning & Architecture', 'Bachelor in Architecture - Delhi University'],
    lookingFor: ['Government Partnerships', 'Infrastructure Projects', 'Tech Integration'],
    offering: ['Urban Planning Expertise', 'Government Connections', 'Feasibility Studies'],
    linkedin: 'linkedin.com/in/rohankapoor',
    cohort: '2020',
  },
  {
    email: 'divya.sharma@example.com',
    name: 'Divya Sharma',
    initials: 'DS',
    title: 'Healthcare Policy Advocate',
    bio: 'Advocating for inclusive healthcare policies and access to medicines for all.',
    location: 'New Delhi, India',
    skills: ['Healthcare Policy', 'Advocacy', 'Public Health'],
    expertise: ['Policy Drafting', 'Healthcare Economics', 'Government Relations'],
    experience: ['Policy Advisor at Ministry of Health (5 years)', 'Researcher at Health Analytics (4 years)'],
    education: ['Masters in Public Health - Delhi School of Economics', 'Bachelor in Medicine - Delhi Medical College'],
    lookingFor: ['Policy Research Collaborations', 'International Partnerships'],
    offering: ['Policy Expertise', 'Research Data', 'Government Connections'],
    linkedin: 'linkedin.com/in/divyasharma',
    cohort: '2020',
  },
  {
    email: 'sameer.khan@example.com',
    name: 'Sameer Khan',
    initials: 'SK',
    title: 'Water & Sanitation Specialist',
    bio: 'Implementing WASH solutions in remote villages. Installed water systems for 50+ communities.',
    location: 'Nagpur, India',
    skills: ['Water Management', 'Sanitation', 'Community Development'],
    expertise: ['WASH Solutions', 'Infrastructure', 'Community Engagement'],
    experience: ['Program Director at WaterCare (7 years)', 'Field Engineer at UNICEF (5 years)'],
    education: ['Masters in Environmental Engineering - IIT Bombay', 'Bachelor in Civil Engineering - NIT Nagpur'],
    lookingFor: ['Funding for Projects', 'Technical Partnerships', 'Government Support'],
    offering: ['Technical Expertise', 'Community Networks', 'Implementation Support'],
    linkedin: 'linkedin.com/in/sameerkhan',
    cohort: '2019',
  },
  {
    email: 'ritika.singh@example.com',
    name: 'Ritika Singh',
    initials: 'RS',
    title: 'Mental Health Advocate',
    bio: 'Promoting mental health awareness and accessible counseling services in India.',
    location: 'Pune, India',
    skills: ['Mental Health', 'Counseling', 'Awareness Programs'],
    expertise: ['Clinical Psychology', 'Community Mental Health', 'Crisis Support'],
    experience: ['Founder at MindCare Foundation (4 years)', 'Therapist at Apollo Hospitals (6 years)'],
    education: ['Masters in Clinical Psychology - Pune University', 'Bachelor in Psychology - Delhi University'],
    lookingFor: ['Partnerships with Healthcare Providers', 'Funding'],
    offering: ['Mental Health Expertise', 'Counselor Network', 'Training Programs'],
    linkedin: 'linkedin.com/in/ritikasingh',
    cohort: '2022',
  },
  {
    email: 'nikhil.verma@example.com',
    name: 'Nikhil Verma',
    initials: 'NV',
    title: 'Clean Energy Entrepreneur',
    bio: 'Building solar energy solutions for rural electrification. Impacting 10,000+ households.',
    location: 'Rajasthan, India',
    skills: ['Renewable Energy', 'Solar Technology', 'Entrepreneurship'],
    expertise: ['Solar Engineering', 'Energy Management', 'Off-Grid Solutions'],
    experience: ['Founder at SunEnergy India (6 years)', 'Engineer at RenewTech (4 years)'],
    education: ['Masters in Energy Engineering - IIT Delhi', 'Bachelor in Electrical Engineering - NIT Jaipur'],
    lookingFor: ['Funding', 'Supply Chain Partners', 'Government Contracts'],
    offering: ['Energy Expertise', 'Technical Support', 'Supplier Networks'],
    linkedin: 'linkedin.com/in/nikhilverma',
    cohort: '2020',
  },
  {
    email: 'pooja.malhotra@example.com',
    name: 'Pooja Malhotra',
    initials: 'PM',
    title: 'Disability Inclusion Specialist',
    bio: 'Working on inclusive employment and accessibility for persons with disabilities.',
    location: 'Mumbai, India',
    skills: ['Disability Inclusion', 'Accessibility', 'Employment'],
    expertise: ['Inclusive Design', 'Vocational Rehabilitation', 'Rights Advocacy'],
    experience: ['Director at Include India (5 years)', 'Accessibility Consultant at Tech Companies (6 years)'],
    education: ['Masters in Social Work - Mumbai University', 'Bachelor in Commerce - Mumbai University'],
    lookingFor: ['Corporate Partnerships', 'Technology Integration'],
    offering: ['Disability Expertise', 'Community Networks', 'Accessible Design Guidance'],
    linkedin: 'linkedin.com/in/poojamalhotra',
    cohort: '2021',
  },
  {
    email: 'aditya.seth@example.com',
    name: 'Aditya Seth',
    initials: 'AS',
    title: 'AI/ML Research Lead',
    bio: 'Using AI and machine learning to solve social problems. Research focused on bias reduction.',
    location: 'Bangalore, India',
    skills: ['AI', 'Machine Learning', 'Data Science', 'Research'],
    expertise: ['Deep Learning', 'NLP', 'Computer Vision', 'Ethical AI'],
    experience: ['AI Researcher at Google India (5 years)', 'Data Scientist at IBM (4 years)'],
    education: ['PhD in Machine Learning - IIT Delhi', 'Masters in Computer Science - University of Pune'],
    lookingFor: ['Research Collaborations', 'Datasets', 'Academic Partnerships'],
    offering: ['AI Expertise', 'Research Guidance', 'Technical Solutions'],
    github: 'github.com/adityaseth',
    linkedin: 'linkedin.com/in/adityaseth',
    cohort: '2022',
  },
  {
    email: 'sneha.joshi@example.com',
    name: 'Sneha Joshi',
    initials: 'SJ',
    title: 'Arts & Culture Preservationist',
    bio: 'Documenting and preserving traditional Indian arts and crafts. Working with 200+ artisans.',
    location: 'Jaipur, India',
    skills: ['Cultural Heritage', 'Arts Preservation', 'Artisan Support'],
    expertise: ['Traditional Crafts', 'Cultural Documentation', 'Market Development'],
    experience: ['Founder at Heritage Arts Foundation (6 years)', 'Curator at National Museum (4 years)'],
    education: ['Masters in Art History - Delhi University', 'Bachelor in Fine Arts - Jaipur University'],
    lookingFor: ['Tourism Partnerships', 'International Markets', 'Documentation Funding'],
    offering: ['Artisan Networks', 'Cultural Expertise', 'Market Linkages'],
    website: 'https://heritagearts.org',
    linkedin: 'linkedin.com/in/snehajoshi',
    cohort: '2021',
  },
  {
    email: 'vikash.patel@example.com',
    name: 'Vikash Patel',
    initials: 'VP',
    title: 'Community Sports Developer',
    bio: 'Promoting sports and fitness in underprivileged communities. Coaching 500+ youth.',
    location: 'Ahmedabad, India',
    skills: ['Sports Development', 'Community Engagement', 'Youth Training'],
    expertise: ['Athletic Coaching', 'Sports Management', 'Grassroots Programs'],
    experience: ['Director at Youth Sports India (5 years)', 'Coach at National Sports Academy (6 years)'],
    education: ['Masters in Sports Management - Ahmedabad University', 'Bachelor in Physical Education - Vadodara University'],
    lookingFor: ['Sports Equipment Sponsorship', 'Training Partnerships'],
    offering: ['Coaching Expertise', 'Youth Networks', 'Sports Programs'],
    linkedin: 'linkedin.com/in/vikashpatel',
    cohort: '2021',
  },
  {
    email: 'anjum.khan@example.com',
    name: 'Anjum Khan',
    initials: 'AK',
    title: 'Interfaith Dialogue Facilitator',
    bio: 'Building bridges between communities through interfaith dialogue and cultural exchange programs.',
    location: 'Lucknow, India',
    skills: ['Interfaith Dialogue', 'Community Building', 'Peace Building'],
    expertise: ['Conflict Resolution', 'Community Engagement', 'Cultural Mediation'],
    experience: ['Director at Peace Builders India (5 years)', 'Community Organizer at NGOs (7 years)'],
    education: ['Masters in Theology - Lucknow University', 'Bachelor in Sociology - Delhi University'],
    lookingFor: ['Grant Funding', 'International Partnerships'],
    offering: ['Community Networks', 'Dialogue Facilitation', 'Training Programs'],
    linkedin: 'linkedin.com/in/anjumkhan',
    cohort: '2020',
  },
  {
    email: 'ravi.kumar.nair@example.com',
    name: 'Ravi Kumar Nair',
    initials: 'RN',
    title: 'Circular Economy Expert',
    bio: 'Designing circular economy solutions and waste management systems for businesses and cities.',
    location: 'Chennai, India',
    skills: ['Circular Economy', 'Waste Management', 'Sustainability'],
    expertise: ['Resource Efficiency', 'Supply Chain Optimization', 'Green Business'],
    experience: ['Consultant at Circular Solutions (6 years)', 'Environmental Manager at Fortune 500 (5 years)'],
    education: ['Masters in Environmental Management - Anna University', 'Bachelor in Chemical Engineering - IIT Madras'],
    lookingFor: ['Corporate Clients', 'Government Projects', 'Technology Partners'],
    offering: ['Circular Economy Expertise', 'Implementation Support', 'Business Case Development'],
    linkedin: 'linkedin.com/in/ravikumarnair',
    cohort: '2021',
  },
  {
    email: 'tara.mishra@example.com',
    name: 'Tara Mishra',
    initials: 'TM',
    title: 'Child Rights Advocate',
    bio: 'Fighting child labor and promoting education and protection for vulnerable children.',
    location: 'Indore, India',
    skills: ['Child Rights', 'Education', 'Child Protection'],
    expertise: ['Child Welfare', 'Education Policy', 'Rehabilitation Programs'],
    experience: ['Executive Director at Child Protect Foundation (6 years)', 'Field Officer at UNICEF (5 years)'],
    education: ['Masters in Social Work - Delhi University', 'Bachelor in Education - Indore University'],
    lookingFor: ['Partnership with Schools', 'Government Support', 'International Funding'],
    offering: ['Child Rights Expertise', 'Community Networks', 'Rehabilitation Programs'],
    linkedin: 'linkedin.com/in/taramishra',
    cohort: '2020',
  },
  {
    email: 'harsh.gupta@example.com',
    name: 'Harsh Gupta',
    initials: 'HG',
    title: 'Startup Mentor & Investor',
    bio: 'Mentoring early-stage startups and investing in social impact ventures. Backed 20+ startups.',
    location: 'Delhi, India',
    skills: ['Startup Mentoring', 'Investment', 'Business Strategy'],
    expertise: ['Venture Capital', 'Startup Scaling', 'Business Models'],
    experience: ['Founder of Catalyst Ventures Fund (4 years)', 'VP at TechStars (5 years)'],
    education: ['MBA from IIM Delhi', 'Bachelor in Engineering - Delhi University'],
    lookingFor: ['High-impact Startups', 'Co-investors'],
    offering: ['Investment Capital', 'Mentorship', 'Network Access'],
    twitter: '@harshgupta_inv',
    linkedin: 'linkedin.com/in/harshgupta',
    cohort: '2019',
  },
  {
    email: 'malini.chakraborty@example.com',
    name: 'Malini Chakraborty',
    initials: 'MC',
    title: 'Gender-Based Violence Prevention Specialist',
    bio: 'Creating safe spaces and supporting survivors of gender-based violence through counseling and advocacy.',
    location: 'Kolkata, India',
    skills: ['GBV Prevention', 'Counseling', 'Advocacy', 'Community Support'],
    expertise: ['Trauma Counseling', 'Legal Rights', 'Rehabilitation'],
    experience: ['Founder at Safe Spaces Initiative (5 years)', 'Counselor at Legal Aid Centers (6 years)'],
    education: ['Masters in Clinical Psychology - Kolkata University', 'Diploma in Law - Legal Education Institute'],
    lookingFor: ['Funding for Shelters', 'Legal Support Networks', 'Corporate CSR Partnerships'],
    offering: ['Counseling Services', 'Training Programs', 'Advocacy Support'],
    linkedin: 'linkedin.com/in/malinichakraborty',
    cohort: '2021',
  },
  {
    email: 'ashok.reddy@example.com',
    name: 'Ashok Reddy',
    initials: 'AR',
    title: 'Agricultural Tech Innovator',
    bio: 'Developing low-cost agricultural technologies for small and marginal farmers. Tech for farming.',
    location: 'Hyderabad, India',
    skills: ['AgriTech', 'IoT', 'Software Development', 'Farming'],
    expertise: ['Precision Agriculture', 'Farm Management Software', 'IoT Solutions'],
    experience: ['Founder at FarmTech Solutions (5 years)', 'Software Engineer at IBM (6 years)'],
    education: ['Masters in Computer Science - IIIT Hyderabad', 'Bachelor in Engineering - Andhra University'],
    lookingFor: ['Farmer Networks', 'Government Support', 'Venture Funding'],
    offering: ['Technology Solutions', 'Farmer Training', 'Implementation Support'],
    github: 'github.com/ashokreddy',
    linkedin: 'linkedin.com/in/ashokreddy',
    cohort: '2022',
  },
  {
    email: 'deepika.sharma@example.com',
    name: 'Deepika Sharma',
    initials: 'DS',
    title: 'Nutritionist & Public Health Expert',
    bio: 'Addressing malnutrition and promoting healthy lifestyles in rural communities.',
    location: 'Lucknow, India',
    skills: ['Nutrition', 'Public Health', 'Health Education'],
    expertise: ['Community Nutrition', 'Health Programs', 'Food Security'],
    experience: ['Program Director at NutriCare India (5 years)', 'Health Officer at WHO (4 years)'],
    education: ['Masters in Public Health Nutrition - Delhi University', 'Bachelor in Food Science - Lucknow University'],
    lookingFor: ['Health Program Partnerships', 'Government Collaborations'],
    offering: ['Nutrition Expertise', 'Health Education Materials', 'Program Design'],
    linkedin: 'linkedin.com/in/deepikasharma',
    cohort: '2021',
  },
  {
    email: 'sanjiv.kumar@example.com',
    name: 'Sanjiv Kumar',
    initials: 'SK',
    title: 'Vocational Training Pioneer',
    bio: 'Setting up skill development centers and providing vocational training to unemployed youth.',
    location: 'Patna, India',
    skills: ['Vocational Training', 'Skill Development', 'Employment'],
    expertise: ['Curriculum Development', 'Trainer Training', 'Placement Support'],
    experience: ['Director at Skills First India (6 years)', 'Training Manager at NGOs (5 years)'],
    education: ['Masters in Education - Patna University', 'Diploma in Vocational Training - National Institute'],
    lookingFor: ['Training Content Partnerships', 'Employer Linkages'],
    offering: ['Training Programs', 'Curriculum Content', 'Trainer Networks'],
    linkedin: 'linkedin.com/in/sanjivkumar',
    cohort: '2020',
  },
  {
    email: 'kavya.reddy@example.com',
    name: 'Kavya Reddy',
    initials: 'KR',
    title: 'STEM Education Promoter',
    bio: 'Building STEM programs for girls in rural India. Working with 50+ schools.',
    location: 'Bangalore, India',
    skills: ['STEM Education', 'Girls Empowerment', 'Curriculum Design'],
    expertise: ['STEM Pedagogy', 'Teacher Training', 'Resource Development'],
    experience: ['Founder at STEM for Girls (4 years)', 'Educator at Schools (6 years)'],
    education: ['Masters in Education Technology - Bangalore University', 'Bachelor in Physics - Delhi University'],
    lookingFor: ['Educational Partnerships', 'Funding', 'Corporate Sponsorships'],
    offering: ['STEM Curriculum', 'Teacher Training', 'Resource Materials'],
    linkedin: 'linkedin.com/in/kavyareddy',
    cohort: '2022',
  },
  {
    email: 'manish.singh@example.com',
    name: 'Manish Singh',
    initials: 'MS',
    title: 'Microfinance Specialist',
    bio: 'Providing microfinance and financial literacy to low-income entrepreneurs and women groups.',
    location: 'Varanasi, India',
    skills: ['Microfinance', 'Financial Literacy', 'Credit Management'],
    expertise: ['Micro-lending', 'Group Lending Models', 'Financial Inclusion'],
    experience: ['Director at Microfinance Solutions (6 years)', 'Credit Officer at Banks (5 years)'],
    education: ['Masters in Finance - Varanasi University', 'Bachelor in Commerce - Delhi University'],
    lookingFor: ['Investor Networks', 'Government Support', 'Lending Partnerships'],
    offering: ['Microfinance Expertise', 'Lending Framework', 'Financial Literacy Programs'],
    linkedin: 'linkedin.com/in/manishsingh',
    cohort: '2020',
  },
  {
    email: 'swati.patel@example.com',
    name: 'Swati Patel',
    initials: 'SP',
    title: 'Digital Literacy Educator',
    bio: 'Teaching digital skills to seniors and underprivileged populations. Bridging digital divide.',
    location: 'Ahmedabad, India',
    skills: ['Digital Literacy', 'Technology Education', 'Community Engagement'],
    expertise: ['Online Safety', 'Basic Computing', 'Smartphone Skills'],
    experience: ['Founder at Digital Bridge India (4 years)', 'Tech Educator at NGOs (5 years)'],
    education: ['Masters in Information Technology - Ahmedabad University', 'Bachelor in Commerce - Gujarat University'],
    lookingFor: ['Technology Partnerships', 'Training Material Sponsorship'],
    offering: ['Digital Training Programs', 'Educational Content', 'Trainer Network'],
    linkedin: 'linkedin.com/in/swatipatel',
    cohort: '2021',
  },
  {
    email: 'raj.kumar@example.com',
    name: 'Raj Kumar',
    initials: 'RK',
    title: 'Supply Chain Optimization Expert',
    bio: 'Optimizing supply chains for social enterprises and fair trade organizations.',
    location: 'Gurgaon, India',
    skills: ['Supply Chain', 'Logistics', 'Operations', 'Business Strategy'],
    expertise: ['Fair Trade', 'Ethical Supply Chains', 'Efficiency'],
    experience: ['Consultant at Supply Chain Experts (6 years)', 'Operations Manager at Logistics Co (5 years)'],
    education: ['MBA from Delhi Business School', 'Bachelor in Engineering - Delhi University'],
    lookingFor: ['Consulting Opportunities', 'Enterprise Clients'],
    offering: ['Supply Chain Expertise', 'Process Optimization', 'Implementation Support'],
    linkedin: 'linkedin.com/in/rajkumar',
    cohort: '2021',
  },
  {
    email: 'nisha.prabhu@example.com',
    name: 'Nisha Prabhu',
    initials: 'NP',
    title: 'Conservation Biology Researcher',
    bio: 'Researching biodiversity conservation and ecosystem restoration in Western Ghats.',
    location: 'Goa, India',
    skills: ['Conservation Biology', 'Ecosystem Science', 'Research'],
    expertise: ['Wildlife Research', 'Habitat Restoration', 'Community Conservation'],
    experience: ['Research Fellow at Wildlife Institute (6 years)', 'Field Scientist at Conservation NGO (4 years)'],
    education: ['PhD in Conservation Biology - University of Goa', 'Masters in Biology - Delhi University'],
    lookingFor: ['Research Funding', 'International Collaborations', 'Publication Support'],
    offering: ['Research Expertise', 'Field Data', 'Conservation Networks'],
    linkedin: 'linkedin.com/in/nishaprabhu',
    cohort: '2021',
  },
  {
    email: 'suresh.agarwal@example.com',
    name: 'Suresh Agarwal',
    initials: 'SA',
    title: 'Cooperative Development Specialist',
    bio: 'Strengthening farmer cooperatives and self-help groups for collective action.',
    location: 'Jaipur, India',
    skills: ['Cooperative Development', 'Group Formation', 'Community Economics'],
    expertise: ['Cooperative Management', 'Value Addition', 'Market Linkages'],
    experience: ['Director at Cooperative Development Foundation (7 years)', 'Extension Officer at Agricultural Department (5 years)'],
    education: ['Masters in Cooperative Management - Jaipur University', 'Bachelor in Agriculture - Rajasthan University'],
    lookingFor: ['Government Partnerships', 'Funding', 'Technology Integration'],
    offering: ['Cooperative Expertise', 'Group Formation Support', 'Training Programs'],
    linkedin: 'linkedin.com/in/sureshagarwal',
    cohort: '2019',
  },
  {
    email: 'isha.kapoor@example.com',
    name: 'Isha Kapoor',
    initials: 'IK',
    title: 'Social Media & Digital Marketing Strategist',
    bio: 'Helping nonprofits and social enterprises build digital presence and online communities.',
    location: 'Mumbai, India',
    skills: ['Digital Marketing', 'Social Media', 'Content Strategy', 'Community Building'],
    expertise: ['Social Campaign Strategy', 'Influencer Networks', 'Digital Fundraising'],
    experience: ['Founder at SocialForGood Media (3 years)', 'Digital Strategist at Ad Agencies (5 years)'],
    education: ['Masters in Digital Marketing - Mumbai University', 'Bachelor in Communication - Delhi University'],
    lookingFor: ['NGO Partnerships', 'Project Collaborations'],
    offering: ['Digital Strategy', 'Content Creation Support', 'Media Networks'],
    twitter: '@ishakapoor_dm',
    linkedin: 'linkedin.com/in/ishakapoor',
    cohort: '2022',
  },
  {
    email: 'vikram.sharma@example.com',
    name: 'Vikram Sharma',
    initials: 'VS',
    title: 'Data Analytics for Good Specialist',
    bio: 'Using data analytics to measure impact and drive decision-making in social sector.',
    location: 'Bangalore, India',
    skills: ['Data Analytics', 'Impact Measurement', 'Data Science'],
    expertise: ['Impact Metrics', 'Dashboard Development', 'Data Visualization'],
    experience: ['Data Scientist at Analytics Firm (5 years)', 'Research Analyst at Think Tank (4 years)'],
    education: ['Masters in Data Science - Bangalore University', 'Bachelor in Statistics - Delhi University'],
    lookingFor: ['Impact Measurement Projects', 'Research Collaborations'],
    offering: ['Data Analytics Expertise', 'Impact Framework', 'Dashboard Development'],
    github: 'github.com/vikramsharma',
    linkedin: 'linkedin.com/in/vikramsharma',
    cohort: '2021',
  },
  {
    email: 'priyanka.singh@example.com',
    name: 'Priyanka Singh',
    initials: 'PS',
    title: 'Climate Action Advocate',
    bio: 'Promoting climate resilience and green practices in agricultural communities.',
    location: 'Patna, India',
    skills: ['Climate Action', 'Environmental Sustainability', 'Community Engagement'],
    expertise: ['Climate Resilience', 'Green Agriculture', 'Renewable Energy'],
    experience: ['Director at Climate Action India (4 years)', 'Program Officer at Climate NGO (5 years)'],
    education: ['Masters in Climate Science - Delhi University', 'Bachelor in Environmental Studies - Patna University'],
    lookingFor: ['Climate Projects', 'International Partnerships', 'Funding'],
    offering: ['Climate Expertise', 'Community Mobilization', 'Training Programs'],
    linkedin: 'linkedin.com/in/priyankasingh',
    cohort: '2021',
  },
  {
    email: 'arun.nair@example.com',
    name: 'Arun Nair',
    initials: 'AN',
    title: 'Legal Aid & Rights Advocate',
    bio: 'Providing free legal services and rights education to marginalized communities.',
    location: 'Thiruvananthapuram, India',
    skills: ['Legal Aid', 'Rights Education', 'Advocacy'],
    expertise: ['Constitutional Law', 'Labor Rights', 'Consumer Rights'],
    experience: ['Director at Legal Rights Foundation (5 years)', 'Lawyer at Legal Aid Centers (6 years)'],
    education: ['Masters in Constitutional Law - Law University', 'Bachelor of Laws - Delhi University'],
    lookingFor: ['Legal Support Networks', 'Government Partnerships'],
    offering: ['Legal Expertise', 'Rights Training', 'Advocacy Support'],
    linkedin: 'linkedin.com/in/arunair',
    cohort: '2020',
  },
  {
    email: 'deepak.sharma@example.com',
    name: 'Deepak Sharma',
    initials: 'DS',
    title: 'Fintech for Financial Inclusion',
    bio: 'Building financial technology solutions to bring banking services to underbanked populations across rural India. Founded InclusivePay Tech with a mission to democratize financial access.',
    location: 'Gurgaon, India',
    skills: ['Fintech', 'Financial Inclusion', 'Mobile Banking', 'Payment Systems', 'Blockchain'],
    expertise: ['Digital Payments', 'Microfinance Technology', 'Blockchain', 'UPI Integration'],
    experience: ['Founder at InclusivePay Tech (5 years)', 'Product Manager at FinTech Startup (6 years)', 'Software Engineer at ICICI Bank (3 years)'],
    education: ['Masters in Finance & Technology - IIT Delhi', 'Bachelor in Computer Science - Manipal University'],
    lookingFor: ['Investment Partners', 'Banking Sector Connections', 'Regulatory Expertise', 'International Expansion Partners', 'Blockchain Integration Specialists'],
    offering: ['Fintech Solutions', 'Technical Architecture Guidance', 'Financial Inclusion Strategy', 'Payment Gateway Integration', 'Regulatory Navigation Support'],
    website: 'https://inclusivepay.tech',
    github: 'github.com/deepaksharma',
    linkedin: 'linkedin.com/in/deepaksharma',
    cohort: '2023',
  },
  {
    email: 'natasha.patel@example.com',
    name: 'Natasha Patel',
    initials: 'NP',
    title: 'Women Leadership & Entrepreneurship Coach',
    bio: 'Empowering women entrepreneurs through mentorship, training, and networking. Founded 3 successful social enterprises focused on women economic empowerment. Passionate about closing the gender gap in entrepreneurship.',
    location: 'Ahmedabad, India',
    skills: ['Women Empowerment', 'Entrepreneurship Coaching', 'Leadership Development', 'Business Strategy', 'Fundraising'],
    expertise: ['Gender Equality', 'Women Entrepreneurship', 'Impact Measurement', 'Advocacy', 'Change Management'],
    experience: ['Founder at WomenLeadIndia (6 years)', 'Executive Coach at Leadership Institute (5 years)', 'Business Consultant at Deloitte (4 years)'],
    education: ['Masters in Business Administration - ISB Hyderabad', 'Bachelor in Commerce - Gujarat University'],
    lookingFor: ['Corporate Partnerships for Women Programs', 'Government Collaborations', 'International Funding', 'Speaking Opportunities', 'Research Partners on Gender'],
    offering: ['Leadership Coaching', 'Entrepreneurship Curriculum', 'Women Network Access', 'Policy Advocacy Support', 'Training Program Design'],
    website: 'https://womenleadindia.org',
    linkedin: 'linkedin.com/in/natashapatel',
    cohort: '2022',
  },
  {
    email: 'carlos.oliveira@example.com',
    name: 'Carlos Oliveira',
    initials: 'CO',
    title: 'Circular Economy & Waste Management Expert',
    bio: 'Designing circular economy models and waste management solutions for India. Implemented projects across 8 states reaching 50+ municipalities. Vision: Make India a zero-waste economy.',
    location: 'Pune, India',
    skills: ['Circular Economy', 'Waste Management', 'Sustainability', 'Product Design', 'Supply Chain Optimization'],
    expertise: ['Zero Waste Solutions', 'Recycling Systems', 'Plastic Alternatives', 'Environmental Impact Assessment'],
    experience: ['Director at CircularIndia Foundation (7 years)', 'Environmental Engineer at Global Corp (5 years)', 'Sustainability Consultant at Green NGO (4 years)'],
    education: ['PhD in Environmental Engineering - IIT Bombay', 'Masters in Sustainability Management - University of Pune'],
    lookingFor: ['Manufacturing Industry Partnerships', 'Technology Integration', 'Government Contracts', 'Investment for Scaling', 'Research Collaborations on Plastics'],
    offering: ['Circular Economy Expertise', 'Waste Solution Design', 'Implementation Support', 'Policy Development', 'Training & Capacity Building'],
    website: 'https://circularindia.org',
    linkedin: 'linkedin.com/in/carlosoliveira',
    cohort: '2021',
  },
  {
    email: 'amita.bhatt@example.com',
    name: 'Amita Bhatt',
    initials: 'AB',
    title: 'Nutrition & Food Security Advocate',
    bio: 'Working on community nutrition and food security programs addressing malnutrition in rural areas. Reached 20,000+ families with nutritional interventions and dietary education.',
    location: 'Chennai, India',
    skills: ['Nutrition', 'Food Security', 'Community Health', 'Program Management', 'Research & Data Analysis'],
    expertise: ['Nutritional Science', 'Food Safety Systems', 'Community Engagement', 'Agricultural Linkages'],
    experience: ['Chief Program Officer at FoodSecure India (6 years)', 'Nutritionist at Government Hospital (5 years)', 'Research Associate at Health Institute (3 years)'],
    education: ['Masters in Public Health & Nutrition - Anna University', 'Bachelor in Nutrition Science - Chennai Institute'],
    lookingFor: ['Healthcare System Integration', 'Agricultural Partnerships', 'Research Collaborations', 'Funding for Expansion', 'Government Program Integration'],
    offering: ['Nutrition Expertise', 'Program Design', 'Community Health Training', 'Dietary Assessment Tools', 'Data Analytics Support'],
    linkedin: 'linkedin.com/in/amitabhatt',
    cohort: '2023',
  },
  {
    email: 'rohan.desai@example.com',
    name: 'Rohan Desai',
    initials: 'RD',
    title: 'Skill Development & Vocational Training Specialist',
    bio: 'Creating job-ready skills programs for youth from disadvantaged backgrounds. Placed 5000+ candidates in formal jobs with 80% retention rate. Bridging the skills gap in India.',
    location: 'Kolkata, India',
    skills: ['Skill Development', 'Vocational Training', 'Youth Employment', 'Curriculum Design', 'Job Placement'],
    expertise: ['Industry-Aligned Training', 'Job Placement Strategy', 'Apprenticeship Programs', 'Digital Skills'],
    experience: ['Founder at SkillForChange (5 years)', 'Training Director at NASSCOM Foundation (6 years)', 'HR Manager at Infosys (4 years)'],
    education: ['Masters in Education & Training - Kolkata University', 'Bachelor in Human Resources - Delhi University'],
    lookingFor: ['Industry Partnerships for Internships', 'Government Training Contracts', 'Tech Company Collaborations', 'Funding for Scale-up', 'Curriculum Development Partners'],
    offering: ['Curriculum Development', 'Job Placement Networks', 'Training Implementation', 'Assessment Tools', 'Industry Liaison Support'],
    website: 'https://skillforchange.org',
    linkedin: 'linkedin.com/in/rohandesai',
    cohort: '2022',
  },
  {
    email: 'priya.deshmukh@example.com',
    name: 'Priya Deshmukh',
    initials: 'PD',
    title: 'Climate Tech & Agricultural Innovation',
    bio: 'Leveraging climate technology to help farmers adapt to climate change and increase productivity. Developed AI-powered weather prediction and crop advisory system serving 15,000+ farmers.',
    location: 'Nashik, India',
    skills: ['Climate Technology', 'Agricultural Innovation', 'AI/ML', 'Data Science', 'Agronomy'],
    expertise: ['Weather Prediction Models', 'Crop Advisory Systems', 'Climate Adaptation', 'Precision Agriculture'],
    experience: ['Founder at ClimateAgri Tech (4 years)', 'Data Scientist at AgriTech Startup (5 years)', 'Research Fellow at ICRISAT (3 years)'],
    education: ['Masters in Agricultural Engineering - University of Agricultural Sciences', 'Bachelor in Computer Science - Pune University'],
    lookingFor: ['Government Agriculture Department Partnerships', 'Farmer Organization Networks', 'Weather Data Sources', 'Funding for Expansion', 'Technology Transfer Opportunities'],
    offering: ['Climate Tech Solutions', 'Crop Advisory Development', 'Farmer Training Programs', 'Data Science Expertise', 'Weather Integration Support'],
    website: 'https://climateagri.tech',
    github: 'github.com/priyadeshmukh',
    linkedin: 'linkedin.com/in/priyadeshmukh',
    cohort: '2022',
  },
]

async function main() {
  console.log('🌱 Seeding database with comprehensive user data...')

  // Clear existing data
  await prisma.auditLog.deleteMany({})
  await prisma.moderatedContent.deleteMany({})
  await prisma.announcement.deleteMany({})
  await prisma.subgroupMember.deleteMany({})
  await prisma.subgroup.deleteMany({})
  await prisma.resource.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.conversation.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.user.deleteMany({})

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@chevening.org',
      password: adminPassword,
      name: 'Admin User',
      initials: 'AU',
      role: UserRole.ADMIN,
      status: MemberStatus.ACTIVE,
      profile: {
        create: {
          title: 'Community Administrator',
          bio: 'Managing Chevening community',
          joinedDate: new Date('2024-01-01'),
          cohort: '2024',
        },
      },
    },
    include: { profile: true },
  })

  console.log('✅ Created admin user:', admin.email)

  const createdMembers = []
  for (const memberData of memberDataList) {
    const password = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: memberData.email,
        password,
        name: memberData.name,
        initials: memberData.initials,
        role: UserRole.MEMBER,
        status: MemberStatus.ACTIVE,
        location: memberData.location,
        bio: memberData.bio,
        profile: {
          create: {
            title: memberData.title,
            bio: memberData.bio,
            skills: JSON.stringify(memberData.skills),
            expertise: JSON.stringify(memberData.expertise),
            experience: JSON.stringify(memberData.experience),
            education: JSON.stringify(memberData.education),
            lookingFor: JSON.stringify(memberData.lookingFor),
            offering: JSON.stringify(memberData.offering),
            website: memberData.website,
            linkedin: memberData.linkedin,
            twitter: memberData.twitter,
            github: memberData.github,
            joinedDate: new Date('2024-01-15'),
            cohort: memberData.cohort,
          },
        },
      },
      include: { profile: true },
    })
    createdMembers.push(user)
    console.log(`✅ Created member: ${user.email} (${user.name})`)
  }
  
  console.log(`\n✅ Total members created: ${createdMembers.length}`)

  console.log(`\n✅ Total members created: ${createdMembers.length}`)

  // Create diverse sample posts from various members
  const posts = [
    {
      authorId: createdMembers[0].id,
      content:
        'Just finished an incredible mentoring session with some amazing young entrepreneurs. The energy and passion they bring is truly inspiring! 🚀',
      tags: JSON.stringify(['mentoring', 'entrepreneurship']),
      category: 'discussion',
    },
    {
      authorId: createdMembers[1].id,
      content:
        'Excited to announce our new initiative reaching 500+ children across 15 villages! Thanks to this amazing community! 🙏',
      tags: JSON.stringify(['education', 'impact']),
      category: 'announcement',
    },
    {
      authorId: createdMembers[2].id,
      content:
        'Sharing insights from our sustainable farming workshop. Join us next week to learn more!',
      tags: JSON.stringify(['agriculture', 'sustainability']),
      category: 'resource',
    },
    {
      authorId: createdMembers[3].id,
      content:
        'The renewable energy transition is happening faster than ever. Excited to be part of this movement! ⚡',
      tags: JSON.stringify(['renewable energy', 'climate action']),
      category: 'discussion',
    },
    {
      authorId: createdMembers[4].id,
      content:
        'Healthcare innovation should be accessible to all. Check out our latest telemedicine platform for rural areas.',
      tags: JSON.stringify(['healthcare', 'technology', 'innovation']),
      category: 'resource',
    },
    {
      authorId: createdMembers[5].id,
      content:
        'EdTech is transforming education! Our platform is now used by 5000+ students across India. 📚',
      tags: JSON.stringify(['edtech', 'education']),
      category: 'announcement',
    },
    {
      authorId: createdMembers[6].id,
      content:
        'Just completed a conservation project in the Western Ghats. The biodiversity here is incredible! 🌿',
      tags: JSON.stringify(['conservation', 'environment']),
      category: 'discussion',
    },
    {
      authorId: createdMembers[7].id,
      content:
        'Women empowerment through financial inclusion is changing lives! Happy to share our success stories.',
      tags: JSON.stringify(['women empowerment', 'financial inclusion']),
      category: 'resource',
    },
    {
      authorId: createdMembers[8].id,
      content:
        'Fintech for social good: Making digital payments accessible to underbanked communities. 💰',
      tags: JSON.stringify(['fintech', 'financial inclusion', 'technology']),
      category: 'discussion',
    },
    {
      authorId: createdMembers[9].id,
      content:
        'Our sustainable fashion brand just got certified as B-Corp! Great milestone for ethical business. ✨',
      tags: JSON.stringify(['sustainable fashion', 'social enterprise']),
      category: 'announcement',
    },
    {
      authorId: createdMembers[10].id,
      content:
        'Smart cities need sustainable urban development. Working on integrating green spaces across 20+ cities.',
      tags: JSON.stringify(['urban development', 'sustainability']),
      category: 'discussion',
    },
    {
      authorId: createdMembers[11].id,
      content:
        'Healthcare policy that works for everyone - advocating for inclusive healthcare access nationwide.',
      tags: JSON.stringify(['healthcare policy', 'advocacy']),
      category: 'resource',
    },
  ]

  for (const postData of posts) {
    await prisma.post.create({
      data: postData,
    })
  }
  console.log(`✅ Created ${posts.length} sample posts`)

  console.log(`✅ Created ${posts.length} sample posts`)

  // Create comprehensive sample resources
  const resources = [
    {
      title: 'Sustainable Development Goals Guide',
      description: 'Comprehensive guide to SDGs for social entrepreneurs and impact makers',
      type: 'pdf',
      category: 'education',
      url: 'https://example.com/sdg-guide.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['SDG', 'education', 'guide', 'sustainability']),
    },
    {
      title: 'Fundraising Best Practices',
      description: 'Learn proven fundraising strategies from successful social enterprises',
      type: 'article',
      category: 'finance',
      url: 'https://example.com/fundraising',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['fundraising', 'finance', 'startup', 'resources']),
    },
    {
      title: 'Impact Measurement Framework',
      description: 'Comprehensive framework for measuring social impact of your initiatives',
      type: 'document',
      category: 'impact',
      url: 'https://example.com/impact-framework.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['impact measurement', 'evaluation', 'framework']),
    },
    {
      title: 'EdTech Implementation Guide',
      description: 'Step-by-step guide to implementing educational technology in schools',
      type: 'article',
      category: 'education',
      url: 'https://example.com/edtech-guide',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['edtech', 'education', 'implementation', 'guide']),
    },
    {
      title: 'Sustainable Agriculture Handbook',
      description: 'Practical handbook for sustainable and organic farming practices',
      type: 'pdf',
      category: 'agriculture',
      url: 'https://example.com/sustainable-ag.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['agriculture', 'sustainability', 'organic farming']),
    },
    {
      title: 'Digital Marketing for NGOs',
      description: 'Social media and digital marketing strategies for nonprofits',
      type: 'video',
      category: 'marketing',
      url: 'https://example.com/digital-marketing-ngo',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['marketing', 'digital', 'social media', 'ngo']),
    },
    {
      title: 'Community Engagement Toolkit',
      description: 'Comprehensive toolkit for effective community engagement and participation',
      type: 'document',
      category: 'community',
      url: 'https://example.com/community-toolkit.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['community engagement', 'participation', 'toolkit']),
    },
    {
      title: 'Renewable Energy Systems Guide',
      description: 'Technical guide for implementing renewable energy solutions',
      type: 'pdf',
      category: 'energy',
      url: 'https://example.com/renewable-energy-guide.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['renewable energy', 'solar', 'energy systems']),
    },
    {
      title: 'Inclusive Design Principles',
      description: 'Guide to designing inclusive products and services for all',
      type: 'article',
      category: 'design',
      url: 'https://example.com/inclusive-design',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['inclusive design', 'accessibility', 'design']),
    },
    {
      title: 'Policy Advocacy Handbook',
      description: 'Practical handbook for advocacy and policy change initiatives',
      type: 'pdf',
      category: 'policy',
      url: 'https://example.com/policy-handbook.pdf',
      accessLevel: 'MEMBERS_ONLY' as const,
      uploadedById: admin.id,
      tags: JSON.stringify(['policy', 'advocacy', 'government relations']),
    },
  ]

  for (const resourceData of resources) {
    await prisma.resource.create({
      data: resourceData,
    })
  }
  console.log(`✅ Created ${resources.length} sample resources`)

  console.log(`✅ Created ${resources.length} sample resources`)

  // Create comprehensive subgroups
  const subgroups = [
    {
      name: 'Tech Innovators',
      description: 'For members interested in technology and innovation for social impact',
      type: 'interest',
      color: '#3B82F6',
    },
    {
      name: 'Social Impact',
      description: 'Focused on social impact and sustainable development initiatives',
      type: 'interest',
      color: '#10B981',
    },
    {
      name: 'Mumbai Chapter',
      description: 'Members based in Mumbai and surrounding areas',
      type: 'location',
      color: '#F59E0B',
    },
    {
      name: 'Delhi Chapter',
      description: 'Members based in Delhi and NCR region',
      type: 'location',
      color: '#EF4444',
    },
    {
      name: 'Bangalore Chapter',
      description: 'Members based in Bangalore and Karnataka',
      type: 'location',
      color: '#8B5CF6',
    },
    {
      name: 'Entrepreneurship & Startups',
      description: 'For startup founders, entrepreneurs, and those interested in business',
      type: 'interest',
      color: '#EC4899',
    },
    {
      name: 'Education & Learning',
      description: 'Focused on education, EdTech, and skill development initiatives',
      type: 'interest',
      color: '#06B6D4',
    },
    {
      name: 'Sustainability & Environment',
      description: 'For climate action, environmental conservation, and green initiatives',
      type: 'interest',
      color: '#14B8A6',
    },
    {
      name: 'Healthcare & Wellness',
      description: 'Focused on healthcare innovation, public health, and wellness',
      type: 'interest',
      color: '#F97316',
    },
    {
      name: 'Women Empowerment',
      description: 'Working on gender equality and women-focused social impact',
      type: 'interest',
      color: '#D946EF',
    },
    {
      name: 'Chevening 2024',
      description: 'Members from Chevening cohort 2024',
      type: 'cohort',
      color: '#3B82F6',
    },
    {
      name: 'Chevening 2023',
      description: 'Members from Chevening cohort 2023',
      type: 'cohort',
      color: '#06B6D4',
    },
    {
      name: 'Chevening 2022',
      description: 'Members from Chevening cohort 2022',
      type: 'cohort',
      color: '#10B981',
    },
  ]

  const createdSubgroups = []
  for (const subgroupData of subgroups) {
    const subgroup = await prisma.subgroup.create({
      data: subgroupData,
    })
    createdSubgroups.push(subgroup)
  }
  console.log(`✅ Created ${createdSubgroups.length} subgroups`)

  console.log(`✅ Created ${createdSubgroups.length} subgroups`)

  // Add members to subgroups intelligently based on their profiles
  let subgroupMembershipsCount = 0
  
  // Define member interests based on their roles (using Record type)
  const memberInterests: Record<number, number[]> = {
    0: [0, 1, 5], // Jane - Tech, Social Impact, Entrepreneurship
    1: [0, 1, 5], // Rahul - Tech, Social Impact, Entrepreneurship
    2: [1, 6, 7], // Anjali - Social Impact, Education, Sustainability
    3: [1, 7, 8], // Sanjay - Social Impact, Sustainability, Healthcare
    4: [0, 8, 9], // Meera - Tech, Healthcare, Women
    5: [0, 6, 9], // Priya - Tech, Education, Women
    6: [1, 7], // Vikram - Social Impact, Sustainability
    7: [9, 1], // Neha - Women, Social Impact
    8: [0, 1, 5], // Arjun - Tech, Social Impact, Entrepreneurship
    9: [1, 5, 9], // Deepa - Social Impact, Entrepreneurship, Women
    10: [1, 7], // Rohan - Social Impact, Sustainability
    11: [8], // Divya - Healthcare
    12: [1, 7], // Sameer - Social Impact, Sustainability
    13: [8, 9], // Ritika - Healthcare, Women
    14: [7], // Nikhil - Sustainability
    15: [0, 9], // Pooja - Tech, Women
    16: [0, 6], // Aditya - Tech, Education
    17: [1, 5], // Sneha - Social Impact, Entrepreneurship
    18: [6], // Vikash - Education
    19: [1, 9], // Anjum - Social Impact, Women
    20: [1, 7], // Ravi - Social Impact, Sustainability
    21: [1, 9], // Tara - Social Impact, Women
    22: [1, 5], // Harsh - Social Impact, Entrepreneurship
    23: [8, 9], // Malini - Healthcare, Women
    24: [0, 7], // Ashok - Tech, Sustainability
    25: [6, 8], // Deepika - Education, Healthcare
    26: [6, 9], // Sanjiv - Education, Women
    27: [0, 6, 9], // Kavya - Tech, Education, Women
    28: [1, 5, 8], // Manish - Social Impact, Entrepreneurship, Healthcare
    29: [0, 6], // Swati - Tech, Education
    30: [1, 5], // Raj - Social Impact, Entrepreneurship
    31: [1, 7], // Nisha - Social Impact, Sustainability
    32: [1, 5], // Suresh - Social Impact, Entrepreneurship
    33: [0, 1], // Isha - Tech, Social Impact
    34: [0, 1], // Vikram - Tech, Social Impact
    35: [1, 7], // Priyanka - Social Impact, Sustainability
    36: [1, 8], // Arun - Social Impact, Healthcare
    37: [1, 5], // More members
    38: [0, 1],
    39: [1, 7],
  }
  
  // Add members to interest-based subgroups
  for (let i = 0; i < createdMembers.length; i++) {
    const interests = memberInterests[i] || [1] // Default to Social Impact
    for (const interestIndex of interests) {
      if (interestIndex < 10) { // First 10 subgroups are interests
        await prisma.subgroupMember.create({
          data: {
            subgroupId: createdSubgroups[interestIndex].id,
            userId: createdMembers[i].id,
          },
        })
        subgroupMembershipsCount++
      }
    }
    
    // Add to cohort subgroup based on their cohort year
    const cohortYear = createdMembers[i].profile?.cohort || '2024'
    let cohortSubgroupIndex = 10 // Default to 2024
    if (cohortYear === '2023') cohortSubgroupIndex = 11
    if (cohortYear === '2022') cohortSubgroupIndex = 12
    if (cohortYear === '2021') cohortSubgroupIndex = 10 // Mix with 2024 for variety
    if (cohortYear === '2020') cohortSubgroupIndex = 11
    if (cohortYear === '2019') cohortSubgroupIndex = 12
    
    await prisma.subgroupMember.create({
      data: {
        subgroupId: createdSubgroups[cohortSubgroupIndex].id,
        userId: createdMembers[i].id,
      },
    })
    subgroupMembershipsCount++
  }
  
  console.log(`✅ Added ${subgroupMembershipsCount} subgroup memberships`)

  console.log(`✅ Added ${subgroupMembershipsCount} subgroup memberships`)

  // Create comprehensive announcements with proper enum values
  const announcements = [
    {
      title: 'Welcome to Chevening Community!',
      content:
        'Welcome to the Chevening online community platform. This is your space to connect, collaborate, and grow together. Feel free to share your projects, seek mentorship, and build meaningful relationships with fellow change-makers.',
      priority: 'NORMAL' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Monthly Networking Event - December',
      content:
        'Join us for our monthly networking event on December 20th at 3 PM IST. This month we\'re focusing on sustainable innovation. Register now to meet fellow changemakers and explore collaboration opportunities!',
      priority: 'HIGH' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'New Resource Library Launched',
      content:
        'We\'ve launched a comprehensive resource library with guides, case studies, and templates for social enterprises. Access guides on fundraising, impact measurement, digital marketing, and more. All resources are available to members.',
      priority: 'NORMAL' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Mentorship Program Registration Open',
      content:
        'Our structured mentorship program is now open for registration! Connect with experienced changemakers in your field of interest. Applications close on December 31st. Apply now to get matched with a mentor.',
      priority: 'HIGH' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Impact Measurement Workshop - Free for Members',
      content:
        'Learn to measure and communicate the impact of your social initiatives. Join our free workshop on January 15th featuring industry experts. Limited seats available - register early!',
      priority: 'NORMAL' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Featured Project Spotlight: Tech for Rural Education',
      content:
        'This month we\'re featuring the EdTech initiative bringing quality education to rural areas. Read about how technology is transforming learning outcomes. Inspiring work by our community members!',
      priority: 'NORMAL' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Funding Opportunities - Apply Now',
      content:
        'Multiple funding opportunities are available for social impact projects. From early-stage ideas to scaling ventures, check out the latest grants and investments opportunities in our resources section.',
      priority: 'HIGH' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'Community Guidelines Updated',
      content:
        'We\'ve updated our community guidelines to ensure a respectful and inclusive space for all members. Please review the guidelines to understand expectations for collaboration and communication.',
      priority: 'NORMAL' as const,
      status: 'PUBLISHED' as const,
      createdById: admin.id,
      publishedAt: new Date(),
    },
  ]

  for (const announcementData of announcements) {
    await prisma.announcement.create({
      data: announcementData,
    })
  }
  console.log(`✅ Created ${announcements.length} announcements`)

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🌱 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🌱         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ Summary of Created Content:                                   ║
║ • Admin Users: 1                                              ║
║ • Community Members: ${createdMembers.length}                              ║
║ • Subgroups: ${createdSubgroups.length}                                    ║
║ • Subgroup Memberships: ${subgroupMembershipsCount}                          ║
║ • Sample Posts: ${posts.length}                                       ║
║ • Resources: ${resources.length}                                      ║
║ • Announcements: ${announcements.length}                                 ║
║                                                                ║
║ You can now log in with:                                      ║
║ • Admin: admin@chevening.org / admin123                      ║
║ • Members: Use any of the created user emails                 ║
║            Password: password123                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
