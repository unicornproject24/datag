# 📘 Netlify Deployment - Complete Step-by-Step Guide

This guide walks you through deploying your DAWG website to Netlify with **detailed** instructions for absolute beginners.

---

## 🎯 Overview: What You'll Do

1. Download code from Figma Make
2. Upload code to GitHub (using GitHub Desktop - easiest way)
3. Connect GitHub to Netlify
4. Deploy your site
5. Initialize the database

**Total Time:** 15-20 minutes

---

## Part 1: Download Your Code (2 minutes)

### Step 1.1: Export from Figma Make

1. In Figma Make, look for the **Export** or **Download** button
   - Usually in the top-right corner
   - May say "Download Project" or have a download icon ⬇️

2. Click it and wait for the download to complete

3. **Find the downloaded file** (probably in your Downloads folder)
   - It will be a ZIP file named something like `dawg-website.zip`

4. **Extract/Unzip the file:**
   - **Windows:** Right-click → "Extract All"
   - **Mac:** Double-click the ZIP file
   - This creates a folder with all your code

5. ✅ **Remember where this folder is!** You'll need it in the next step

---

## Part 2: Upload to GitHub (5-7 minutes)

You have two options. **Option A is much easier for beginners.**

### Option A: Using GitHub Desktop (Recommended for Beginners)

#### Step 2.1: Download GitHub Desktop

1. Go to **[desktop.github.com](https://desktop.github.com)**
2. Click **"Download for [Your OS]"**
3. Install the application (just like any other program)
4. Open GitHub Desktop when installation is complete

#### Step 2.2: Create GitHub Account (if you don't have one)

1. In GitHub Desktop, click **"Sign in to GitHub.com"**
2. Click **"Create your free account"**
3. Fill in:
   - Username (e.g., "dawg-research")
   - Email address
   - Password
4. Verify your email
5. Come back to GitHub Desktop and sign in

#### Step 2.3: Add Your Project to GitHub Desktop

1. In GitHub Desktop, click **"File"** → **"Add Local Repository"**

2. Click **"Choose..."** button

3. Navigate to the extracted folder from Part 1
   - This is the folder containing your code
   - It should have files like `App.tsx`, `package.json`, etc.

4. Select the folder and click **"Open"** or **"Select"**

5. You'll see a message: **"This directory does not appear to be a Git repository"**
   - This is normal! Click **"Create a Repository"**

6. Fill in the form:
   - **Name:** `dawg-website` (or whatever you prefer)
   - **Description:** "DAWG Research Group Website"
   - **Keep "Git Ignore" as "Node"**
   - Leave "License" as "None"

7. Click **"Create Repository"**

#### Step 2.4: Publish to GitHub

1. You should now see a button that says **"Publish repository"**
   - If you don't see it, look in the top toolbar

2. Click **"Publish repository"**

3. A dialog will appear:
   - **Name:** `dawg-website` (already filled)
   - **Description:** Your description from before
   - **Keep this code private:** 
     - ✅ CHECK this if you want the code private
     - ⬜ UNCHECK if you want it public (either is fine)
   - **Organization:** Leave as "None" unless you have one

4. Click **"Publish Repository"**

5. Wait 10-30 seconds for upload to complete

6. ✅ **Success!** Your code is now on GitHub!
   - You can verify by going to `github.com/YOUR-USERNAME/dawg-website`

### Option B: Without GitHub Desktop (For Developers)

If you're comfortable with command line:

```bash
# Navigate to your project folder
cd path/to/your/extracted/folder

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on github.com first (click + → New repository)
# Then:
git remote add origin https://github.com/YOUR-USERNAME/dawg-website.git
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy to Netlify (5-8 minutes)

### Step 3.1: Create Netlify Account

1. Go to **[netlify.com](https://netlify.com)**

2. Click **"Sign up"** (top right)

3. Click **"GitHub"** button
   - This lets you sign in with your GitHub account
   - It's easier than creating a separate account

4. Click **"Authorize Netlify"**
   - This lets Netlify access your GitHub repositories

5. You'll be redirected to your Netlify dashboard

### Step 3.2: Create New Site

1. On the Netlify dashboard, click **"Add new site"**
   - It's a button usually in the top-right area
   - May say "Add new site" or "New site from Git"

2. Click **"Import an existing project"**

3. Click the **"GitHub"** button
   - Under "Connect to Git provider"

4. You may need to **authorize Netlify** again
   - Click "Authorize Netlify"
   - If asked, select "All repositories" or just "dawg-website"
   - Click the green button to confirm

### Step 3.3: Select Your Repository

1. You should now see a list of your GitHub repositories

2. Find **"dawg-website"** (or whatever you named it)
   - Use the search box if you have many repos

3. Click on **"dawg-website"**

### Step 3.4: Configure Build Settings

You'll see a configuration page. Here's what to enter:

1. **Owner:**
   - Should already show your account name
   - Leave as is

2. **Branch to deploy:**
   - Select **"main"**
   - This should be pre-selected

3. **Build command:**
   - Enter: `npm run build`
   - This tells Netlify how to build your site

4. **Publish directory:**
   - Enter: `dist`
   - This is where your built files will be

5. **Advanced build settings** (click to expand if needed):
   - No need to add environment variables yet
   - The Supabase keys are already in the code

6. **Everything else:**
   - Leave all other fields as they are

7. Click **"Deploy [site name]"** button at the bottom
   - The button might say "Deploy site" or "Deploy dawg-website"

### Step 3.5: Wait for Deployment

1. You'll see a deployment progress page
   - Shows "Site deploy in progress"
   - Has a progress indicator

2. **Wait 1-3 minutes** for the build to complete
   - You can watch the logs scroll by
   - Green checkmarks = good!
   - Red X = something went wrong (see troubleshooting below)

3. When complete, you'll see:
   - ✅ **"Site is live"** message
   - A URL like: `random-name-12345.netlify.app`

4. Click the URL to see your live site!

### Step 3.6: Rename Your Site (Optional)

The auto-generated name isn't pretty. Let's change it:

1. On your site's Netlify dashboard, click **"Site settings"**

2. Click **"Change site name"** (under "Site information")

3. Enter a new name:
   - Example: `dawg-research`
   - Must be unique across all Netlify sites
   - Can only use letters, numbers, and hyphens

4. Click **"Save"**

5. ✅ Your new URL: `dawg-research.netlify.app`

---

## Part 4: Initialize Your Database (1 minute)

Your site is live, but it needs data!

### Step 4.1: Access Admin Panel

1. Go to your deployed site
   - Example: `dawg-research.netlify.app`

2. Add `/#admin` to the end of the URL
   - Full URL: `dawg-research.netlify.app/#admin`

3. Press Enter

4. You should see the **Admin Panel** page
   - Has tabs: Team Members, Blog Posts, Research, Partners

### Step 4.2: Initialize Database

1. You'll see a blue box that says:
   - **"It looks like the database is empty"**
   - With a button: **"Initialize Database"**

2. Click the **"Initialize Database"** button

3. Wait 5-10 seconds

4. You should see a popup: **"Data initialized successfully!"**

5. Click **OK**

6. ✅ The admin panel now shows all your demo content!

### Step 4.3: Verify Your Site

1. Go back to your main site
   - Remove the `#admin` from URL
   - Just: `dawg-research.netlify.app`

2. Click through each page:
   - Home ✓
   - About ✓
   - Team ✓ (should show 5 team members)
   - Research ✓ (should show 6 projects)
   - Blog ✓ (should show 6 blog posts)
   - Partners ✓ (should show 9 partners)

3. ✅ **Success!** Your site is fully live with content!

---

## Part 5: Edit Your Content (Ongoing)

### Step 5.1: Access Admin Panel

1. Go to: `your-site.netlify.app/#admin`
2. **Bookmark this page!** You'll use it often

### Step 5.2: Edit Demo Content

Let's replace a team member as an example:

1. Click the **"Team Members"** tab

2. Find the first team member (Dr. Sarah Chen)

3. Click the **pencil icon** ✏️ on the right

4. A form appears - update the fields:
   - **Name:** Change to your actual team member's name
   - **Role:** Update the role
   - **Bio:** Write a real bio
   - **Expertise:** Update the expertise areas
   - **Image URL:** Upload a photo to Imgur, copy the URL

5. Click **"Save"**

6. Go back to your main site and click **"Team"**
   - You'll see your changes immediately!

7. ✅ Repeat for all team members!

### Step 5.3: Add New Content

Let's add a new blog post:

1. In admin panel, click **"Blog Posts"** tab

2. Click **"+ Add Blog Post"** button

3. Fill in all fields:
   - **Title:** Your blog post title
   - **Excerpt:** Short 1-2 sentence summary
   - **Author:** Author's name
   - **Author Image URL:** Photo URL
   - **Date:** Today's date (format: YYYY-MM-DD, like 2025-11-22)
   - **Read Time:** Estimate (e.g., "5 min read")

4. Click **"Save"**

5. Go to your Blog page on the site
   - Your new post appears at the top!

6. ✅ Repeat to add more posts!

---

## 🎉 You're Done!

### What You Now Have:

✅ **Live website** at `your-site.netlify.app`
✅ **Database** with demo content
✅ **Admin panel** to manage everything
✅ **GitHub repository** with your code
✅ **Auto-deployment** - push to GitHub = auto-update site

### Important URLs to Bookmark:

1. **Your live site:** `your-site.netlify.app`
2. **Admin panel:** `your-site.netlify.app/#admin`
3. **Netlify dashboard:** `app.netlify.com`
4. **GitHub repo:** `github.com/YOUR-USERNAME/dawg-website`

---

## 🔄 Updating Your Site (Future)

When you want to make code changes:

1. Edit files locally or in GitHub
2. Commit changes
3. Push to GitHub (or use GitHub Desktop's "Push" button)
4. Netlify automatically rebuilds and deploys
5. Wait 1-2 minutes
6. ✅ Changes are live!

For content changes, just use the admin panel - no deployment needed!

---

## 🐛 Troubleshooting

### "Build failed" on Netlify

**Solution:**
1. Click on the failed build
2. Check the logs for errors
3. Common issue: Missing dependencies
   - Netlify should auto-install, but if not:
   - Make sure `package.json` is in your repo
4. Try clicking "Retry deploy"

### "Can't find repository in Netlify"

**Solution:**
1. Go to Netlify dashboard
2. Click "Add new site" again
3. Click "GitHub"
4. Click "Configure Netlify on GitHub"
5. Grant access to your repository
6. Try importing again

### "Admin panel shows 'can't connect'"

**Solution:**
1. Check browser console (F12) for errors
2. Make sure you clicked "Initialize Database"
3. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check that Supabase environment variables are set (should be automatic)

### "Images not loading"

**Solution:**
1. Verify image URLs are valid (open in new tab)
2. Use HTTPS URLs (not HTTP)
3. Try uploading to Imgur instead
4. Make sure URL has no spaces or special characters

---

## 📞 Need More Help?

- **Netlify Help:** [docs.netlify.com](https://docs.netlify.com)
- **GitHub Help:** [docs.github.com](https://docs.github.com)
- **Check other guides:**
  - `CONTENT_EDITING_GUIDE.md` - How to edit content
  - `DEPLOYMENT_GUIDE.md` - Alternative deployment methods
  - `LOCAL_DEVELOPMENT.md` - For code changes

---

## ✅ Final Checklist

Before you close this guide, make sure you've:

- [ ] Downloaded code from Figma Make
- [ ] Uploaded to GitHub using GitHub Desktop
- [ ] Created Netlify account
- [ ] Deployed site to Netlify
- [ ] Visited your live site URL
- [ ] Initialized database in admin panel
- [ ] Verified all pages work
- [ ] Bookmarked admin panel URL
- [ ] Tested editing at least one piece of content

**All checked?** 🎉 **You're a deployment pro!**

---

Good luck with your DAWG website! 🐕✨