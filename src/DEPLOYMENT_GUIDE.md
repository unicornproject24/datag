# DAWG Website Deployment Guide

This guide will help you deploy your Data Well-being Group website and set up the content management system.

## 🚀 Quick Start

### Step 1: Initialize the Database

1. Visit your deployed site at `your-site-url.com/#admin`
2. Click the "Initialize Database" button
3. This will populate the database with your current team members, blog posts, research projects, and partners

### Step 2: Manage Content

Access the admin panel at `your-site-url.com/#admin` to:
- ✏️ Add, edit, or delete team members
- 📝 Create and manage blog posts
- 🔬 Update research projects
- 🤝 Manage partners and collaborators

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Free tier is generous

**Steps:**

1. **Download your code** from Figma Make
2. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/dawg-website.git
   git push -u origin main
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect settings
   - Click "Deploy"

4. **Done!** Your site is live in ~2 minutes

---

### Option 2: Netlify

**Why Netlify?**
- Easy drag-and-drop deployment
- Form handling
- Split testing features

**Steps:**

1. **Download your code** from Figma Make

2. **Option A - Drag & Drop (Fastest):**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign up
   - Drag the `dist` folder (after building) to the drop zone
   - Done!

3. **Option B - GitHub Integration:**
   - Create a GitHub repository (same as Vercel steps)
   - Go to Netlify
   - Click "New site from Git"
   - Connect to GitHub
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`
   - Deploy!

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Completely free
- Built into GitHub
- Great for open-source projects

**Steps:**

1. **Create a GitHub repository** with your code

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to "Pages"
   - Select branch: `main`
   - Select folder: `/` (root)
   - Save

3. **Add deployment script** to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm install -g gh-pages
   npm run deploy
   ```

5. **Access your site** at `https://yourusername.github.io/dawg-website`

---

### Option 4: Cloudflare Pages

**Why Cloudflare?**
- Ultra-fast global CDN
- Excellent performance
- Free tier with unlimited bandwidth

**Steps:**

1. **Create a GitHub repository** with your code

2. **Deploy to Cloudflare Pages:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up
   - Click "Create a project"
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Build output: `dist`
   - Deploy!

---

## 🔧 Build Configuration

Your site is already configured with the necessary build files:
- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration
- ✅ Hash-based routing for GitHub Pages compatibility

No additional configuration needed!

---

## 📝 Managing Content

### Accessing the Admin Panel

Navigate to: `your-site-url.com/#admin`

The admin panel lets you:

#### Team Members
- Add new team members with photos, bios, and expertise
- Update existing member information
- Remove team members

#### Blog Posts
- Create new blog posts with title, excerpt, author, and date
- Edit existing posts
- Delete posts

#### Research Projects
- Add research projects with descriptions, status, and tags
- Update project information
- Mark projects as Active, Planning, or Completed

#### Partners
- Add new partner organizations
- Specify partner type (Academic, Industry, Community, etc.)
- Update or remove partners

### Content Structure

All content is stored in **Supabase's key-value store**, which means:
- ✅ No complex database setup needed
- ✅ Fast read/write operations
- ✅ Built-in for your Figma Make project
- ✅ Automatically backed up

---

## 🎨 Customization Tips

### Updating Brand Colors

The site uses CSS custom properties. To change colors, edit `/styles/globals.css`:

```css
:root {
  --primary: #7BB3C0;      /* Pastel blue */
  --secondary: #C5E3F6;    /* Light blue */
  --accent: #B2C9AB;       /* Sage green */
  --background: #FAF9F6;   /* Earthy natural */
}
```

### Adding a Custom Domain

**Vercel:**
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

**Netlify:**
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

---

## 🔒 Security Notes

### Admin Panel Access

Currently, the admin panel (`/#admin`) is publicly accessible. For production:

**Option 1 - Simple Password Protection:**
Add a password check in AdminPage.tsx before rendering the admin interface

**Option 2 - Supabase Auth (Recommended):**
Implement Supabase authentication for secure admin access

**Option 3 - Hide Admin Link:**
Don't link to the admin panel from the main navigation. Only access via direct URL.

---

## 📱 Testing Your Deployment

After deploying, test:
- ✅ All pages load correctly (Home, About, Team, Research, Blog, Partners)
- ✅ Navigation works
- ✅ Admin panel is accessible
- ✅ Can add/edit/delete content
- ✅ Mobile responsiveness
- ✅ Images load properly

---

## 🆘 Troubleshooting

### Issue: Pages show 404 on refresh
**Solution:** Your hosting platform needs to redirect all routes to `index.html`. The `vercel.json` and `netlify.toml` files handle this.

### Issue: Admin panel doesn't load data
**Solution:** 
1. Check browser console for errors
2. Verify Supabase is running
3. Click "Initialize Database" in the admin panel

### Issue: Can't save content
**Solution:**
1. Check browser console for API errors
2. Verify the Supabase server is running
3. Ensure you've initialized the database

---

## 🎉 Next Steps

After deployment:

1. **Initialize your database** via the admin panel
2. **Customize content** with your actual team members and projects  
3. **Update images** - replace placeholder images with real photos
4. **Add your domain** for a professional look
5. **Share your site!**

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **GitHub Pages:** https://pages.github.com
- **Cloudflare Pages:** https://developers.cloudflare.com/pages

---

## 🌟 Pro Tips

1. **Backup your data:** Regularly export your content from the admin panel
2. **Test locally first:** Run `npm run dev` to test changes before deploying
3. **Use git branches:** Create a development branch for testing new features
4. **Monitor your site:** Set up uptime monitoring with services like UptimeRobot (free)
5. **Analytics:** Add Google Analytics or Plausible to track visitors

---

Good luck with your deployment! 🚀
