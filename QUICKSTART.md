# Quick Start - Testing Profile Pages

## 🚀 Get Started in 2 Minutes

### Step 1: Start Dev Server
```bash
cd /Users/shubhamdixena/Development/CohortSync/cohortnonsaas
npm run dev
```
✅ Server starts on http://localhost:3001

### Step 2: Navigate to Directory
Open browser: **http://localhost:3001/directory**

### Step 3: Click on a User
Look for new users:
- **Deepak Sharma** - Fintech Expert
- **Natasha Patel** - Women Leadership
- **Carlos Oliveira** - Circular Economy
- **Amita Bhatt** - Nutrition Expert
- **Rohan Desai** - Skill Development
- **Priya Deshmukh** - Climate Tech

Click on any of them to see their detailed profile.

### Step 4: Open DevTools (F12)
Go to **Console** tab and look for:
```
✅ Fetching user with ID: [uuid]
✅ Raw API Response: {...}
✅ Parsed User Data: {...}
```

### Step 5: Verify Profile Content
You should see:
- ✅ "I am looking for" section with 5 items
- ✅ "I am offering" section with 5 items
- ✅ Experience section with 3+ entries
- ✅ Skills displayed as badges
- ✅ Social media links

---

## 📝 What You Should See

### For Deepak Sharma

**Looking For:**
- Investment Partners
- Banking Sector Connections
- Regulatory Expertise
- International Expansion Partners
- Blockchain Integration Specialists

**Offering:**
- Fintech Solutions
- Technical Architecture Guidance
- Financial Inclusion Strategy
- Payment Gateway Integration
- Regulatory Navigation Support

**Experience:**
1. Founder at InclusivePay Tech (5 years)
2. Product Manager at FinTech Startup (6 years)
3. Software Engineer at ICICI Bank (3 years)

---

## 🔍 Debugging Tips

### If you see "User Not Found":
1. F12 → Console → look for error message
2. Check if user ID is in the error
3. Verify the user exists in the database:
   ```bash
   npx prisma studio
   # Look in User table for the user
   ```

### If you see blank "Looking For" section:
1. Check console for parse errors
2. Refresh the page
3. Open Prisma Studio to verify data is there

### If API returns error:
1. Check Network tab (F12 → Network)
2. Click on `/api/users?id=...` request
3. Look at the response body
4. Restart dev server if needed

---

## 🧪 Quick Tests

### Test 1: Multiple Users
Click on 3 different users. Each should have:
- Different bio
- Different "looking for" items
- Different "offering" items
- Different experience

### Test 2: Social Links
Click on social media links (LinkedIn, Website, GitHub). They should:
- Open in new tab
- Have proper URLs (starting with https://)
- Not be broken links

### Test 3: Error Case
Navigate to: `http://localhost:3001/profile/test-invalid-id`
- Should show "User Not Found"
- Should show debug info
- Should have back to directory link

### Test 4: Refresh Page
On a profile page, refresh (Cmd+R).
- Page should still load
- Data should still display
- No errors in console

---

## 📱 Mobile Testing

DevTools → Toggle device toolbar (Cmd+Shift+M)
- Sections should stack vertically
- Text should be readable
- No overflow or broken layout
- Links should be tappable

---

## 🎯 Expected Results

| Test | Expected | Status |
|------|----------|--------|
| Directory loads | Shows 40+ users | ✅ |
| Click on user | Profile page loads | ✅ |
| Console logs | Shows 3 logs | ✅ |
| Looking For | 5 items displayed | ✅ |
| Offering | 5 items displayed | ✅ |
| Experience | 3+ entries shown | ✅ |
| Social links | Working URLs | ✅ |
| Error page | Shows debug info | ✅ |
| Mobile layout | Responsive design | ✅ |

---

## 🐛 If Something Goes Wrong

### Check 1: Is server running?
```bash
ps aux | grep "next dev" | grep -v grep
# Should show Node.js process
```

### Check 2: Is database connected?
```bash
npx prisma studio
# Should open and show data
```

### Check 3: Are users seeded?
```bash
npx prisma studio
# Go to User table
# Should see 42+ users
```

### Check 4: Restart everything
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

## 📚 Documentation

For more details, see:
- 📄 `IMPLEMENTATION_COMPLETE.md` - Complete summary
- 📄 `CODE_CHANGES.md` - Code diff details
- 📄 `DATA_STRUCTURE_REFERENCE.md` - API format reference
- 📄 `TESTING_CHECKLIST.md` - Full testing guide
- 📄 `PROFILE_IMPROVEMENTS.md` - Implementation details
- 📄 `FRONTEND_FIX_SUMMARY.md` - Fix summary

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Directory shows 40+ users
2. ✅ Click on user loads their profile
3. ✅ Console shows "Fetching user with ID"
4. ✅ Profile page displays all sections
5. ✅ "Looking For" has 3-5 items
6. ✅ "Offering" has 3-5 items
7. ✅ Experience shows 2-3 entries
8. ✅ No error messages in console
9. ✅ Social links work correctly
10. ✅ Page is responsive on mobile

---

## 🎉 That's It!

You now have a fully functional profile page system with:
- ✅ Database-backed user data
- ✅ Comprehensive user profiles
- ✅ Detailed information display
- ✅ Robust error handling
- ✅ Debugging capabilities

Happy testing! 🚀

---

**Questions?** Check the console logs and error messages first - they're designed to be helpful!
