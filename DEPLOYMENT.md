# Railway Deployment Guide

This guide will walk you through deploying your full-stack Team Task Manager application on Railway.

## Prerequisites

1. A [Railway](https://railway.app/) account (sign up with GitHub)
2. Your code pushed to a GitHub repository
3. MongoDB Atlas connection string (already configured)

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend (Server)

1. **Login to Railway**
   - Go to [railway.app](https://railway.app/)
   - Click "Login" and authenticate with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will detect it's a monorepo

3. **Configure Backend Service**
   - Railway will ask which service to deploy first
   - Select the **server** directory
   - Or manually add a service and select "server" as root directory

4. **Set Environment Variables**
   - Go to your backend service
   - Click on "Variables" tab
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb+srv://taskmanager_user:X07JlKDwHIOyvjjh@taskmanageruser.3jpus3o.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=TaskManageruser
     JWT_SECRET=supersecretjwtkeyfortaskmanager2024
     CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
     NODE_ENV=production
     ```
   - **Important**: For `CLIENT_URL`, you'll update this after deploying the frontend

5. **Configure Build Settings**
   - Root Directory: `server`
   - Build Command: `npm install` (auto-detected)
   - Start Command: `npm start` (auto-detected)

6. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain" under "Networking"
   - Copy the generated URL (e.g., `https://your-app.up.railway.app`)
   - This is your **BACKEND_URL**

7. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Check logs to ensure server is running

---

### Step 2: Deploy Frontend (Client)

1. **Add New Service**
   - In the same Railway project, click "New Service"
   - Select "GitHub Repo" and choose the same repository
   - Select the **client** directory as root

2. **Set Environment Variables**
   - Go to your frontend service
   - Click on "Variables" tab
   - Add:
     ```
     VITE_API_URL=<YOUR_BACKEND_URL>
     ```
   - Replace `<YOUR_BACKEND_URL>` with the backend domain from Step 1
   - Example: `VITE_API_URL=https://your-backend.up.railway.app`

3. **Configure Build Settings**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build` (auto-detected)
   - Start Command: `npm run preview` (auto-detected)
   - Install Command: `npm install`

4. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the generated URL (e.g., `https://your-frontend.up.railway.app`)
   - This is your **FRONTEND_URL**

5. **Deploy**
   - Railway will automatically build and deploy
   - Wait for deployment to complete

---

### Step 3: Update Backend Environment Variables

1. **Update CLIENT_URL**
   - Go back to your **backend service**
   - Click "Variables" tab
   - Update `CLIENT_URL` with your frontend URL from Step 2
   - Example: `CLIENT_URL=https://your-frontend.up.railway.app`

2. **Redeploy Backend**
   - Railway will automatically redeploy with new variables
   - This ensures CORS is configured correctly

---

### Step 4: Verify Deployment

1. **Test Backend**
   - Visit your backend URL: `https://your-backend.up.railway.app`
   - You should see: `{"message": "Team Task Manager API is running 🚀"}`

2. **Test Frontend**
   - Visit your frontend URL: `https://your-frontend.up.railway.app`
   - You should see the landing page

3. **Test Full Integration**
   - Register a new account
   - Login
   - Create a project
   - Add tasks
   - Verify real-time updates work

---

## 🔧 Alternative: Single Command Deployment

If you prefer to deploy both services at once:

1. **Create railway.toml** (already created in root)
2. **Push to GitHub**
3. **Railway will auto-detect** both services
4. **Configure environment variables** as described above

---

## 📋 Environment Variables Summary

### Backend (Server)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `supersecretjwtkeyfortaskmanager2024` |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-frontend.up.railway.app` |
| `NODE_ENV` | Environment | `production` |

### Frontend (Client)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.up.railway.app` |

---

## 🛠 Troubleshooting

### Backend Issues

**Problem**: Server not starting
- **Solution**: Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- **Solution**: Verify `CLIENT_URL` matches your frontend domain exactly
- Check that frontend is using correct `VITE_API_URL`

**Problem**: Database connection failed
- **Solution**: Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB connection string is correct

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Ensure backend is running and accessible

**Problem**: Build fails
- **Solution**: Check build logs in Railway
- Verify all dependencies are in package.json
- Try building locally first: `npm run build`

**Problem**: Blank page after deployment
- **Solution**: Check browser console for errors
- Verify vite.config.js is correct
- Check that vercel.json routing is working

### Socket.IO Issues

**Problem**: Real-time updates not working
- **Solution**: Verify WebSocket connections are allowed
- Check that Socket.IO is connecting to correct backend URL
- Railway supports WebSockets by default

---

## 🔒 Security Best Practices

1. **Never commit .env files** to GitHub
2. **Use strong JWT_SECRET** in production
3. **Restrict MongoDB access** to specific IPs if possible
4. **Enable Railway's built-in SSL** (automatic)
5. **Use environment variables** for all sensitive data

---

## 📊 Monitoring

1. **Railway Dashboard**
   - View real-time logs
   - Monitor resource usage
   - Check deployment status

2. **MongoDB Atlas**
   - Monitor database connections
   - Check query performance
   - View storage usage

---

## 💰 Cost Considerations

- **Railway Free Tier**: $5 credit per month
- **Estimated Usage**: 
  - Backend: ~$3-5/month
  - Frontend: ~$2-3/month
- **Upgrade**: If you exceed free tier, upgrade to Hobby plan ($5/month)

---

## 🚀 Custom Domain (Optional)

1. **Purchase Domain** (e.g., from Namecheap, GoDaddy)
2. **Add Custom Domain** in Railway settings
3. **Update DNS Records** as instructed by Railway
4. **Update Environment Variables** with new domain

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible and returns API message
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Projects can be created
- [ ] Tasks can be added
- [ ] Drag-and-drop works
- [ ] Real-time updates work (Socket.IO)
- [ ] Dashboard shows correct data
- [ ] Role-based access control works
- [ ] Mobile responsive design works

---

## 🎉 Success!

Your application is now live and publicly accessible!

**Share your URLs:**
- Frontend: `https://your-frontend.up.railway.app`
- Backend: `https://your-backend.up.railway.app`

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

---

**Need Help?** Check Railway's community forum or Discord for support.
