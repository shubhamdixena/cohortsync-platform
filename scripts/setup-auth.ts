import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables manually
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '') // Remove quotes
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const DEMO_USERS = [
  {
    email: 'demo-admin@cohortsync.com',
    password: 'password123',
    role: 'ADMIN',
    name: 'Demo Admin',
    initials: 'DA',
    bio: 'I am the demo administrator.'
  },
  {
    email: 'demo-member@cohortsync.com',
    password: 'password123',
    role: 'MEMBER',
    name: 'Demo Member',
    initials: 'DM',
    bio: 'I am a demo member.'
  }
]

async function main() {
  console.log('Setting up demo auth users...')

  for (const user of DEMO_USERS) {
    console.log(`Processing ${user.email}...`)

    // 1. Create/Get Auth User
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { name: user.name }
    })

    let userId = authUser.user?.id

    if (createError) {
      if (createError.message.includes('already has been registered') || createError.status === 422) {
        console.log(`User ${user.email} already exists in Auth. Fetching ID...`)
        // Fetch user by email to get ID
        const { data: listUsers } = await supabase.auth.admin.listUsers()
        const existingUser = listUsers.users.find(u => u.email === user.email)
        if (existingUser) {
          userId = existingUser.id
          // Update password just in case
          await supabase.auth.admin.updateUserById(userId, { password: user.password })
        }
      } else {
        console.error(`Error creating auth user ${user.email}:`, createError)
        continue
      }
    }

    if (!userId) {
      console.error(`Could not determine ID for ${user.email}`)
      continue
    }

    console.log(`Auth User ID: ${userId}`)

    // 2. Upsert into public.users
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: user.email,
        name: user.name,
        initials: user.initials,
        role: user.role,
        password: 'managed_by_supabase_auth',
        status: 'ACTIVE',
        bio: user.bio,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    if (dbError) {
      console.error(`Error upserting public user ${user.email}:`, dbError)
    } else {
      console.log(`Successfully synced ${user.email} to public.users`)
    }

    // 3. Create Profile if not exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: crypto.randomUUID(),
        user_id: userId,
        bio: user.bio,
        location: 'Demo City',
        website: 'https://cohortsync.com',
        skills: JSON.stringify(['Demo', 'Testing']),
        expertise: JSON.stringify(['Collaboration', 'Development']),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (profileError) {
      console.error(`Error creating profile for ${user.email}:`, profileError)
    }
  }

  console.log('Done!')
}

main()
