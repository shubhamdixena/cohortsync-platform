import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Load environment variables from .env.local
try {
  require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })
} catch (error) {
  console.log('dotenv not found, using process.env directly')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not defined in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ Supabase key is not defined in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const seedUsers = [
  {
    id: '1',
    email: 'rahul.kumar@example.com',
    name: 'Rahul Kumar',
    initials: 'RK',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'anjali.patel@example.com',
    name: 'Anjali Patel',
    initials: 'AP',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    location: 'Delhi, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'sanjay.mehta@example.com',
    name: 'Sanjay Mehta',
    initials: 'SM',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    location: 'Pune, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'meera.gupta@example.com',
    name: 'Meera Gupta',
    initials: 'MG',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    location: 'Bangalore, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'vikram.singh@example.com',
    name: 'Vikram Singh',
    initials: 'VS',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    location: 'Jaipur, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    initials: 'PS',
    password: 'managed_by_supabase_auth',
    role: 'MEMBER',
    status: 'ACTIVE',
    location: 'Chennai, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    email: 'admin@example.com',
    name: 'Admin User',
    initials: 'AU',
    password: 'managed_by_supabase_auth',
    role: 'ADMIN',
    status: 'ACTIVE',
    location: 'Mumbai, India',
    updated_at: new Date().toISOString(),
  },
]

const seedProfiles = [
  {
    id: randomUUID(),
    user_id: '1',
    title: 'Tech Entrepreneur',
    cohort: 'Jagriti Yatra 2022',
    bio: 'Passionate about technology and social impact',
    linkedin: 'https://linkedin.com/in/rahulkumar',
    expertise: JSON.stringify(['Technology', 'Entrepreneurship']),
    skills: JSON.stringify(['JavaScript', 'Product Management']),
    looking_for: JSON.stringify(['Mentorship', 'Funding']),
    offering: JSON.stringify(['Tech Guidance', 'Networking']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '2',
    title: 'Social Impact Consultant',
    cohort: 'Jagriti Yatra 2021',
    bio: 'Working on rural education initiatives',
    linkedin: 'https://linkedin.com/in/anjalipatel',
    expertise: JSON.stringify(['Education', 'Rural Development']),
    skills: JSON.stringify(['Project Management', 'Community Building']),
    looking_for: JSON.stringify(['Partnerships', 'Volunteers']),
    offering: JSON.stringify(['Training', 'Consultation']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '3',
    title: 'Sustainable Agriculture Expert',
    cohort: 'Jagriti Yatra 2020',
    bio: 'Promoting sustainable farming practices',
    linkedin: 'https://linkedin.com/in/sanjaymehta',
    expertise: JSON.stringify(['Agriculture', 'Sustainability']),
    skills: JSON.stringify(['Organic Farming', 'Training']),
    looking_for: JSON.stringify(['Scale', 'Resources']),
    offering: JSON.stringify(['Workshops', 'Consulting']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '4',
    title: 'Healthcare Innovation',
    cohort: 'Jagriti Yatra 2022',
    bio: 'Building telemedicine solutions for rural areas',
    linkedin: 'https://linkedin.com/in/meeragupta',
    expertise: JSON.stringify(['Healthcare', 'Technology']),
    skills: JSON.stringify(['Healthcare Tech', 'Product Design']),
    looking_for: JSON.stringify(['Collaborators', 'Funding']),
    offering: JSON.stringify(['Healthcare Expertise', 'Tech Support']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '5',
    title: 'Social Entrepreneur',
    cohort: 'Jagriti Yatra 2021',
    bio: 'Creating employment opportunities in rural India',
    linkedin: 'https://linkedin.com/in/vikramsingh',
    expertise: JSON.stringify(['Employment', 'Rural Development']),
    skills: JSON.stringify(['Business Development', 'Strategy']),
    looking_for: JSON.stringify(['Partners', 'Investors']),
    offering: JSON.stringify(['Mentorship', 'Business Guidance']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '6',
    title: 'Education Technology',
    cohort: 'Jagriti Yatra 2022',
    bio: 'Building digital learning platforms',
    linkedin: 'https://linkedin.com/in/priyasharma',
    expertise: JSON.stringify(['Education', 'Technology']),
    skills: JSON.stringify(['EdTech', 'UX Design']),
    looking_for: JSON.stringify(['Co-founders', 'Advisors']),
    offering: JSON.stringify(['Tech Expertise', 'Design Help']),
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: '7',
    title: 'Community Administrator',
    cohort: 'Staff',
    bio: 'Managing the community platform',
    expertise: JSON.stringify(['Community Management', 'Operations']),
    skills: JSON.stringify(['Administration', 'Coordination']),
    looking_for: JSON.stringify([]),
    offering: JSON.stringify(['Support', 'Guidance']),
    updated_at: new Date().toISOString(),
  },
]

const seedPosts = [
  {
    id: randomUUID(),
    author_id: '1',
    content: 'Just finished an incredible mentoring session with some amazing young entrepreneurs. The energy and passion they bring to solving real-world problems is truly inspiring! 🚀',
    category: 'discussion',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    author_id: '2',
    content: 'Excited to share that our rural education initiative has reached 500+ children across 15 villages! This wouldn\'t have been possible without the incredible support from the Jagriti community. Thank you all! 🙏',
    category: 'achievement',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    author_id: '3',
    content: 'Sharing some insights from our recent workshop on sustainable farming practices. The response from local farmers has been overwhelming! Here are the key takeaways: 1) Organic composting can increase yield by 30% 2) Water conservation techniques can reduce usage by 40% 3) Crop rotation improves soil health significantly',
    category: 'discussion',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    author_id: '4',
    content: 'Looking for collaborators on a new telemedicine project aimed at providing healthcare access to remote areas. If you\'re working in healthcare tech or have experience with rural communities, let\'s connect!',
    category: 'opportunity',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    author_id: '5',
    content: 'Attending an amazing conference on social entrepreneurship this week in Delhi! Would love to meet fellow Jagriti community members. Coffee anyone? ☕',
    category: 'event',
    updated_at: new Date().toISOString(),
  },
]

const seedResources = [
  {
    id: randomUUID(),
    title: 'Complete Guide to Social Impact Measurement',
    description: 'A comprehensive guide on measuring and reporting social impact for your organization',
    category: 'business',
    type: 'document',
    url: 'https://example.com/impact-guide.pdf',
    uploaded_by_id: '2',
    tags: JSON.stringify(['impact', 'measurement', 'reporting']),
    access_level: 'MEMBERS_ONLY',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: 'Fundraising Strategy Template',
    description: 'Template and best practices for creating an effective fundraising strategy',
    category: 'business',
    type: 'document',
    url: 'https://example.com/fundraising-template.xlsx',
    uploaded_by_id: '1',
    tags: JSON.stringify(['fundraising', 'strategy', 'template']),
    access_level: 'MEMBERS_ONLY',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: 'Introduction to Sustainable Agriculture',
    description: 'Video series covering basics of sustainable farming practices',
    category: 'technology',
    type: 'video',
    url: 'https://example.com/agriculture-course',
    uploaded_by_id: '3',
    tags: JSON.stringify(['agriculture', 'sustainability', 'training']),
    access_level: 'MEMBERS_ONLY',
    updated_at: new Date().toISOString(),
  },
]

const seedAnnouncements = [
  {
    id: randomUUID(),
    title: 'Welcome to CohortSync!',
    content: 'Welcome to our community platform. We\'re excited to have you here. This is a space to connect, collaborate, and grow together.',
    priority: 'HIGH',
    status: 'PUBLISHED',
    created_by_id: '7',
    updated_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: 'New Resource Library Available',
    content: 'We\'ve launched our resource library with guides, templates, and learning materials. Check it out in the Resources section!',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    created_by_id: '7',
    updated_at: new Date().toISOString(),
  },
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed Users
    console.log('👥 Seeding users...')
    const { error: usersError } = await supabase
      .from('users')
      .upsert(seedUsers, { onConflict: 'id' })

    if (usersError) {
      console.error('Error seeding users:', usersError)
    } else {
      console.log('✅ Users seeded successfully')
    }

    // Seed Profiles
    console.log('📋 Seeding profiles...')
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(seedProfiles, { onConflict: 'user_id' })

    if (profilesError) {
      console.error('Error seeding profiles:', profilesError)
    } else {
      console.log('✅ Profiles seeded successfully')
    }

    // Seed Posts
    console.log('📝 Seeding posts...')
    const { error: postsError } = await supabase
      .from('posts')
      .insert(seedPosts)

    if (postsError && postsError.code !== '23505') { // Ignore duplicate key errors
      console.error('Error seeding posts:', postsError)
    } else {
      console.log('✅ Posts seeded successfully')
    }

    // Seed Resources
    console.log('📚 Seeding resources...')
    const { error: resourcesError } = await supabase
      .from('resources')
      .insert(seedResources)

    if (resourcesError && resourcesError.code !== '23505') {
      console.error('Error seeding resources:', resourcesError)
    } else {
      console.log('✅ Resources seeded successfully')
    }

    // Seed Announcements
    console.log('📢 Seeding announcements...')
    const { error: announcementsError } = await supabase
      .from('announcements')
      .insert(seedAnnouncements)

    if (announcementsError && announcementsError.code !== '23505') {
      console.error('Error seeding announcements:', announcementsError)
    } else {
      console.log('✅ Announcements seeded successfully')
    }

    console.log('🎉 Database seeding completed!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

seedDatabase()
