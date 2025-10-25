# Database Policy Fix - Infinite Recursion

## Problem Identified

**Error:** "infinite recursion detected in policy for relation users"

### Root Causes (Triple-Checked):

1. **Infinite Recursion in Admin Policy**
   - The "Admins can view all users" policy had this logic:
   ```sql
   EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
   ```
   - This queries the `users` table to check if user is admin
   - But querying `users` triggers the SELECT policies again
   - Which queries `users` again → infinite loop

2. **Missing INSERT Policy**
   - No policy existed to allow INSERT operations
   - Users couldn't be created during signup
   - RLS blocked all inserts

3. **RLS Enabled Without Complete Policies**
   - Row Level Security was enabled
   - But policies didn't cover all operations

## Solution Applied

### Migration: `fix_users_table_policies`

**1. Fixed Admin Policy (No More Recursion)**
```sql
DROP POLICY "Admins can view all users" ON users;

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING ((auth.jwt()->>'is_admin')::boolean = true);
```
- Now uses `auth.jwt()` directly
- No table query = no recursion
- Checks JWT claim instead of database

**2. Added INSERT Policy**
```sql
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```
- Allows users to create their own record
- Validates that user ID matches auth ID

**3. Enforced RLS**
```sql
ALTER TABLE users FORCE ROW LEVEL SECURITY;
```
- Ensures service role also respects policies

## Final Policy Configuration

| Policy Name | Command | Logic | Purpose |
|------------|---------|-------|---------|
| Users can insert own data | INSERT | `auth.uid() = id` | Allow user creation during signup |
| Admins can view all users | SELECT | `auth.jwt()->>'is_admin' = true` | Admins see all users (no recursion) |
| Users can view own data | SELECT | `auth.uid() = id` | Users see their own data |
| Users can update own data | UPDATE | `auth.uid() = id` | Users update their own data |

## Verification

✅ No policies query the `users` table (no recursion possible)
✅ INSERT policy exists for user creation
✅ SELECT policies work for both users and admins
✅ UPDATE policy allows profile updates
✅ All policies use `auth.uid()` or `auth.jwt()` (no table queries)

## Testing

The onboarding flow should now work:
1. User signs up → INSERT policy allows user creation
2. User enters name → UPDATE policy allows profile update
3. User continues onboarding → UPDATE policy allows all updates
4. No infinite recursion errors

## Why This Happened

The original admin policy was trying to be "smart" by checking the database to see if a user is an admin. But this created a circular dependency:
- To SELECT from users → check if admin
- To check if admin → SELECT from users
- To SELECT from users → check if admin (infinite loop)

The fix uses JWT claims which are already in memory, avoiding any database queries.
