# DaWg Website

A modern, responsive website for the Data Well-being Group (DaWg) research team, featuring a clean design with pastel colors, content management system, and multi-page navigation.

## ✨ Features

- **Multi-page application** with hash-based routing
- **Responsive design** optimized for all devices
- **Admin panel** for easy content management (no code changes needed)
- **Supabase backend** for data storage
- **Modern UI** with Tailwind CSS and glassmorphism effects
- **Brand colors**: Pastel blue, light blue, soft sage green, earthy tones

## 🚀 Quick Start

### For Deployment

**New to web development?** → Read [`NETLIFY_STEP_BY_STEP.md`](NETLIFY_STEP_BY_STEP.md)

**Some experience?** → Read [`QUICK_START.md`](QUICK_START.md)

**Just need deployment details?** → Read [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

### For Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd DaWg-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm preview
   ```

## 📦 Project Structure

```
/
├── components/          # Reusable React components
│   ├── ui/             # Shadcn UI components
│   ├── Navigation.tsx  # Main navigation
│   ├── Footer.tsx      # Site footer
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── TeamPage.tsx
│   ├── ResearchPage.tsx
│   ├── BlogPage.tsx
│   ├── PartnersPage.tsx
│   └── AdminPage.tsx
├── supabase/           # Backend server
│   └── functions/
│       └── server/
├── styles/             # Global styles
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
└── README.md
```

## 🔐 Security

The admin panel is currently accessible via direct URL (`/#admin`). For production use, consider:
- Adding password protection
- Implementing Supabase authentication
- Keeping the admin URL private

## 🤝 Contributing

This is a custom website for DaWg. For questions or issues:
1. Check the `DEPLOYMENT_GUIDE.md`
2. Review the code comments
3. Contact the development team

## 📄 License

All rights reserved - Data Well-being Group

---

Built with ❤️ using Figma Make