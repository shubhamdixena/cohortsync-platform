# Data Structure & API Response Format

## Database Schema

### User Table
```
id: UUID
email: string (unique)
password: string (hashed)
name: string
initials: string
role: UserRole (MEMBER | ADMIN)
status: MemberStatus (ACTIVE | PENDING | SUSPENDED | INACTIVE)
avatar: string? (optional image URL)
bio: string?
location: string?
phone: string?
createdAt: DateTime
updatedAt: DateTime
```

### Profile Table (related to User via userId)
```
id: UUID
userId: UUID (foreign key to User.id)
title: string?
bio: string?
phone: string?
website: string?
linkedin: string?
twitter: string?
github: string?

// JSON fields (stored as strings, must be parsed)
skills: string? (JSON array)
expertise: string? (JSON array)
experience: string? (JSON array)
education: string? (JSON array)
lookingFor: string? (JSON array)
offering: string? (JSON array)

joinedDate: DateTime?
cohort: string?
updatedAt: DateTime
```

## API Response Format

### GET /api/users (all users)
```json
[
  {
    "id": "clxx123...",
    "email": "deepak.sharma@example.com",
    "name": "Deepak Sharma",
    "initials": "DS",
    "role": "MEMBER",
    "status": "ACTIVE",
    "bio": "Building financial technology solutions...",
    "location": "Gurgaon, India",
    "phone": null,
    "avatar": null,
    "createdAt": "2024-12-14T10:00:00Z",
    "updatedAt": "2024-12-14T10:00:00Z",
    "profile": {
      "id": "clxx456...",
      "userId": "clxx123...",
      "title": "Fintech for Financial Inclusion",
      "bio": "Building financial technology solutions...",
      "website": "https://inclusivepay.tech",
      "linkedin": "linkedin.com/in/deepaksharma",
      "twitter": null,
      "github": "github.com/deepaksharma",
      "skills": "[\"Fintech\", \"Financial Inclusion\", \"Mobile Banking\", \"Payment Systems\", \"Blockchain\"]",
      "expertise": "[\"Digital Payments\", \"Microfinance Technology\", \"Blockchain\", \"UPI Integration\"]",
      "experience": "[{\"title\": \"Founder at InclusivePay Tech\", \"company\": \"InclusivePay Tech\", \"duration\": \"5 years\", \"description\": \"...\"}, ...]",
      "education": "[\"Masters in Finance & Technology - IIT Delhi\", \"Bachelor in Computer Science - Manipal University\"]",
      "lookingFor": "[\"Investment Partners\", \"Banking Sector Connections\", \"Regulatory Expertise\", \"International Expansion Partners\", \"Blockchain Integration Specialists\"]",
      "offering": "[\"Fintech Solutions\", \"Technical Architecture Guidance\", \"Financial Inclusion Strategy\", \"Payment Gateway Integration\", \"Regulatory Navigation Support\"]",
      "joinedDate": "2024-12-14T00:00:00Z",
      "cohort": "2023",
      "updatedAt": "2024-12-14T10:00:00Z"
    }
  },
  // ... more users
]
```

### GET /api/users?id={userId} (single user)
```json
{
  "id": "clxx123...",
  "email": "deepak.sharma@example.com",
  "name": "Deepak Sharma",
  "initials": "DS",
  "role": "MEMBER",
  "status": "ACTIVE",
  "bio": "Building financial technology solutions to bring banking services to underbanked populations across rural India.",
  "location": "Gurgaon, India",
  "phone": null,
  "avatar": null,
  "createdAt": "2024-12-14T10:00:00Z",
  "updatedAt": "2024-12-14T10:00:00Z",
  "profile": {
    "id": "clxx456...",
    "userId": "clxx123...",
    "title": "Fintech for Financial Inclusion",
    "bio": "Building financial technology solutions...",
    "phone": null,
    "website": "https://inclusivepay.tech",
    "linkedin": "linkedin.com/in/deepaksharma",
    "twitter": null,
    "github": "github.com/deepaksharma",
    "skills": "[\"Fintech\", \"Financial Inclusion\", \"Mobile Banking\", \"Payment Systems\", \"Blockchain\"]",
    "expertise": "[\"Digital Payments\", \"Microfinance Technology\", \"Blockchain\", \"UPI Integration\"]",
    "experience": "[{\"title\": \"Founder at InclusivePay Tech\", \"company\": \"InclusivePay Tech\", \"duration\": \"5 years\", \"description\": \"Building financial technology solutions...\"}, {\"title\": \"Product Manager at FinTech Startup\", \"company\": \"FinTech Startup\", \"duration\": \"6 years\", \"description\": \"...\"}, {\"title\": \"Software Engineer at ICICI Bank\", \"company\": \"ICICI Bank\", \"duration\": \"3 years\", \"description\": \"...\"}]",
    "education": "[\"Masters in Finance & Technology - IIT Delhi\", \"Bachelor in Computer Science - Manipal University\"]",
    "lookingFor": "[\"Investment Partners\", \"Banking Sector Connections\", \"Regulatory Expertise\", \"International Expansion Partners\", \"Blockchain Integration Specialists\"]",
    "offering": "[\"Fintech Solutions\", \"Technical Architecture Guidance\", \"Financial Inclusion Strategy\", \"Payment Gateway Integration\", \"Regulatory Navigation Support\"]",
    "joinedDate": "2024-12-14T00:00:00Z",
    "cohort": "2023",
    "updatedAt": "2024-12-14T10:00:00Z"
  }
}
```

## Frontend Parsing

### Unsafe Parsing (old - would crash):
```typescript
JSON.parse(data.profile.lookingFor)  // ❌ Crashes if string isn't valid JSON
```

### Safe Parsing (new - won't crash):
```typescript
const safeJsonParse = (value: any): any[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.warn('Failed to parse:', value, e)
      return []
    }
  }
  return []
}

// Usage:
const lookingFor = safeJsonParse(data.profile.lookingFor)
// Result: ["Investment Partners", "Banking Sector Connections", ...]
```

## Transformed UI Data Structure

After fetching and parsing, the data is transformed to:

```typescript
interface UserProfile {
  id: string
  name: string
  initials: string
  title?: string
  location?: string
  email: string
  bio?: string
  expertise?: string[]        // Parsed from JSON
  skills?: string[]           // Parsed from JSON
  joinDate?: string          // Formatted from createdAt
  cohort?: string
  industry?: string
  subgroups?: string[]
  avatar?: string
  social?: {
    linkedin?: string         // URL formatted
    twitter?: string         // URL formatted
    website?: string         // URL formatted
    github?: string          // URL formatted
  }
  lookingFor?: string[]       // Parsed from JSON
  offering?: string[]         // Parsed from JSON
  experience?: Array<{        // Parsed from JSON
    title: string
    company: string
    duration: string
    description?: string
  }>
  referrals?: Array<{         // Parsed from JSON
    organization: string
    type: string
    category: string
  }>
}
```

## Example: Deepak Sharma Full Data

### Raw from Database:
```json
{
  "id": "user_123abc",
  "name": "Deepak Sharma",
  "email": "deepak.sharma@example.com",
  "initials": "DS",
  "location": "Gurgaon, India",
  "bio": "Building financial technology solutions...",
  "profile": {
    "title": "Fintech for Financial Inclusion",
    "expertise": "[\"Digital Payments\", \"Microfinance Technology\", \"Blockchain\"]",
    "lookingFor": "[\"Investment Partners\", \"Banking Sector Connections\"]",
    "offering": "[\"Fintech Solutions\", \"Technical Architecture Guidance\"]",
    "experience": "[{\"title\": \"Founder\", \"company\": \"InclusivePay Tech\", \"duration\": \"5 years\"}]"
  }
}
```

### After Parsing:
```javascript
{
  id: "user_123abc",
  name: "Deepak Sharma",
  email: "deepak.sharma@example.com",
  initials: "DS",
  location: "Gurgaon, India",
  bio: "Building financial technology solutions...",
  expertise: ["Digital Payments", "Microfinance Technology", "Blockchain"],
  lookingFor: ["Investment Partners", "Banking Sector Connections"],
  offering: ["Fintech Solutions", "Technical Architecture Guidance"],
  experience: [
    {
      title: "Founder",
      company: "InclusivePay Tech",
      duration: "5 years",
      description: "..."
    }
  ]
}
```

### Rendered on UI:

**"I am looking for"**
- Investment Partners
- Banking Sector Connections
- Regulatory Expertise
- International Expansion Partners
- Blockchain Integration Specialists

**"I am offering"**
- Fintech Solutions
- Technical Architecture Guidance
- Financial Inclusion Strategy
- Payment Gateway Integration
- Regulatory Navigation Support

## Error Response Format

### 404 Not Found
```json
{
  "error": "User not found",
  "userId": "invalid-id-123"
}
```

### 500 Server Error
```json
{
  "error": "Database error: connection timeout",
  "code": "CONN_TIMEOUT"
}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Profile Page Component (/profile/[userId])          │  │
│  │  - useEffect: fetch('/api/users?id={userId}')        │  │
│  │  - Calls safeJsonParse() for JSON fields             │  │
│  │  - Transforms data to UserProfile interface          │  │
│  │  - Renders UI with parsed data                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────────────────────┘
             │ HTTP GET /api/users?id=xyz
┌────────────▼──────────────────────────────────────────────┐
│              Backend API (Next.js Route)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  app/api/users/route.ts                              │  │
│  │  - Gets userId from query params                     │  │
│  │  - Queries Supabase: SELECT * FROM User WHERE id     │  │
│  │  - Includes related Profile data                     │  │
│  │  - Returns User + Profile as JSON                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────────────────────┘
             │ Supabase Client
┌────────────▼──────────────────────────────────────────────┐
│           Database (PostgreSQL via Supabase)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Table                                          │  │
│  │  ├── id, email, name, location, bio                 │  │
│  │  └── Contains relations to Profile                  │  │
│  │                                                      │  │
│  │  Profile Table                                       │  │
│  │  ├── title, expertise (JSON string)                 │  │
│  │  ├── skills (JSON string)                           │  │
│  │  ├── lookingFor (JSON string) ← Our focus           │  │
│  │  ├── offering (JSON string) ← Our focus             │  │
│  │  ├── experience (JSON string)                       │  │
│  │  └── social links (strings)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## JSON Field Examples

### Looking For Array
```json
[
  "Investment Partners",
  "Banking Sector Connections",
  "Regulatory Expertise",
  "International Expansion Partners",
  "Blockchain Integration Specialists"
]
```

### Offering Array
```json
[
  "Fintech Solutions",
  "Technical Architecture Guidance",
  "Financial Inclusion Strategy",
  "Payment Gateway Integration",
  "Regulatory Navigation Support"
]
```

### Experience Array
```json
[
  {
    "title": "Founder at InclusivePay Tech",
    "company": "InclusivePay Tech",
    "duration": "5 years",
    "description": "Building financial technology solutions to bring banking services to underbanked populations across rural India."
  },
  {
    "title": "Product Manager at FinTech Startup",
    "company": "FinTech Startup",
    "duration": "6 years",
    "description": "Led product development for innovative payment solutions"
  },
  {
    "title": "Software Engineer at ICICI Bank",
    "company": "ICICI Bank",
    "duration": "3 years",
    "description": "Built banking software systems"
  }
]
```

---

**Note:** All JSON fields in the database are stored as strings and must be parsed before use in the frontend. The `safeJsonParse()` function handles this safely.
