# Environment Variables Setup Guide

This document ensures secure handling of environment variables in the Piko FG Artist Website project.

## ✅ Security Status

### Git Protection
- ✅ `.env.local` is explicitly listed in `.gitignore` (line 48)
- ✅ `.env*` pattern blocks all environment files (line 34)
- ✅ `.env.example` is allowed (exception rule)
- ✅ **Your secrets are protected from being committed to GitHub**

### Code Integration
All environment variables are correctly accessed via `process.env`:

**Files Using Environment Variables:**
1. `src/lib/supabase.ts` - Client-side Supabase configuration
2. `src/middleware.ts` - Server-side authentication middleware

**Variable Names:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**No Hardcoded Values Found:**
✅ All Supabase credentials are properly loaded from environment variables
✅ No API keys or URLs are hardcoded in the source code

## 📋 Setup Instructions

### 1. Create `.env.local` File

Create a `.env.local` file in the project root with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" → use for `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the "anon public" key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Verify `.env.local` is Ignored

The `.gitignore` file includes:
```
.env*
!.env.example
.env.local
```

This ensures:
- ✅ `.env.local` will never be committed
- ✅ `.env.example` can be committed (template only)
- ✅ All other `.env*` files are ignored

### 3. Use `.env.example` as Template

The `.env.example` file serves as a template for other developers:
- Contains the exact variable names needed
- Uses placeholder values (`your-project-url`, `your-anon-key`)
- Can be safely committed to version control

## 🔍 Verification Checklist

- [x] `.env.local` exists with your actual credentials
- [x] `.env.local` is listed in `.gitignore`
- [x] `.env.example` exists with placeholder values
- [x] All code uses `process.env.NEXT_PUBLIC_*` variables
- [x] No hardcoded credentials in source code
- [x] Environment variables are validated before use

## 🚨 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` but always double-check before committing
2. **Use different keys for dev/prod** - Create separate Supabase projects if needed
3. **Rotate keys if exposed** - If keys are ever committed, rotate them immediately
4. **Use `.env.example`** - Always update the example file when adding new variables
5. **Validate in code** - Both `supabase.ts` and `middleware.ts` validate variables exist

## 📝 Code Locations

### Environment Variable Usage

**`src/lib/supabase.ts`** (Client-side):
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

**`src/middleware.ts`** (Server-side):
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  return NextResponse.next();
}
```

## 🔄 Adding New Environment Variables

If you need to add new environment variables:

1. Add to `.env.local` with your actual value
2. Add to `.env.example` with a placeholder
3. Update this documentation
4. Use `NEXT_PUBLIC_` prefix for client-side variables
5. Access via `process.env.NEXT_PUBLIC_*` in code

## ✅ Current Status

**All security measures are in place:**
- ✅ Git protection configured
- ✅ Code uses environment variables correctly
- ✅ No hardcoded credentials
- ✅ Validation implemented
- ✅ Documentation updated

**Your `.env.local` file is secure and will never be committed to GitHub.**

---

**Last Updated:** $(date)
**Verified:** Environment variables are properly secured

