# Supabase Setup Guide

This guide explains how to set up and use Supabase with this project, ensuring full portability across different environments.

## Overview

This project uses **Supabase** as its database and authentication provider. All database operations go through Supabase, making the project fully portable. You can easily move it to any Supabase instance by updating environment variables.

## Prerequisites

- A Supabase account (create one at [supabase.com](https://supabase.com))
- Node.js installed (v18 or higher)
- npm or pnpm package manager

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the details:
   - **Name:** Your project name (e.g., "CohortSync")
   - **Database Password:** Choose a strong password (you'll need this for direct DB access)
   - **Region:** Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (usually takes 2-3 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. You'll find three important values:

   - **Project URL** - Your Supabase instance URL
   - **anon public** key - For client-side operations
   - **service_role** secret - For admin operations (server-side only)

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file (if it exists) or create a new `.env` file in the project root:

```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Alternative naming (for backwards compatibility)
SUPABASE_SECRET_KEY=your-service-role-key-here
```

**Important Notes:**
- Replace `your-project`, `your-anon-key-here`, and `your-service-role-key-here` with actual values from your Supabase dashboard
- The `NEXT_PUBLIC_` prefix makes variables available on the client-side
- Service role key should NEVER be exposed to the client
- Add `.env` to `.gitignore` (should already be there)

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run Database Migrations

The migrations will create all necessary tables, enums, RLS policies, and indexes.

**Option 1: Using Supabase MCP Tool (Automatic)**

The migrations are automatically applied when you use the Supabase MCP tools. If migrations haven't been applied yet, they will be applied automatically.

**Option 2: Check Migration Status**

You can check which migrations have been applied by viewing them in your Supabase dashboard:
1. Go to **Database** → **Migrations** in the Supabase dashboard

## Step 6: Seed the Database

Populate your database with test data:

```bash
npm run db:seed
```

This will:
- Create 12 test users in Supabase Auth
- Insert corresponding records in the public schema
- Generate profiles for all users
- Create 15 posts with comments
- Add 5 resources
- Set up 5 subgroups with members
- Create 3 admin announcements

**Default credentials:**
- Password for all users: `TestPass123!`
- Admin account: `admin@example.com`
- See [TEST_USERS.md](./TEST_USERS.md) for complete list

## Step 7: Verify Database Health

Check that everything was set up correctly:

```bash
npm run db:health
```

This will:
- Test database connection
- Count users in auth and public tables
- Verify data integrity
- Check RLS policies are working
- Report any issues found

## Step 8: Start the Development Server

```bash
npm run dev
```

Your application should now be running at `http://localhost:3000`

Try logging in with:
- Email: `admin@example.com`
- Password: `TestPass123!`

---

## Database Management Commands

### Seeding

```bash
# Seed database with test data
npm run db:seed

# Same as above (for backwards compatibility)
npm run db:seed-supabase
```

### Health Check

```bash
# Run database health check
npm run db:health
```

### Migrations

Migrations are managed through the Supabase MCP tools and are automatically applied when needed.

---

## Moving to a Different Supabase Instance

This project is fully portable. To move it to a new Supabase instance:

1. **Create new Supabase project** (Step 1 above)
2. **Update `.env` file** with new credentials (Step 2-3 above)
3. **Run migrations** (migrations will be automatically applied)
4. **Seed the database** with `npm run db:seed`
5. **Verify with health check**: `npm run db:health`

That's it! The entire project will work identically on the new instance.

---

## Architecture Overview

### Database Schema

The project uses these main tables:

**User Management:**
- `users` - Core user information (linked to auth.users)
- `profiles` - Extended user profile data

**Content:**
- `posts` - Community posts
- `comments` - Post comments
- `resources` - Shared resources and documents
- `announcements` - Admin announcements

**Community:**
- `subgroups` - Interest groups and communities
- `subgroup_members` - Subgroup membership

**Messaging:**
- `conversations` - Direct and group conversations
- `messages` - Conversation messages

**Moderation:**
- `moderated_content` - Content moderation reports
- `audit_logs` - System audit trail

### Authentication Flow

1. User signs up/logs in through Supabase Auth
2. User record created in `auth.users` (managed by Supabase)
3. Corresponding record created in `public.users` (using same UUID)
4. Profile automatically created in `public.profiles`
5. All subsequent operations use the user's UUID for authorization

### Row Level Security (RLS)

Every table has RLS enabled with policies that:
- Allow users to view their own data
- Allow users to view public/community content
- Restrict admin operations to admin users
- Prevent unauthorized data access

RLS uses `auth.uid()` to get the current user's ID and enforce policies.

---

## Troubleshooting

### Connection Issues

**Error: "Cannot connect to database"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check if your Supabase project is active
- Ensure you have internet connection

**Error: "Missing environment variables"**
- Make sure `.env` file exists in project root
- Verify all required variables are set
- Restart dev server after changing `.env`

### Authentication Issues

**Can't log in with test users**
- Run `npm run db:seed` to create test users
- Verify users exist: Check Auth → Users in Supabase dashboard
- Ensure password is exactly: `TestPass123!` (case-sensitive)

**"Unauthorized" errors**
- Check RLS policies are correctly applied
- Verify user ID in `auth.users` matches ID in `public.users`
- Run `npm run db:health` to check data integrity

### Seeding Issues

**Error during seeding**
- Check service role key is correct (not anon key)
- Verify you have admin permissions
- Try clearing existing data first (in Supabase dashboard)

**Users already exist**
- The seeding script handles existing users gracefully
- It will fetch existing auth user IDs instead of creating new ones
- Safe to run multiple times

### Migration Issues

**Policies already exist**
- The cleanup migration handles this automatically
- Migrations are idempotent and safe to re-run

---

## Security Best Practices

### Environment Variables

✅ **DO:**
- Keep `.env` file in `.gitignore`
- Use different credentials for dev/staging/production
- Rotate service role key periodically
- Store production secrets in secure vault

❌ **DON'T:**
- Commit `.env` file to git
- Share service role key publicly
- Use service role key in client-side code
- Use same credentials across environments

### RLS Policies

✅ **DO:**
- Always enable RLS on new tables
- Test policies with different user roles
- Use `auth.uid()` for user identification
- Make policies as restrictive as possible

❌ **DON'T:**
- Create policies with `USING (true)` (too permissive)
- Disable RLS on tables with user data
- Allow unrestricted admin access without checks

### Authentication

✅ **DO:**
- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Enable MFA for production admin accounts
- Implement rate limiting on auth endpoints
- Log authentication events

❌ **DON'T:**
- Store passwords in plain text
- Use weak test passwords in production
- Share admin credentials
- Skip email verification in production

---

## Production Deployment

Before deploying to production:

1. **Create production Supabase project**
2. **Set up environment variables** in your hosting platform
3. **Enable email confirmation** in Supabase Auth settings
4. **Configure email templates** for password reset, etc.
5. **Set up custom domain** (optional)
6. **Enable MFA** for admin accounts
7. **Review and test all RLS policies**
8. **Set up backups** (automatic in Supabase Pro plan)
9. **Configure CORS** if needed
10. **Monitor logs** and set up alerts

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Run `npm run db:health` to diagnose issues
3. Check Supabase logs in dashboard (Logs section)
4. Review RLS policies in Supabase SQL editor
5. Verify environment variables are correct

For Supabase-specific issues, check their [GitHub discussions](https://github.com/supabase/supabase/discussions).
