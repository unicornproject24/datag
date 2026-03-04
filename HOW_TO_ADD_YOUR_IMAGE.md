# How to Add Your Own Image

## Quick Steps

1. **Prepare your image:**
   - Name it `hero.jpg` or `hero.png`
   - Recommended size: 800x800 pixels or larger
   - Format: JPG, PNG, or WebP

2. **Add the image to your project:**
   ```
   Copy your image to: public/images/hero.jpg
   ```

3. **The image will automatically appear on the homepage!**

## File Structure

```
Data wellbeing Group Webpage/
├── public/
│   └── images/
│       └── hero.jpg  ← Put your image here
├── src/
│   └── pages/
│       └── HomePage.tsx  ← Already configured to use /images/hero.jpg
```

## Alternative: Use a Different Filename

If you want to use a different filename (e.g., `my-image.png`):

1. Place your image in `public/images/my-image.png`
2. Update the HomePage.tsx file:
   - Find: `src="/images/hero.jpg"`
   - Replace with: `src="/images/my-image.png"`

## Image Recommendations

- **Aspect Ratio**: Square (1:1) works best
- **Size**: At least 800x800 pixels
- **Format**: JPG for photos, PNG for graphics with transparency
- **File Size**: Keep under 500KB for fast loading
- **Content**: Choose an image that represents data wellbeing, research, or technology

## Current Setup

The homepage is already configured to use: `/images/hero.jpg`

Just add your image to the `public/images/` folder and it will work!

## Troubleshooting

If the image doesn't show:
1. Make sure the filename matches exactly (case-sensitive)
2. Check the file is in `public/images/` folder
3. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
4. Check browser console for errors

## Need Help?

The image component has a fallback, so if your image doesn't load, it will show a placeholder instead.
