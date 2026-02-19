# Local Development Guide

Quick reference for running and testing the DAWG website locally.

## 🏃 Running Locally

This project is built with Figma Make, which handles the development server for you.

### In Figma Make

Simply click the "Preview" button to see your site running locally. Changes will hot-reload automatically.

### After Downloading

If you've downloaded the project and want to run it locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:5173
```

---

## 🧪 Testing Before Deployment

### Checklist

Before deploying to production:

- [ ] Test all pages load correctly
- [ ] Test navigation between pages
- [ ] Test admin panel (`/#admin`)
- [ ] Initialize database and test content management
- [ ] Test on mobile viewport
- [ ] Test on different browsers
- [ ] Check all images load
- [ ] Verify all links work

### Page URLs to Test

- `http://localhost:5173/` - Home page
- `http://localhost:5173/#about` - About page
- `http://localhost:5173/#team` - Team page
- `http://localhost:5173/#research` - Research page
- `http://localhost:5173/#blog` - Blog page
- `http://localhost:5173/#partners` - Partners page
- `http://localhost:5173/#admin` - Admin panel

---

## 🔧 Making Changes

### Editing Content

**Option 1 - Via Admin Panel (Recommended):**
1. Navigate to `/#admin`
2. Use the admin interface to add/edit/delete content
3. Changes are saved to the database

**Option 2 - Edit Code Directly:**
If you want to change the default content in the code:
1. Edit the initialization data in `/supabase/functions/server/index.tsx`
2. Look for the `initialize-data` route
3. Modify the arrays of team members, blog posts, etc.
4. Re-run the initialize endpoint

### Updating Styles

1. Edit `/styles/globals.css` for global styles
2. Edit individual component files for component-specific styles
3. Use Tailwind classes for utility-based styling

### Adding New Features

1. Create new components in `/components`
2. Add new pages in `/pages`
3. Update routing in `/App.tsx`
4. Update navigation in `/components/Navigation.tsx`

---

## 🗄️ Database Management

### Viewing Database Content

The Supabase database uses a key-value store. To view content:

1. Check the browser console while on the admin panel
2. Inspect API responses
3. Use Supabase dashboard (if you have access)

### Resetting Database

To start fresh:

1. Delete all keys with the appropriate prefix:
   - `team_member:*`
   - `blog_post:*`
   - `research_project:*`
   - `partner:*`

2. Click "Initialize Database" in the admin panel

### Backing Up Content

Currently, content is stored in Supabase's key-value store. To backup:

1. Go to admin panel
2. Manually copy content from forms
3. Save to a text file or spreadsheet

**Future Enhancement:** Add export/import functionality to admin panel

---

## 🐛 Common Development Issues

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill the process using port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

### Issue: Supabase connection errors

**Solution:**
1. Verify Supabase is running
2. Check `/utils/supabase/info.tsx` for correct credentials
3. Ensure edge function is deployed

### Issue: Changes not showing

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Restart development server
4. Check browser console for errors

### Issue: Admin panel won't load

**Solution:**
1. Ensure you're at `/#admin` (note the hash)
2. Check browser console for errors
3. Verify the route is in App.tsx

---

## 📁 File Organization

```
project-root/
│
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # React components
│   │   ├── ui/         # UI library components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx
│   │   ├── AdminPage.tsx
│   │   └── ...
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main app
│
├── supabase/           # Backend
│   └── functions/
│       └── server/
│           └── index.tsx
│
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
└── README.md
```

---

## 🎨 Customization

### Changing Colors

Edit `/styles/globals.css`:

```css
:root {
  --primary: #7BB3C0;      /* Your primary color */
  --secondary: #C5E3F6;    /* Your secondary color */
  --accent: #B2C9AB;       /* Your accent color */
  --background: #FAF9F6;   /* Background color */
}
```

### Adding New Pages

1. Create new page component in `/pages`:
```tsx
// /pages/NewPage.tsx
export function NewPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Your content */}
    </div>
  );
}
```

2. Import in `/App.tsx`:
```tsx
import { NewPage } from "./pages/NewPage";
```

3. Add route in `renderPage()`:
```tsx
case "newpage":
  return <NewPage />;
```

4. Add navigation link in `/components/Navigation.tsx`

---

## 🚀 Building for Production

### Create Production Build

```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Preview Production Build

```bash
npm run preview
```

### Check Build Size

```bash
# After building
du -sh dist
```

Target: Keep under 2MB for best performance

---

## 📊 Performance Tips

### Optimize Images

- Use WebP format when possible
- Compress images before uploading
- Use appropriate image sizes (don't use 4K images for thumbnails)

### Code Splitting

The app already uses React lazy loading where appropriate. For additional optimization:
- Split large components
- Load heavy libraries only when needed

### Caching

Configure caching headers in your hosting platform:
- Cache static assets (JS, CSS, images) for 1 year
- Cache HTML files for shorter periods (1 hour to 1 day)

---

## 🔍 Debugging

### Enable Verbose Logging

Add to console for debugging:

```tsx
// In any component
useEffect(() => {
  console.log('Component mounted', { data });
}, [data]);
```

### React DevTools

Install React DevTools browser extension for:
- Component inspection
- Props/state viewing
- Performance profiling

### Network Tab

Check browser Network tab for:
- API call failures
- Slow loading resources
- 404 errors

---

## 📝 Development Workflow

### Recommended Flow

1. **Plan** your changes
2. **Create** a feature branch (if using git)
3. **Make** changes locally
4. **Test** thoroughly
5. **Commit** with clear message
6. **Deploy** to staging (if available)
7. **Test** in staging
8. **Deploy** to production

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request (optional)
```

---

## 🆘 Getting Help

### Resources

- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com
- **Supabase Docs:** https://supabase.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

### Common Questions

**Q: How do I add authentication to admin panel?**
A: See Supabase auth documentation for implementation guide

**Q: Can I use a different database?**
A: Yes, but you'll need to modify the server endpoints in `/supabase/functions/server/index.tsx`

**Q: How do I add new fields to team members?**
A: Update the form in AdminPage.tsx and the data structure in server/index.tsx

---

Happy coding! 💻
