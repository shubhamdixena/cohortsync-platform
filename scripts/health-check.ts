import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function healthCheck() {
  console.log('🏥 Database Health Check')
  console.log('━'.repeat(50))
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)

  const issues: string[] = []
  let checksRan = 0
  let checksPassed = 0

  try {
    // Check 1: Database connection
    checksRan++
    console.log('[1/8] Testing database connection...')
    const { error: connError } = await supabase.from('users').select('count').limit(1)
    if (connError) {
      console.log('  ❌ Database connection failed')
      issues.push('Cannot connect to database')
    } else {
      console.log('  ✅ Database connection successful')
      checksPassed++
    }

    // Check 2: Auth users count
    checksRan++
    console.log('\n[2/8] Checking auth users...')
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.log('  ❌ Cannot fetch auth users')
      issues.push('Auth users query failed')
    } else {
      const authCount = authData.users.length
      console.log(`  ✅ Auth users found: ${authCount}`)
      checksPassed++

      if (authCount === 0) {
        issues.push('No auth users found - database may not be seeded')
      }
    }

    // Check 3: Public users count
    checksRan++
    console.log('\n[3/8] Checking public users...')
    const { data: publicUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, status')

    if (usersError) {
      console.log('  ❌ Cannot fetch public users')
      issues.push('Public users query failed')
    } else {
      const publicCount = publicUsers?.length || 0
      console.log(`  ✅ Public users found: ${publicCount}`)
      checksPassed++

      if (authData && publicUsers) {
        const authCount = authData.users.length
        if (authCount !== publicCount) {
          issues.push(`Auth users (${authCount}) and public users (${publicCount}) counts don't match`)
          console.log(`  ⚠️  Mismatch: ${authCount} auth users vs ${publicCount} public users`)
        }
      }

      // Count by role
      const adminCount = publicUsers?.filter(u => u.role === 'ADMIN').length || 0
      const memberCount = publicUsers?.filter(u => u.role === 'MEMBER').length || 0
      console.log(`     - Admins: ${adminCount}`)
      console.log(`     - Members: ${memberCount}`)
    }

    // Check 4: Profiles
    checksRan++
    console.log('\n[4/8] Checking profiles...')
    const { count: profileCount, error: profileError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (profileError) {
      console.log('  ❌ Cannot count profiles')
      issues.push('Profiles query failed')
    } else {
      console.log(`  ✅ Profiles found: ${profileCount || 0}`)
      checksPassed++

      if (publicUsers && profileCount !== publicUsers.length) {
        issues.push(`Users (${publicUsers.length}) and profiles (${profileCount}) counts don't match`)
        console.log(`  ⚠️  Not all users have profiles`)
      }
    }

    // Check 5: Posts and Comments
    checksRan++
    console.log('\n[5/8] Checking posts and comments...')
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    const { count: commentsCount, error: commentsError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })

    if (postsError || commentsError) {
      console.log('  ❌ Cannot count posts/comments')
      issues.push('Posts or comments query failed')
    } else {
      console.log(`  ✅ Posts: ${postsCount || 0}`)
      console.log(`  ✅ Comments: ${commentsCount || 0}`)
      checksPassed++

      if ((postsCount || 0) === 0) {
        issues.push('No posts found - content may need to be seeded')
      }
    }

    // Check 6: Resources
    checksRan++
    console.log('\n[6/8] Checking resources...')
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('access_level')

    if (resourcesError) {
      console.log('  ❌ Cannot fetch resources')
      issues.push('Resources query failed')
    } else {
      const resourceCount = resources?.length || 0
      const publicRes = resources?.filter(r => r.access_level === 'PUBLIC').length || 0
      const membersRes = resources?.filter(r => r.access_level === 'MEMBERS_ONLY').length || 0
      const adminRes = resources?.filter(r => r.access_level === 'ADMIN_ONLY').length || 0

      console.log(`  ✅ Total resources: ${resourceCount}`)
      console.log(`     - Public: ${publicRes}`)
      console.log(`     - Members only: ${membersRes}`)
      console.log(`     - Admin only: ${adminRes}`)
      checksPassed++
    }

    // Check 7: Subgroups
    checksRan++
    console.log('\n[7/8] Checking subgroups...')
    const { count: subgroupsCount, error: subgroupsError } = await supabase
      .from('subgroups')
      .select('*', { count: 'exact', head: true })

    const { count: membersCount, error: membersError } = await supabase
      .from('subgroup_members')
      .select('*', { count: 'exact', head: true })

    if (subgroupsError || membersError) {
      console.log('  ❌ Cannot count subgroups/members')
      issues.push('Subgroups query failed')
    } else {
      console.log(`  ✅ Subgroups: ${subgroupsCount || 0}`)
      console.log(`  ✅ Subgroup memberships: ${membersCount || 0}`)
      checksPassed++
    }

    // Check 8: Announcements
    checksRan++
    console.log('\n[8/8] Checking announcements...')
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select('status')

    if (announcementsError) {
      console.log('  ❌ Cannot fetch announcements')
      issues.push('Announcements query failed')
    } else {
      const announcementCount = announcements?.length || 0
      const published = announcements?.filter(a => a.status === 'PUBLISHED').length || 0
      const draft = announcements?.filter(a => a.status === 'DRAFT').length || 0

      console.log(`  ✅ Total announcements: ${announcementCount}`)
      console.log(`     - Published: ${published}`)
      console.log(`     - Draft: ${draft}`)
      checksPassed++
    }

    // Summary
    console.log('\n' + '━'.repeat(50))
    console.log('📊 HEALTH CHECK SUMMARY')
    console.log('━'.repeat(50))
    console.log(`✅ Checks passed: ${checksPassed}/${checksRan}`)

    if (issues.length > 0) {
      console.log(`\n⚠️  Issues found (${issues.length}):`)
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`)
      })
      console.log('\n💡 Tip: Run `npm run db:seed-supabase` to seed the database')
    } else {
      console.log('\n🎉 All checks passed! Database is healthy.')
    }

    console.log('')

  } catch (error) {
    console.error('\n❌ Health check failed with error:', error)
    process.exit(1)
  }
}

healthCheck()
