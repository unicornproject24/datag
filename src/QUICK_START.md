# 🚀 DaWg Website - Quick Start Guide

## Step 0: Download Your Code from Figma Make 📥

Before deploying, you need to download your project files:

### From Figma Make:

1. **Click the Export/Download button** in Figma Make (usually top-right)
2. **Select "Download Project"** or similar option
3. **Save the ZIP file** to your computer
4. **Extract/Unzip** the downloaded file
5. ✅ You now have a folder with all your code!

---

## Step 1: Push to GitHub 🐙

Most hosting platforms connect to GitHub, so let's set that up first:

### Option A: Using GitHub Desktop (Easiest for Beginners)

1. **Download GitHub Desktop:**
   - Go to [desktop.github.com](https://desktop.github.com)
   - Download and install

2. **Sign in to GitHub:**
   - Open GitHub Desktop
   - Click "Sign in to GitHub.com"
   - Create account if you don't have one (it's free!)

3. **Create Repository:**
   - Click "File" → "Add Local Repository"
   - Navigate to your extracted project folder
   - If prompted, click "Create Repository"
   - Add description: "DaWg Website"
   - Click "Create Repository"

4. **Publish to GitHub:**
   - Click "Publish repository" button
   - Uncheck "Keep this code private" (or keep it checked if preferred)
   - Click "Publish repository"
   - ✅ Your code is now on GitHub!

### Option B: Using Command Line (For Developers)

1. **Open Terminal/Command Prompt** in your project folder

2. **Initialize Git:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Commit:**
   ```bash
   git commit -m "Initial commit - DaWg website"
   ```

5. **Create repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click "+" → "New repository"
   - Name it "DaWg-website"
   - Click "Create repository"

6. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/DaWg-website.git
   git branch -M main
   git push -u origin main
   ```
   
7. ✅ Your code is now on GitHub!

---

## Step 2: Deploy Your Site ⚡

Now that your code is on GitHub, choose your hosting platform:

### Vercel (Easiest - Recommended)

1. **Go to [vercel.com](https://vercel.com)**

2. **Sign up:**
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub

3. **Import Project:**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find "DaWg-website" and click "Import"

4. **Configure Project:**
   - Project Name: `DaWg-website` (or your choice)
   - Framework Preset: Vite (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (should be filled)
   - Output Directory: `dist` (should be filled)
   - Click "Deploy"

5. **Wait for deployment** (1-2 minutes)

6. ✅ Done! You'll get a URL like `DaWg-website.vercel.app`

### Netlify

1. **Go to [netlify.com](https://netlify.com)**

2. **Sign up:**
   - Click "Sign up"
   - Choose "GitHub" to sign up
   - Authorize Netlify

3. **Deploy Site:**
   - Click "Add new site" → "Import an existing project"
   - Click "GitHub"
   - Authorize Netlify to access repositories
   - Find and select "DaWg-website"

4. **Configure Build:**
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

5. **Wait for deployment** (1-2 minutes)

6. ✅ Done! You'll get a URL like `DaWg-website.netlify.app`

### GitHub Pages (Free but takes longer)

1. **Go to your repository** on GitHub
   - URL: `github.com/YOUR-USERNAME/DaWg-website`

2. **Enable GitHub Pages:**
   - Click "Settings" tab
   - Scroll to "Pages" in left sidebar
   - Under "Source", select "GitHub Actions"

3. **Create deployment workflow:**
   - Click "Actions" tab
   - Click "New workflow"
   - Search for "Static Site"
   - Click "Configure" on the first result
   - Click "Commit changes"

4. **Wait for deployment** (2-3 minutes)

5. ✅ Done! Your site will be at `YOUR-USERNAME.github.io/DaWg-website`

---

## Step 3: Initialize Your Database 🗄️

After deployment:

1. **Visit:** `your-site-url.com/#admin`
2. **Click:** "Initialize Database" button
3. **Wait:** A few seconds for confirmation
4. ✅ Your site now has demo content!

---

## Step 4: Edit Your Content ✏️

### Access Admin Panel

**URL:** `your-site.com/#admin`

**Tip:** Bookmark this URL for easy access!

### What You Can Edit

#### 👥 Team Members
- Add/edit/remove team members
- Upload profile photos
- Update bios and expertise

#### 📝 Blog Posts
- Create new blog posts
- Edit existing posts
- Manage authors and dates

#### 🔬 Research Projects
- Add new projects
- Update project status
- Manage tags and descriptions

#### 🤝 Partners
- Add partner organizations
- Specify partnership types
- Update collaboration details

---

## Step 5: Customize Your Content 🎨

### Replace Demo Content

1. Go to admin panel
2. Click on any item's edit button (✏️)
3. Update with your real information
4. Click "Save"
5. Refresh your main site to see changes

### Add New Content

1. Click "+ Add [Item Type]" button
2. Fill in all fields
3. Click "Save"
4. ✅ New content appears immediately!

---

## 📱 Your Site URLs

Once deployed, your site will have these pages:

| Page | URL |
|------|-----|
| **Home** | `your-site.com/` or `your-site.com/#home` |
| **About** | `your-site.com/#about` |
| **Team** | `your-site.com/#team` |
| **Research** | `your-site.com/#research` |
| **Blog** | `your-site.com/#blog` |
| **Partners** | `your-site.com/#partners` |
| **Admin** | `your-site.com/#admin` |

---

## 🎯 Quick Admin Panel Tour

### Tab 1: Team Members
- ➕ Add new team members
- ✏️ Edit existing members
- 🗑️ Remove members

**Fields:**
- Name, Role, Bio
- Expertise (comma-separated)
- Image URL

### Tab 2: Blog Posts
- ➕ Create new posts
- ✏️ Edit existing posts
- 🗑️ Delete posts

**Fields:**
- Title, Excerpt
- Author, Date, Read Time
- Author Image URL

### Tab 3: Research Projects
- ➕ Add new projects
- ✏️ Update projects
- 🗑️ Remove projects

**Fields:**
- Title, Description
- Status (Active/Planning/Completed)
- Tags, Image URL

### Tab 4: Partners
- ➕ Add partners
- ✏️ Edit partners
- 🗑️ Remove partners

**Fields:**
- Name, Type
- Description

---

## 💡 Pro Tips

### 🔒 Keep Admin Panel Private
- Don't share the `/#admin` URL publicly
- Consider adding password protection later
- The admin link in the footer is subtle (low opacity)

### 📸 Image URLs
**Where to get image URLs:**
- Upload to [Imgur](https://imgur.com) (free)
- Use [Unsplash](https://unsplash.com) for stock photos
- Use [Cloudinary](https://cloudinary.com) for professional hosting

**How to get URL:**
1. Upload image
2. Right-click → "Copy image address"
3. Paste into admin panel

### ✍️ Writing Tips
- **Titles:** Keep under 60 characters
- **Descriptions:** 2-3 sentences
- **Dates:** Use YYYY-MM-DD format (e.g., 2025-11-22)
- **Tags:** Separate with commas (e.g., "AI, Ethics, Privacy")

### 🔄 Regular Updates
- Update team photos quarterly
- Add blog posts weekly/monthly
- Review project statuses monthly
- Update partner list as needed

---

## ⚡ Quick Actions Reference

### Adding a Team Member (30 seconds)
1. Admin → Team Members tab
2. Click "+ Add Team Member"
3. Fill: Name, Role, Bio, Expertise, Image URL
4. Click "Save"
5. ✅ Done!

### Publishing a Blog Post (1 minute)
1. Admin → Blog Posts tab
2. Click "+ Add Blog Post"
3. Fill: Title, Excerpt, Author, Date, Read Time
4. Add author image URL
5. Click "Save"
6. ✅ Published!

### Updating a Project (45 seconds)
1. Admin → Research tab
2. Click edit (✏️) on project
3. Update fields
4. Click "Save"
5. ✅ Updated!

---

## 🐛 Troubleshooting

### "Can't access admin panel"
✅ **Solution:** Make sure URL includes `/#admin` (with the hash)

### "Initialize Database button doesn't work"
✅ **Solution:** 
- Refresh the page
- Check browser console for errors
- Verify Supabase is connected

### "Changes not showing on main site"
✅ **Solution:**
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache
- Wait a few seconds for changes to propagate

### "Images not loading"
✅ **Solution:**
- Verify image URL works in new tab
- Use HTTPS URLs (not HTTP)
- Try different image host
- Check image URL has no typos

---

## 📚 Additional Resources

**Detailed Guides:**
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `CONTENT_EDITING_GUIDE.md` - Comprehensive editing reference
- `LOCAL_DEVELOPMENT.md` - For developers
- `README.md` - Technical overview

**External Resources:**
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✅ Checklist: First Week with Your Site

**Day 1: Deploy & Initialize**
- [ ] Deploy to hosting platform
- [ ] Initialize database via admin panel
- [ ] Verify all pages load correctly

**Day 2-3: Replace Demo Content**
- [ ] Update team member information
- [ ] Replace demo blog posts with real content
- [ ] Update research project details
- [ ] Add real partner information

**Day 4-5: Customize**
- [ ] Upload actual team photos
- [ ] Write first blog post
- [ ] Update project statuses
- [ ] Test on mobile devices

**Day 6-7: Polish & Share**
- [ ] Final content review
- [ ] Test all links and images
- [ ] Share with team for feedback
- [ ] Go live and share publicly!

---

## 🎉 You're Ready!

Your DaWg website is ready to go live. Here's what you have:

✅ **Professional multi-page website**
✅ **Easy-to-use admin panel**
✅ **Database-backed content management**
✅ **Responsive design for all devices**
✅ **Beautiful pastel design**
✅ **Ready for deployment**

**Next Steps:**
1. Deploy your site (5 minutes)
2. Initialize database (30 seconds)
3. Start customizing (your own pace)

---

**Questions?** Check the detailed guides in the project root:
- `DEPLOYMENT_GUIDE.md`
- `CONTENT_EDITING_GUIDE.md`
- `LOCAL_DEVELOPMENT.md`

**Good luck with your DaWg website! 🐕✨**