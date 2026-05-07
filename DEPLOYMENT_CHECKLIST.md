# 🚀 Railway Deployment Checklist

## ✅ Pre-Deployment

### Code Preparation
- [x] All code is committed to Git
- [x] Code is pushed to GitHub repository
- [x] `.env` files are in `.gitignore`
- [x] Environment variable examples created (`.env.example`)
- [x] Application tested locally
- [x] Build process verified (`npm run build` works)

### Configuration Files
- [x] `vite.config.js` configured for production
- [x] `client/src/services/api.js` uses environment variables
- [x] Socket.IO client uses `VITE_API_URL`
- [x] CORS configured in backend
- [x] `.railwayignore` files created

### Database
- [x] MongoDB Atlas cluster created
- [x] Database user created with password
- [x] Network access configured (0.0.0.0/0 for Railway)
- [x] Connection string tested

---

## 🚂 Railway Deployment Steps

### Step 1: Backend Deployment
- [ ] Login to Railway (https://railway.app)
- [ ] Create new project from GitHub repo
- [ ] Select `server` directory as root
- [ ] Add environment variables:
  - [ ] `PORT=5000`
  - [ ] `MONGO_URI=<your_mongodb_connection_string>`
  - [ ] `JWT_SECRET=<your_secret_key>`
  - [ ] `CLIENT_URL=<will_update_later>`
  - [ ] `NODE_ENV=production`
- [ ] Generate domain for backend
- [ ] Copy backend URL: `_______________________________`
- [ ] Wait for deployment to complete
- [ ] Test backend: Visit URL, should see API message

### Step 2: Frontend Deployment
- [ ] Add new service in same Railway project
- [ ] Select `client` directory as root
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=<backend_url_from_step_1>`
- [ ] Generate domain for frontend
- [ ] Copy frontend URL: `_______________________________`
- [ ] Wait for deployment to complete
- [ ] Test frontend: Visit URL, should see landing page

### Step 3: Update Backend CORS
- [ ] Go back to backend service
- [ ] Update `CLIENT_URL` variable with frontend URL
- [ ] Save and wait for auto-redeploy
- [ ] Verify CORS is working

---

## 🧪 Post-Deployment Testing

### Backend Tests
- [ ] Visit backend URL
- [ ] Should see: `{"message": "Team Task Manager API is running 🚀"}`
- [ ] Check Railway logs for errors
- [ ] Verify MongoDB connection in logs

### Frontend Tests
- [ ] Visit frontend URL
- [ ] Landing page loads correctly
- [ ] No console errors in browser
- [ ] Images and assets load

### Integration Tests
- [ ] Register new user account
- [ ] Login with credentials
- [ ] Create a new project
- [ ] Add team members to project
- [ ] Create tasks
- [ ] Drag and drop tasks between columns
- [ ] Edit task details
- [ ] Add comments to tasks
- [ ] Verify real-time updates (open in 2 browsers)
- [ ] Check dashboard analytics
- [ ] Test role-based access (admin vs member)
- [ ] Logout and login again

### Mobile Testing
- [ ] Test on mobile device or browser dev tools
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Navigation is accessible

---

## 🔍 Troubleshooting

### If Backend Fails
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Test MongoDB connection string locally
4. Check if PORT is set correctly
5. Verify Node.js version compatibility

### If Frontend Fails
1. Check Railway build logs
2. Verify `VITE_API_URL` is correct
3. Check browser console for errors
4. Verify build command succeeded
5. Test build locally: `npm run build && npm run preview`

### If API Calls Fail
1. Check CORS configuration
2. Verify `CLIENT_URL` matches frontend URL exactly
3. Check `VITE_API_URL` in frontend
4. Test API endpoints directly with Postman
5. Check network tab in browser dev tools

### If Socket.IO Fails
1. Verify WebSocket connections are allowed
2. Check Socket.IO connection in browser console
3. Verify backend URL is correct
4. Check Railway logs for Socket.IO errors
5. Test with `transports: ['polling']` only

---

## 📊 Monitoring

### Railway Dashboard
- [ ] Check deployment status
- [ ] Monitor resource usage (CPU, Memory)
- [ ] Review logs regularly
- [ ] Set up alerts (optional)

### MongoDB Atlas
- [ ] Monitor active connections
- [ ] Check query performance
- [ ] Review storage usage
- [ ] Set up backup schedule

### Application Health
- [ ] Test application daily
- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Review performance metrics

---

## 🔒 Security Checklist

- [ ] `.env` files not committed to Git
- [ ] Strong `JWT_SECRET` used (min 32 characters)
- [ ] MongoDB user has limited permissions
- [ ] CORS restricted to frontend domain only
- [ ] HTTPS enabled (automatic on Railway)
- [ ] No sensitive data in logs
- [ ] Rate limiting configured (optional)
- [ ] Input validation working

---

## 📝 Documentation

- [ ] Update README with deployment URLs
- [ ] Document environment variables
- [ ] Create user guide (optional)
- [ ] Document API endpoints (optional)
- [ ] Add troubleshooting guide

---

## 🎉 Launch

- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Performance is acceptable
- [ ] Mobile experience is good
- [ ] Share URLs with team/users
- [ ] Announce launch 🚀

---

## 📈 Post-Launch

- [ ] Monitor for first 24 hours
- [ ] Collect user feedback
- [ ] Fix any critical bugs
- [ ] Plan next features
- [ ] Set up analytics (optional)
- [ ] Configure custom domain (optional)

---

## 🔗 Important URLs

**Production URLs:**
- Frontend: `https://_____________________________.up.railway.app`
- Backend: `https://_____________________________.up.railway.app`

**Development URLs:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

**External Services:**
- Railway Dashboard: https://railway.app/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- GitHub Repository: `https://github.com/_______________`

---

## 💰 Cost Tracking

**Railway:**
- Free tier: $5 credit/month
- Current usage: $_____ /month
- Estimated monthly cost: $5-8

**MongoDB Atlas:**
- Free tier: M0 (512MB)
- Current usage: _____ MB
- Estimated monthly cost: $0 (free tier)

**Total Estimated Cost:** $5-8/month

---

## 🆘 Support

**Railway:**
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**MongoDB:**
- Documentation: https://docs.mongodb.com
- Support: https://support.mongodb.com

**Application Issues:**
- GitHub Issues: [Your repo]/issues
- Email: your-email@example.com

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Version:** 1.0.0  

---

✅ **Deployment Complete!** Your application is live! 🎉
