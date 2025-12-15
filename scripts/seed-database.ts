import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Read from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not defined in environment')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is not defined in environment')
  console.error('   Please add one of these keys to your .env file')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Default password for all test users
const DEFAULT_PASSWORD = 'TestPass123!'

// User definitions - auth users will be created from these
const userDefinitions = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    initials: 'AU',
    role: 'ADMIN' as const,
    status: 'ACTIVE' as const,
    location: 'Mumbai, India',
    bio: 'Platform administrator',
  },
  {
    email: 'rahul.kumar@example.com',
    name: 'Rahul Kumar',
    initials: 'RK',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Bangalore, India',
    bio: 'Tech entrepreneur passionate about using technology for social impact',
  },
  {
    email: 'anjali.patel@example.com',
    name: 'Anjali Patel',
    initials: 'AP',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Delhi, India',
    bio: 'Social impact consultant working on rural education initiatives',
  },
  {
    email: 'sanjay.mehta@example.com',
    name: 'Sanjay Mehta',
    initials: 'SM',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Pune, India',
    bio: 'Sustainable agriculture expert promoting organic farming practices',
  },
  {
    email: 'meera.gupta@example.com',
    name: 'Meera Gupta',
    initials: 'MG',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Hyderabad, India',
    bio: 'Healthcare innovation specialist building telemedicine solutions for rural areas',
  },
  {
    email: 'vikram.singh@example.com',
    name: 'Vikram Singh',
    initials: 'VS',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Jaipur, India',
    bio: 'Social entrepreneur creating employment opportunities in rural India',
  },
  {
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Chennai, India',
    bio: 'EdTech founder building digital learning platforms for underserved communities',
  },
  {
    email: 'amit.verma@example.com',
    name: 'Amit Verma',
    initials: 'AV',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Kolkata, India',
    bio: 'Clean energy advocate working on solar solutions for rural electrification',
  },
  {
    email: 'sneha.roy@example.com',
    name: 'Sneha Roy',
    initials: 'SR',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Ahmedabad, India',
    bio: 'Microfinance specialist empowering women entrepreneurs',
  },
  {
    email: 'karthik.reddy@example.com',
    name: 'Karthik Reddy',
    initials: 'KR',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Visakhapatnam, India',
    bio: 'Water conservation expert implementing rainwater harvesting systems',
  },
  {
    email: 'neha.kapoor@example.com',
    name: 'Neha Kapoor',
    initials: 'NK',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Lucknow, India',
    bio: 'Skill development trainer focusing on youth employability',
  },
  {
    email: 'rohan.desai@example.com',
    name: 'Rohan Desai',
    initials: 'RD',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    location: 'Surat, India',
    bio: 'Textile industry innovator promoting sustainable fashion',
  },
]

// Helper function to create or get existing auth user
async function createAuthUser(email: string, name: string, password: string) {
  try {
    // Try to create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    })

    if (error) {
      // If user already exists, try to list users and find this one
      if (error.message.includes('already registered')) {
        console.log(`  ⚠️  User ${email} already exists, fetching existing user...`)
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

        if (listError) throw listError

        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
          return existingUser.id
        }
      }
      throw error
    }

    return data.user.id
  } catch (error) {
    console.error(`  ❌ Error creating auth user ${email}:`, error)
    throw error
  }
}

async function seedDatabase() {
  console.log('🌱 Starting comprehensive database seeding...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using service role key for admin operations\n`)

  const userIdMap: Record<string, string> = {}

  try {
    // Step 1: Create Auth Users
    console.log('👤 Creating Supabase Auth users...')
    for (const userDef of userDefinitions) {
      try {
        const userId = await createAuthUser(userDef.email, userDef.name, DEFAULT_PASSWORD)
        userIdMap[userDef.email] = userId
        console.log(`  ✅ ${userDef.name} (${userDef.email}) -> ${userId}`)
      } catch (error) {
        console.error(`  ❌ Failed to create ${userDef.email}`)
        throw error
      }
    }
    console.log(`✅ Created ${Object.keys(userIdMap).length} auth users\n`)

    // Step 2: Insert into public.users table
    console.log('👥 Inserting users into public.users table...')
    const usersData = userDefinitions.map(userDef => ({
      id: userIdMap[userDef.email],
      email: userDef.email,
      name: userDef.name,
      initials: userDef.initials,
      role: userDef.role,
      status: userDef.status,
      location: userDef.location,
      bio: userDef.bio,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error: usersError } = await supabase
      .from('users')
      .upsert(usersData, { onConflict: 'id' })

    if (usersError) throw usersError
    console.log(`✅ Inserted ${usersData.length} users\n`)

    // Step 3: Create profiles
    console.log('📋 Creating user profiles...')
    const profilesData = userDefinitions.map(userDef => {
      const userId = userIdMap[userDef.email]
      const cohorts = ['Jagriti Yatra 2020', 'Jagriti Yatra 2021', 'Jagriti Yatra 2022', 'Jagriti Yatra 2023']
      const cohort = userDef.role === 'ADMIN' ? 'Staff' : cohorts[Math.floor(Math.random() * cohorts.length)]

      return {
        id: randomUUID(),
        user_id: userId,
        title: getTitle(userDef.name),
        bio: userDef.bio,
        cohort,
        linkedin: `https://linkedin.com/in/${userDef.name.toLowerCase().replace(' ', '')}`,
        expertise: JSON.stringify(getExpertise(userDef.bio)),
        skills: JSON.stringify(getSkills(userDef.bio)),
        looking_for: JSON.stringify(['Mentorship', 'Collaboration', 'Funding']),
        offering: JSON.stringify(['Expertise', 'Network', 'Guidance']),
        joined_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(profilesData, { onConflict: 'user_id' })

    if (profilesError) throw profilesError
    console.log(`✅ Created ${profilesData.length} profiles\n`)

    // Step 4: Create subgroups
    console.log('🏘️  Creating subgroups...')
    const subgroupsData = [
      {
        id: randomUUID(),
        name: 'Tech Entrepreneurs',
        description: 'Community of technology entrepreneurs building innovative solutions',
        type: 'interest',
        category: 'Technology',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: 'Social Impact Leaders',
        description: 'Leaders working on social impact projects across India',
        type: 'interest',
        category: 'Social Impact',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: 'Sustainable Agriculture',
        description: 'Experts and practitioners in sustainable farming',
        type: 'interest',
        category: 'Agriculture',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: 'Bangalore Chapter',
        description: 'Members based in Bangalore',
        type: 'location',
        category: 'Regional',
        location: 'Bangalore, India',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        name: 'Delhi Chapter',
        description: 'Members based in Delhi NCR',
        type: 'location',
        category: 'Regional',
        location: 'Delhi, India',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const { error: subgroupsError } = await supabase
      .from('subgroups')
      .insert(subgroupsData)

    if (subgroupsError && subgroupsError.code !== '23505') throw subgroupsError
    console.log(`✅ Created ${subgroupsData.length} subgroups\n`)

    // Step 5: Add subgroup members
    console.log('👫 Adding subgroup members...')
    const subgroupMembersData = []
    const userIds = Object.values(userIdMap)

    for (const subgroup of subgroupsData) {
      // Add random members to each subgroup
      const memberCount = 3 + Math.floor(Math.random() * 5)
      const selectedUsers = userIds.sort(() => 0.5 - Math.random()).slice(0, memberCount)

      for (const userId of selectedUsers) {
        subgroupMembersData.push({
          id: randomUUID(),
          subgroup_id: subgroup.id,
          user_id: userId,
          role: 'MEMBER',
          joined_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }
    }

    const { error: membersError } = await supabase
      .from('subgroup_members')
      .insert(subgroupMembersData)

    if (membersError && membersError.code !== '23505') throw membersError
    console.log(`✅ Added ${subgroupMembersData.length} subgroup memberships\n`)

    // Step 6: Create posts
    console.log('📝 Creating posts...')
    const postsData = generatePosts(userIdMap)

    const { error: postsError } = await supabase
      .from('posts')
      .insert(postsData)

    if (postsError && postsError.code !== '23505') throw postsError
    console.log(`✅ Created ${postsData.length} posts\n`)

    // Step 7: Create comments
    console.log('💬 Creating comments...')
    const { data: posts } = await supabase.from('posts').select('id, author_id')
    if (posts && posts.length > 0) {
      const commentsData = generateComments(posts, userIdMap)

      const { error: commentsError } = await supabase
        .from('comments')
        .insert(commentsData)

      if (commentsError && commentsError.code !== '23505') throw commentsError
      console.log(`✅ Created ${commentsData.length} comments\n`)
    }

    // Step 8: Create resources
    console.log('📚 Creating resources...')
    const resourcesData = generateResources(userIdMap)

    const { error: resourcesError } = await supabase
      .from('resources')
      .insert(resourcesData)

    if (resourcesError && resourcesError.code !== '23505') throw resourcesError
    console.log(`✅ Created ${resourcesData.length} resources\n`)

    // Step 9: Create announcements
    console.log('📢 Creating announcements...')
    const adminId = userIdMap['admin@example.com']
    const announcementsData = [
      {
        id: randomUUID(),
        title: 'Welcome to CohortSync!',
        content: 'Welcome to our community platform. Connect, collaborate, and grow together with fellow changemakers across India.',
        priority: 'HIGH',
        status: 'PUBLISHED',
        created_by_id: adminId,
        published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: randomUUID(),
        title: 'New Resource Library Available',
        content: 'We have launched our resource library with guides, templates, and learning materials. Check it out in the Resources section!',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        created_by_id: adminId,
        published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: randomUUID(),
        title: 'Monthly Meetup - Bangalore',
        content: 'Join us for our monthly meetup in Bangalore on the 15th. Network with fellow entrepreneurs and share your journey!',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        category: 'Events',
        created_by_id: adminId,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { error: announcementsError } = await supabase
      .from('announcements')
      .insert(announcementsData)

    if (announcementsError && announcementsError.code !== '23505') throw announcementsError
    console.log(`✅ Created ${announcementsData.length} announcements\n`)

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Database seeding completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('📊 Summary:')
    console.log(`   👤 Auth Users: ${Object.keys(userIdMap).length}`)
    console.log(`   👥 Public Users: ${usersData.length}`)
    console.log(`   📋 Profiles: ${profilesData.length}`)
    console.log(`   🏘️  Subgroups: ${subgroupsData.length}`)
    console.log(`   👫 Subgroup Members: ${subgroupMembersData.length}`)
    console.log(`   📝 Posts: ${postsData.length}`)
    console.log(`   📚 Resources: ${resourcesData.length}`)
    console.log(`   📢 Announcements: ${announcementsData.length}\n`)
    console.log('🔐 Test User Credentials:')
    console.log(`   Email: Any user email from the list`)
    console.log(`   Password: ${DEFAULT_PASSWORD}\n`)
    console.log('💡 You can now log in with any of these emails:')
    userDefinitions.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`)
    })
    console.log('')

  } catch (error) {
    console.error('\n❌ Error during seeding:', error)
    process.exit(1)
  }
}

// Helper functions for generating realistic data
function getTitle(name: string): string {
  const titles = [
    'Social Entrepreneur',
    'Tech Innovator',
    'Community Leader',
    'Impact Consultant',
    'Product Manager',
    'Software Engineer',
    'Business Developer',
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

function getExpertise(bio: string): string[] {
  const keywords = bio.toLowerCase()
  const expertise = []

  if (keywords.includes('tech') || keywords.includes('technology')) expertise.push('Technology')
  if (keywords.includes('social') || keywords.includes('impact')) expertise.push('Social Impact')
  if (keywords.includes('education')) expertise.push('Education')
  if (keywords.includes('healthcare') || keywords.includes('health')) expertise.push('Healthcare')
  if (keywords.includes('agriculture') || keywords.includes('farming')) expertise.push('Agriculture')
  if (keywords.includes('entrepreneur')) expertise.push('Entrepreneurship')
  if (keywords.includes('sustainable') || keywords.includes('sustainability')) expertise.push('Sustainability')

  return expertise.length > 0 ? expertise : ['Business', 'Strategy']
}

function getSkills(bio: string): string[] {
  const keywords = bio.toLowerCase()
  const skills = []

  if (keywords.includes('tech') || keywords.includes('digital')) skills.push('Technology', 'Digital Tools')
  if (keywords.includes('education')) skills.push('Training', 'Curriculum Design')
  if (keywords.includes('business') || keywords.includes('entrepreneur')) skills.push('Business Strategy', 'Operations')
  if (keywords.includes('product')) skills.push('Product Management', 'UX Design')

  return skills.length > 0 ? skills : ['Communication', 'Leadership']
}

function generatePosts(userIdMap: Record<string, string>) {
  const emails = Object.keys(userIdMap).filter(email => email !== 'admin@example.com')
  const categories = ['discussion', 'achievement', 'opportunity', 'question', 'event']

  const postContents = [
    { content: 'Just finished an incredible mentoring session with some amazing young entrepreneurs. The energy and passion they bring to solving real-world problems is truly inspiring!', category: 'discussion' },
    { content: 'Excited to share that our rural education initiative has reached 500+ children across 15 villages! This wouldn\'t have been possible without the incredible support from the community. Thank you all!', category: 'achievement' },
    { content: 'Sharing some insights from our recent workshop on sustainable farming practices. The response from local farmers has been overwhelming! Key takeaways: 1) Organic composting can increase yield by 30% 2) Water conservation techniques can reduce usage by 40%', category: 'discussion' },
    { content: 'Looking for collaborators on a new telemedicine project aimed at providing healthcare access to remote areas. If you\'re working in healthcare tech or have experience with rural communities, let\'s connect!', category: 'opportunity' },
    { content: 'Attending an amazing conference on social entrepreneurship this week! Would love to meet fellow community members. Coffee anyone?', category: 'event' },
    { content: 'What are the biggest challenges you face in scaling your social impact venture? Let\'s discuss and learn from each other\'s experiences.', category: 'question' },
    { content: 'Proud to announce that we\'ve secured seed funding for our clean energy project! The journey from idea to investment has been incredible. Happy to share learnings with anyone interested.', category: 'achievement' },
    { content: 'Has anyone worked with government schemes for rural development? Looking for guidance on navigating the application process.', category: 'question' },
    { content: 'Our team is hiring! Looking for passionate individuals to join our education technology startup. Skills needed: React, Node.js, and a heart for social impact.', category: 'opportunity' },
    { content: 'Just returned from a field visit to our project sites. Seeing the direct impact of our work on people\'s lives never gets old. This is why we do what we do!', category: 'discussion' },
    { content: 'Workshop alert! Conducting a free session on "Digital Marketing for Social Enterprises" next week. DM me if interested!', category: 'event' },
    { content: 'Milestone achieved: 1000+ families now have access to clean drinking water through our initiative. Grateful for all the support!', category: 'achievement' },
    { content: 'Looking for recommendations on good impact measurement frameworks. What do you all use?', category: 'question' },
    { content: 'The power of community! Thanks to connections made here, we\'ve formed three new partnerships this quarter. Keep the collaboration going!', category: 'discussion' },
    { content: 'Excited to be speaking at the Social Innovation Summit next month. Anyone else attending? Let\'s meet up!', category: 'event' },
  ]

  return postContents.map((post, index) => ({
    id: randomUUID(),
    author_id: userIdMap[emails[index % emails.length]],
    content: post.content,
    category: post.category,
    likes: Math.floor(Math.random() * 50),
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

function generateComments(posts: any[], userIdMap: Record<string, string>) {
  const emails = Object.keys(userIdMap).filter(email => email !== 'admin@example.com')
  const comments = []

  const commentTexts = [
    'This is amazing! Keep up the great work!',
    'Would love to learn more about this. Can we connect?',
    'Inspiring story! Thanks for sharing.',
    'Count me in! How can I help?',
    'This aligns perfectly with what we\'re doing. Let\'s collaborate!',
    'Great insights! Have you considered...',
    'Congratulations on this achievement!',
    'I\'d be interested in joining this initiative.',
    'Thanks for sharing your experience.',
    'This is exactly what our community needs!',
  ]

  for (const post of posts) {
    // Random 1-5 comments per post
    const commentCount = 1 + Math.floor(Math.random() * 5)
    for (let i = 0; i < commentCount; i++) {
      // Don't comment on own post
      const availableUsers = emails.filter(email => userIdMap[email] !== post.author_id)
      const randomEmail = availableUsers[Math.floor(Math.random() * availableUsers.length)]

      comments.push({
        id: randomUUID(),
        post_id: post.id,
        author_id: userIdMap[randomEmail],
        content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        likes: Math.floor(Math.random() * 20),
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  return comments
}

function generateResources(userIdMap: Record<string, string>) {
  const emails = Object.keys(userIdMap).filter(email => email !== 'admin@example.com')

  return [
    {
      id: randomUUID(),
      title: 'Complete Guide to Social Impact Measurement',
      description: 'A comprehensive guide on measuring and reporting social impact for your organization',
      category: 'business',
      type: 'document',
      url: 'https://example.com/impact-guide.pdf',
      uploaded_by_id: userIdMap[emails[0]],
      tags: JSON.stringify(['impact', 'measurement', 'reporting']),
      access_level: 'MEMBERS_ONLY',
      featured: true,
      downloads: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Fundraising Strategy Template',
      description: 'Template and best practices for creating an effective fundraising strategy',
      category: 'business',
      type: 'document',
      url: 'https://example.com/fundraising-template.xlsx',
      uploaded_by_id: userIdMap[emails[1]],
      tags: JSON.stringify(['fundraising', 'strategy', 'template']),
      access_level: 'MEMBERS_ONLY',
      downloads: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Introduction to Sustainable Agriculture',
      description: 'Video series covering basics of sustainable farming practices',
      category: 'technology',
      type: 'video',
      url: 'https://example.com/agriculture-course',
      uploaded_by_id: userIdMap[emails[2]],
      tags: JSON.stringify(['agriculture', 'sustainability', 'training']),
      access_level: 'MEMBERS_ONLY',
      featured: true,
      downloads: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Legal Guide for Social Enterprises',
      description: 'Understanding legal structures and compliance for social enterprises in India',
      category: 'business',
      type: 'document',
      url: 'https://example.com/legal-guide.pdf',
      uploaded_by_id: userIdMap[emails[3]],
      tags: JSON.stringify(['legal', 'compliance', 'social enterprise']),
      access_level: 'MEMBERS_ONLY',
      downloads: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Community Building Best Practices',
      description: 'Learn how to build and nurture engaged communities',
      category: 'community',
      type: 'video',
      url: 'https://example.com/community-building',
      uploaded_by_id: userIdMap['admin@example.com'],
      tags: JSON.stringify(['community', 'engagement', 'best practices']),
      access_level: 'PUBLIC',
      featured: true,
      downloads: Math.floor(Math.random() * 200),
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

seedDatabase()
