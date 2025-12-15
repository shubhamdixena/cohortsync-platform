# Quick Testing Checklist

## ✅ Pre-Testing Setup
- [ ] Dev server running: `npm run dev`
- [ ] App accessible at http://localhost:3001
- [ ] DevTools open: F12 (Console tab)

## ✅ Test 1: Profile Data Loads
**Steps:**
1. Navigate to http://localhost:3001/directory
2. Look for new users in the list:
   - Deepak Sharma
   - Natasha Patel
   - Carlos Oliveira
   - Amita Bhatt
   - Rohan Desai
   - Priya Deshmukh
3. Click on one of them

**Expected Result:**
- Profile page loads
- Console shows: "Fetching user with ID: [uuid]"
- Console shows: "Raw API Response: {...}"
- Console shows: "Parsed User Data: {...}"
- No error messages in console

## ✅ Test 2: Looking For & Offering Display
**On profile page, check:**

1. **"I am looking for" section**
   - [ ] Shows 3-5 items
   - [ ] Items are bullet-pointed
   - [ ] Items match database (5 specific needs)
   - Example for Deepak Sharma:
     - Investment Partners
     - Banking Sector Connections
     - Regulatory Expertise
     - International Expansion Partners
     - Blockchain Integration Specialists

2. **"I am offering" section**
   - [ ] Shows 3-5 items
   - [ ] Items are bullet-pointed
   - [ ] Items match database (5 offerings)
   - Example for Deepak Sharma:
     - Fintech Solutions
     - Technical Architecture Guidance
     - Financial Inclusion Strategy
     - Payment Gateway Integration
     - Regulatory Navigation Support

## ✅ Test 3: Experience & Details
**On profile page, check:**

1. **Experience section**
   - [ ] Shows 2-3 experience entries
   - [ ] Each entry shows:
     - [ ] Job title (bold)
     - [ ] Company name
     - [ ] Duration
     - [ ] Description text

2. **Skills & Expertise badges**
   - [ ] Shows 4-5 skills as badges
   - [ ] Each skill is clickable/styled correctly

3. **Social media links**
   - [ ] LinkedIn link is present and clickable
   - [ ] Website link works
   - [ ] All links have proper https:// URLs

## ✅ Test 4: Error Handling
**Test broken profile:**
1. Navigate to: http://localhost:3001/profile/invalid-id-12345
2. Check you see:
   - [ ] "User Not Found" heading
   - [ ] Error message: "Failed to load user profile: ..."
   - [ ] User ID displayed: "invalid-id-12345"
   - [ ] Expandable "Debug Information" section
   - [ ] API endpoint shown in debug info
   - [ ] "Back to Directory" link works

## ✅ Test 5: API Response
**In browser console, test API:**
```javascript
// Paste this in console to test API directly
fetch('/api/users').then(r => r.json()).then(users => {
  const newUser = users.find(u => u.name === 'Deepak Sharma');
  console.log('Found Deepak:', newUser);
  console.log('Profile data:', newUser?.profile);
});
```

Expected output:
- [ ] Shows Deepak Sharma user object
- [ ] profile.lookingFor is a JSON array
- [ ] profile.offering is a JSON array
- [ ] profile.experience is a JSON array

## ✅ Test 6: Different Users
Test at least 2 different users:
1. [ ] Deepak Sharma (Fintech) - should have all sections filled
2. [ ] Natasha Patel (Women Leadership) - should have different content
3. [ ] Carlos Oliveira (Circular Economy) - should have different content

All should show:
- [ ] Unique bio
- [ ] 5 different "looking for" items
- [ ] 5 different "offering" items
- [ ] Different experience entries

## ✅ Test 7: Mobile Responsiveness
1. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Switch to mobile size
3. Check:
   - [ ] "Looking For" and "Offering" stack vertically
   - [ ] All text is readable
   - [ ] Images don't overflow
   - [ ] Social links are clickable
   - [ ] Experience section displays well

## ✅ Test 8: Network Issues (Offline Test)
1. DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page
4. Verify:
   - [ ] Shows error message
   - [ ] Error message is helpful
   - [ ] No blank/broken layout
   - [ ] Can still navigate back

## 🎯 Success Criteria
All tests pass when:
- ✅ Profile pages load without errors
- ✅ All detailed content displays correctly
- ✅ Console shows clean logs (no parse errors)
- ✅ Error messages are helpful
- ✅ API responds with proper data
- ✅ Social links work correctly
- ✅ Mobile layout works
- ✅ Offline handling works

## 📝 Console Commands for Testing

```javascript
// Get all users
fetch('/api/users').then(r => r.json()).then(d => console.log('Users:', d))

// Get specific user
fetch('/api/users?id=deepak.sharma@example.com')
  .then(r => r.json())
  .then(d => console.log('Deepak:', d))

// Check profile data parsing
const profile = {"lookingFor": "[\"item1\", \"item2\"]"};
// This should parse correctly with our safeJsonParse function
```

## 🐛 If Something Fails

1. **Check console for errors** (F12 → Console)
2. **Check Network tab** for failed requests
3. **Restart dev server** (Ctrl+C, then `npm run dev`)
4. **Check database** with `npx prisma studio`
5. **Check seed data** - Run `npx ts-node prisma/seed.ts` again
6. **Check logs** in server terminal

## 📸 Expected Screenshots

### Profile Header Should Show:
- User initials in circle (DS, NP, CO, AB, RD, PD)
- Full name
- Job title
- Location with map pin icon
- Message and More buttons

### Profile Sections Should Show:
1. Back to Directory link
2. Header card with user info
3. Looking For card (with 5 items)
4. Offering card (with 5 items)
5. About card with bio
6. Contact info card
7. Experience card (2-3 items)
8. Referrals card
9. Community Involvement card
10. Skills & Expertise (as badges)
11. Recent Posts section

---

**Last Updated:** December 14, 2025
**Status:** ✅ All improvements implemented and ready for testing
