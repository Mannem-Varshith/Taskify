# ⚡ Railway Deployment - Quick Reference Card

## 🚀 Deploy in 4 Steps (15 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend
1. Go to https://railway.app → Login
2. New Project → GitHub repo → Select `server` directory
3. Add variables:
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://taskmanager_user:X07JlKDwHIOyvjjh@taskmanageruser.3jpus3o.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=TaskManageruser`
   - `JWT_SECRET=supersecretjwtkeyfortaskmanager2024`
   - `CLIENT_URL=` (update after frontend)
   - `NODE_ENV=production`
4. Generate domain → Copy URL

### Step 3: Deploy Frontend
1. Add service → Same repo → Select `client` directory
2. Add variable:
   - `VITE_API_URL=<backend-url-from-step-2>`
3. Generate domain → Copy URL

### Step 4: Update Backend
1. Go to backend service
2. Update `CLIENT_URL=<frontend-url-from-step-3>`
3. Done! 🎉

---

## 📋 Environment Variables

### Backend
```
PORT=5000
MONGO_URI=mongodb+srv://taskmanager_user:X07JlKDwHIOyvjjh@taskmanageruser.3jpus3o.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=TaskManageruser
JWT_SECRET=supersecretjwtkeyfortaskmanager2024
CLIENT_URL=https://your-frontend.up.railway.app
NODE_ENV=production
```

### Frontend
```
VITE_API_URL=https://your-backend.up.railway.app
```

---

## ✅ Quick Test

1. Visit frontend URL
2. Register new account
3. Create project
4. Add task
5. Drag task to "In Progress"
6. ✅ Success!

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| CORS error | Update `CLIENT_URL` in backend |
| API fails | Check `VITE_API_URL` in frontend |
| DB error | Verify MongoDB allows 0.0.0.0/0 |
| Build fails | Run `npm install` locally first |

---

## 📚 Full Documentation

- **Quick Guide:** `RAILWAY_SETUP.md`
- **Full Guide:** `DEPLOYMENT.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Summary:** `DEPLOYMENT_SUMMARY.md`

---

## 🔍 Verify Before Deploy

```bash
node verify-deployment.js
```

Should show: ✅ Your application is ready for Railway deployment!

---

## 💰 Cost

- Railway: ~$5-8/month (or free with credits)
- MongoDB: $0/month (free tier)

---

## 🎯 Your URLs

After deployment:
- Frontend: `https://_____.up.railway.app`
- Backend: `https://_____.up.railway.app`

---

**Ready? Let's deploy! 🚀**
