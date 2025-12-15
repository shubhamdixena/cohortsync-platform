# User Data Flow Debugging Guide

## Problem
After registration, when you log in, the sidebar shows "User" instead of your actual name.

## Data Flow
The data should flow like this:
1. **Registration** → Name saved to database as `"firstname lastname"`
2. **Login** → Session established with Supabase Auth
3. **Page Load** → UserProvider fetches data from `/api/users/me`
4. **API Endpoint** → Queries database for User record with Profile
5. **Frontend** → Sidebar displays `userInfo.name` or fallback to "User"

## Step 1: Verify Registration Created User Record

### Open Browser Console (F12 → Console tab)
After you **register and log in**, check for these logs:

```
fetchUser: Starting user fetch...
fetchUser: Auth check result { hasUser: true, userId: "abc123...", authError: null }
fetchUser: Authenticated as abc123... fetching from /api/users/me...
fetchUser: API response status: 200
User data fetched: { id: "...", email: "...", name: "...", role: "MEMBER", ... }
```

**What to look for:**
- ✅ If you see `name: "Your Full Name"` → Data was returned from API
- ❌ If you see `name: null` or missing → API not returning name
- ❌ If you see `status: 404` or `401` → Auth failed

## Step 2: Check What API Actually Returns

### Visit Debug Page
1. After logging in, go to: **http://localhost:3000/test-user**
2. Look at the "Name:" field - what does it show?

**Expected:** Your actual first and last name
**Problem:** Shows "null" or missing entirely

If it shows your name → Issue is in UserContext state update
If it shows "null" → Issue is in /api/users/me endpoint

## Step 3: Check Server Logs

### Terminal Running `npm run dev`
Look for these logs:

```
GET /api/users/me: Checking authentication...
Auth check: { authUser: "your-user-id", authError: null }
GET /api/users/me result: { found: true, id: "...", email: "...", name: "...", role: "MEMBER" }
```

**What to look for:**
- ✅ If `name: "Your Full Name"` → Database has the data
- ❌ If `name: null` → User record was created without name
- ❌ If `found: false` → User record not found at all

## Step 4: Database Query (Advanced)

### If you have database access, run:
```sql
SELECT id, email, name, role FROM "User" WHERE email = 'your@email.com';
```

**Expected:** Should show your name value
**Problem:** Name is NULL → Registration insert failed silently

## Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Console shows `name: null` | Database has NULL | Re-register with valid first/last name |
| Console shows `404` error | Auth session lost | Clear cookies, log in again |
| Console shows `401` error | Auth not found | Check if logged in, try /debug-user first |
| Sidebar shows "User" but API shows name | UserContext bug | Check browser console for fetch errors |
| Logs don't show at all | Not logged in | Register and log in first |

## Testing Checklist

- [ ] Can log in successfully
- [ ] Browser console shows fetchUser logs
- [ ] /test-user page shows your name in "Name:" field
- [ ] Server terminal shows `name: "Your Name"` in /api/users/me result
- [ ] Sidebar displays your name instead of "User"
- [ ] Header shows correct role (no "Admin" badge for regular users)

## If Still Not Working

1. **Open DevTools Network tab (F12 → Network)**
2. **Refresh the page after logging in**
3. **Click on the `/api/users/me` request**
4. **Look at the Response tab**
5. **Send me the JSON response**

This will tell us exactly what data the API is returning.
