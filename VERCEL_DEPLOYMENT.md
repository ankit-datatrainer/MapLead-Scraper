# Vercel Deployment Guide

Your Next.js application is now configured for Vercel deployment. Follow these steps:

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub, GitLab, or Bitbucket repository with your code

## Deployment Steps

### 1. Push to Git Repository
Ensure your code is pushed to your Git repository:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project on Vercel
1. Go to https://vercel.com/new
2. Select your Git provider and authorize
3. Select this repository
4. Click "Import"

### 3. Configure Environment Variables
In the Vercel dashboard, go to **Settings > Environment Variables** and add:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

**Optional:**
- `NEXT_PUBLIC_SITE_URL`: Leave blank for Vercel to auto-populate, or set to your domain

### 4. Deploy
Click the **Deploy** button. Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to a preview URL
- Promote to production when ready

## Automatic Deployments
After the initial deployment:
- **Preview deployments** are created for every push to non-main branches
- **Production deployments** are created for pushes to your main branch
- Each deployment gets a unique URL

## Custom Domain
To add your own domain:
1. Go to **Settings > Domains**
2. Add your domain and follow DNS configuration instructions
3. SSL/TLS certificate is automatic

## Troubleshooting

### Build Errors
Check the deployment logs in Vercel dashboard. Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### Runtime Errors
Monitor logs in **Monitoring > Logs** tab in Vercel dashboard.

### Supabase Connection Issues
Ensure:
- Environment variables are set correctly
- Supabase project is accessible from Vercel IP ranges
- Service role key has proper permissions

## Files Created for Vercel
- `vercel.json`: Deployment configuration
- `.vercelignore`: Files to exclude from deployment

These files configure optimal build settings and performance for your application on Vercel.
