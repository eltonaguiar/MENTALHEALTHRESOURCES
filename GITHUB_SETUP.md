# GitHub Setup Instructions

## To Push This to GitHub

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Sign in to your account (create one if needed - it's free)
3. Click the "+" icon in the top right → "New repository"
4. Name it: `mental-health-resources-canada`
5. Add description: "Comprehensive mental health resources, guides, and crisis support for Canada"
6. Choose **Public** (so others can access it)
7. Click "Create repository"

### Step 2: Add Remote and Push
After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd "c:\Users\zerou\Documents\MentalHealthResources"
git remote add origin https://github.com/YOUR-USERNAME/mental-health-resources-canada.git
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username.**

### Step 3: Enable GitHub Pages (Optional - Free Hosting)
To host your website for free:

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and root folder
5. Click "Save"
6. Your site will be live at: `https://YOUR-USERNAME.github.io/mental-health-resources-canada`

## File Structure in Repository

```
mental-health-resources-canada/
├── index.html                              # Landing page (homepage)
├── styles.css                              # Website styling
├── script.js                               # Interactive features
├── README.md                               # Project documentation
├── .gitignore                              # Files to ignore in git
├── Canada_Mental_Health_Resources.md       # Canadian mental health directory
├── Panic_Attack_Self_Help_Guide.md        # Panic attack guide
└── Healthy_Habits_Depression_Recovery.md  # Depression recovery guide
```

## Website Features

The landing page includes:

✓ **Sticky Emergency Banner** - Crisis hotlines always visible:
  - Canada Suicide Prevention Service: 1-833-456-4566
  - Crisis Text Line: Text HOME to 741741
  - Kids Help Phone: 1-800-668-6868
  - Emergency: 911

✓ **Navigation** - Easy access to all sections

✓ **Hero Section** - Welcoming introduction

✓ **Resource Cards** - Download guides for:
  - Canadian Mental Health Resources
  - Panic Attack Recovery
  - Healthy Habits & Depression Recovery

✓ **Emergency Resources** - Complete directory of crisis support

✓ **Features** - Why these resources matter

✓ **Responsive Design** - Works on desktop, tablet, mobile

✓ **Accessibility** - Keyboard navigation, semantic HTML, ARIA labels

## Local Testing

To test the website locally before pushing to GitHub:

1. Navigate to your project folder
2. Double-click `index.html` to open in browser
3. Or right-click → "Open with" → your preferred browser

## Updating the Repository

After making changes locally:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

## Next Steps

1. **Customize**: Add your email, social links, or additional content
2. **Promote**: Share the GitHub link or live website with others
3. **Maintain**: Update resources as new services become available
4. **Collect Feedback**: GitHub Issues can be used for suggestions

## Support

If you need help with GitHub:
- GitHub Docs: [docs.github.com](https://docs.github.com)
- GitHub Guides: [guides.github.com](https://guides.github.com)

---

**Your Mental Health Resources are now version-controlled and ready to share with the world!**

Remember: This is a living project - you can always add more resources, improve the design, or expand the content over time.

Last updated: January 18, 2026
