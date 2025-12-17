# What is Migration SQL? 🤔

## Simple Explanation

**Migration SQL** is a script that sets up your database structure. Think of it like building the foundation and rooms of a house before you can live in it.

## What Does It Do?

The migration file (`supabase/migrations/001_initial_schema.sql`) creates:

1. **Tables** - Like folders to store data:
   - `profiles` - User profile information
   - `bucket_items` - Your bucket list items
   - `matches` - Matches between users
   - `messages` - Chat messages

2. **Indexes** - Like a book index, helps find data faster

3. **Security Rules (RLS)** - Makes sure users can only see their own data

4. **Triggers** - Automatic actions (like creating a profile when a user signs up)

## Do You Need It?

**YES!** You need to run it **once** when you first set up the project. Without it, your app won't work because the database tables don't exist yet.

## How to Run It

1. Go to your Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL Editor
6. Click **Run**

That's it! Takes 10 seconds. You only do this once.

## What If I Skip It?

Your app will crash with errors like:
- "relation 'profiles' does not exist"
- "permission denied"
- "table not found"

So yes, you need it! 😊

## Can I Run It Multiple Times?

Yes! The SQL uses `IF NOT EXISTS` so it's safe to run multiple times. It won't break anything if you run it again.

---

**TL;DR**: Run the migration SQL once to create your database structure. It's like setting up the foundation of your house before you can move in!

