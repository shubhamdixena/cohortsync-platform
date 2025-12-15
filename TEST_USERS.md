# Test User Credentials

This document lists all test user accounts created by the database seeding script. All users have the same password for easy testing.

## Default Password

**Password for ALL test accounts:** `TestPass123!`

---

## Admin Account

Use this account for testing admin functionality (managing announcements, moderation, admin-only resources).

- **Email:** `admin@example.com`
- **Name:** Admin User
- **Role:** ADMIN
- **Location:** Mumbai, India

---

## Regular Member Accounts

Use these accounts for testing standard user functionality (posts, comments, profiles, messaging, resources).

### Rahul Kumar
- **Email:** `rahul.kumar@example.com`
- **Role:** MEMBER
- **Location:** Bangalore, India
- **Bio:** Tech entrepreneur passionate about using technology for social impact

### Anjali Patel
- **Email:** `anjali.patel@example.com`
- **Role:** MEMBER
- **Location:** Delhi, India
- **Bio:** Social impact consultant working on rural education initiatives

### Sanjay Mehta
- **Email:** `sanjay.mehta@example.com`
- **Role:** MEMBER
- **Location:** Pune, India
- **Bio:** Sustainable agriculture expert promoting organic farming practices

### Meera Gupta
- **Email:** `meera.gupta@example.com`
- **Role:** MEMBER
- **Location:** Hyderabad, India
- **Bio:** Healthcare innovation specialist building telemedicine solutions for rural areas

### Vikram Singh
- **Email:** `vikram.singh@example.com`
- **Role:** MEMBER
- **Location:** Jaipur, India
- **Bio:** Social entrepreneur creating employment opportunities in rural India

### Priya Sharma
- **Email:** `priya.sharma@example.com`
- **Role:** MEMBER
- **Location:** Chennai, India
- **Bio:** EdTech founder building digital learning platforms for underserved communities

### Amit Verma
- **Email:** `amit.verma@example.com`
- **Role:** MEMBER
- **Location:** Kolkata, India
- **Bio:** Clean energy advocate working on solar solutions for rural electrification

### Sneha Roy
- **Email:** `sneha.roy@example.com`
- **Role:** MEMBER
- **Location:** Ahmedabad, India
- **Bio:** Microfinance specialist empowering women entrepreneurs

### Karthik Reddy
- **Email:** `karthik.reddy@example.com`
- **Role:** MEMBER
- **Location:** Visakhapatnam, India
- **Bio:** Water conservation expert implementing rainwater harvesting systems

### Neha Kapoor
- **Email:** `neha.kapoor@example.com`
- **Role:** MEMBER
- **Location:** Lucknow, India
- **Bio:** Skill development trainer focusing on youth employability

### Rohan Desai
- **Email:** `rohan.desai@example.com`
- **Role:** MEMBER
- **Location:** Surat, India
- **Bio:** Textile industry innovator promoting sustainable fashion

---

## Testing Scenarios

### Basic Authentication
1. Log in with any email above using password `TestPass123!`
2. Verify you see the appropriate dashboard based on role

### Profile Management
1. Log in with any member account
2. Navigate to your profile
3. Update profile information (bio, title, skills, etc.)
4. Verify changes are saved successfully

### Content Creation
1. Log in with any member account
2. Create a new post in the community feed
3. Comment on another user's post
4. Like posts and comments

### Authorization Testing
1. Log in as a member
2. Try to access admin features (should be denied)
3. Try to edit another user's post (should be denied)
4. Try to edit your own post (should succeed)

### Admin Functionality
1. Log in as `admin@example.com`
2. Access admin dashboard
3. Create/edit announcements
4. Manage resources with different access levels
5. View audit logs and moderated content

### Subgroups
1. Log in with any account
2. Browse available subgroups
3. Join/leave subgroups
4. View subgroup members

### Resources
1. Test accessing resources with different access levels:
   - PUBLIC: Available to everyone
   - MEMBERS_ONLY: Available to all authenticated users
   - ADMIN_ONLY: Only accessible to admin users

### Messaging (if implemented)
1. Log in with one account
2. Start a conversation with another user
3. Send messages
4. Log in as the other user and verify messages are received

---

## Database Reset

To reset the database and reseed with fresh data:

```bash
npm run db:seed-supabase
```

This will:
1. Create all users in Supabase Auth
2. Insert user records in the public schema
3. Create profiles for all users
4. Generate posts, comments, resources, and other test data
5. Set up subgroups and memberships
6. Create admin announcements

---

## Security Notes

- These are TEST credentials only
- Never use these passwords in production
- The service role key used for seeding has full database access
- Ensure `.env` file is in `.gitignore` to prevent credential leaks
- Change all passwords and keys before deploying to production

---

## Troubleshooting

### Can't log in
- Verify the user exists in both `auth.users` and `public.users` tables
- Check that email confirmation is not required (should be auto-confirmed)
- Ensure correct password: `TestPass123!` (case-sensitive)

### Authorization errors
- Verify RLS policies are correctly applied
- Check that user ID in `auth.users` matches ID in `public.users`
- Confirm the user's role is correctly set

### Missing data
- Run the seeding script: `npm run db:seed-supabase`
- Check database connection in `.env` file
- Verify service role key has admin permissions
