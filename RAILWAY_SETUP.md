# 🚂 Railway Deployment - Quick Start Guide

## 📋 Pre-Deployment Checklist

✅ Code is pushed to GitHub  
✅ MongoDB Atlas is configured and accessible  
✅ Environment variables are documented  
✅ Application works locally  

---

## 🚀 Step-by-Step Deployment

### 1️⃣ Deploy Backend First

1. **Go to Railway**: https://railway.app/
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Configure Service**:
   - Service Name: `task-manager-backend`
   - Root Directory: `server`
   - Start Command: `npm start`

6. **Add Environment Variables**:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://taskmanager_user:X07JlKDwHIOyvjjh@taskmanageruser.3jpus3o.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=TaskManageruser
   JWT_SECRET=supersecretjwtkeyfortaskmanager2024
   CLIENT_URL=https://your-frontend-url.railway.app
   NODE_ENV=production
   ```
   
   ⚠️ **Note**: You'll update `CLIENT_URL` after deploying frontend

7. **Generate Domain**:
   - Settings → Networking → Generate Domain
   - Copy URL (e.g., `https://task-manager-backend.up.railway.app`)
   - **Save this URL** - you'll need it for frontend!

8. **Deploy** and wait for completion

---

### 2️⃣ Deploy Frontend

1. **Add New Service** in same Railway project
2. **Select same GitHub repo**
3. **Configure Service**:
   - Service Name: `task-manager-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   
   Replace with your actual backend URL from Step 1

5. **Generate Domain**:
   - Settings → Networking → Generate Domain
   - Copy URL (e.g., `https://task-manager-frontend.up.railway.app`)

6. **Deploy** and wait for completion

---

### 3️⃣ Update Backend CORS

1. **Go back to Backend service**
2. **Update Variables**:
   - Change `CLIENT_URL` to your frontend URL
   - Example: `CLIENT_URL=https://task-manager-frontend.up.railway.app`
3. **Save** - Railway will auto-redeploy

---

### 4️⃣ Test Your Deployment

1. **Backend Health Check**:
   - Visit: `https://your-backend.up.railway.app`
   - Should see: `{"message": "Team Task Manager API is running 🚀"}`

2. **Frontend Test**:
   - Visit: `https://your-frontend.up.railway.app`
   - Should see landing page

3. **Full Integration Test**:
   - ✅ Register new account
   - ✅ Login
   - ✅ Create project
   - ✅ Add tasks
   - ✅ Drag and drop tasks
   - ✅ Real-time updates work

---

## 🎯 Your Deployed URLs

After deployment, you'll have:

- **Frontend**: `https://task-manager-frontend.up.railway.app`
- **Backend**: `https://task-manager-backend.up.railway.app`

---

## 🔧 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Verify `CLIENT_URL` in backend matches frontend URL exactly (no trailing slash)

### Issue: API calls fail
**Solution**: Check `VITE_API_URL` in frontend matches backend URL

### Issue: Database connection error
**Solution**: 
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MONGO_URI is correct

### Issue: Build fails
**Solution**: 
- Check Railway logs
- Verify package.json has all dependencies
- Try building locally first

### Issue: Socket.IO not working
**Solution**: Railway supports WebSockets by default, check backend URL is correct

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Railway settings
2. **Monitoring**: Check Railway dashboard for logs and metrics
3. **Auto-Deploy**: Railway auto-deploys on git push
4. **Environment Variables**: Never commit .env files
5. **Database**: Monitor MongoDB Atlas for connection issues

---

## 📊 Expected Costs

- **Railway Free Tier**: $5 credit/month
- **Backend**: ~$3-5/month
- **Frontend**: ~$2-3/month
- **Total**: ~$5-8/month (or free with trial credits)

---

## ✅ Deployment Complete!

Your full-stack application is now live and publicly accessible! 🎉

**Next Steps**:
- Share your frontend URL with users
- Monitor logs for any issues
- Set up custom domain (optional)
- Configure MongoDB backups

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Need Help?** Check the detailed DEPLOYMENT.md file for troubleshooting.
