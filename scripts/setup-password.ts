import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupPassword() {
  try {
    console.log('Setting up password for shubham@gmail.com...')

    // Update the user's password using Admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      '80acfe34-fdf6-46f3-99b4-248c5aa8acea',
      { password: 'Admin123!' }
    )

    if (error) {
      console.error('Error updating password:', error)
      process.exit(1)
    }

    console.log('✅ Password set successfully!')
    console.log('')
    console.log('You can now log in with:')
    console.log('Email: shubham@gmail.com')
    console.log('Password: Admin123!')
    console.log('')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

setupPassword()
