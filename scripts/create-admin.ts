import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    // Sign up a new user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@cohortsync.local',
      password: 'Admin123!',
      options: {
        data: {
          name: 'Admin User'
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('User already exists, trying to sign in to test...')
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@cohortsync.local',
          password: 'Admin123!'
        })

        if (!signInError) {
          console.log('✅ Existing user credentials work!')
          console.log('')
          console.log('You can log in with:')
          console.log('Email: admin@cohortsync.local')
          console.log('Password: Admin123!')
          console.log('')
          await supabase.auth.signOut()
          return
        }

        console.error('User exists but password is different. Try resetting password.')
        process.exit(1)
      }
      console.error('Error creating user:', signUpError)
      process.exit(1)
    }

    if (authData.user) {
      console.log('Auth user created:', authData.user.id)

      // Sign out from the new account
      await supabase.auth.signOut()

      // Create database user record
      const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id: authData.user.id,
          email: 'admin@cohortsync.local',
          name: 'Admin User',
          initials: 'AU',
          role: 'ADMIN'
        })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Error creating database user:', error)
      } else {
        console.log('Database user created')
      }

      // Create profile
      const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: authData.user.id,
          title: 'System Administrator',
          bio: 'Admin user for CohortSync platform'
        })
      })

      if (!profileResponse.ok) {
        const error = await profileResponse.text()
        console.error('Error creating profile:', error)
      } else {
        console.log('Profile created')
      }

      console.log('')
      console.log('✅ Admin user created successfully!')
      console.log('')
      console.log('You can now log in with:')
      console.log('Email: admin@cohortsync.local')
      console.log('Password: Admin123!')
      console.log('')
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createAdminUser()
