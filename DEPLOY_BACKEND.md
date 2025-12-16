# TAUfoods Backend - Deploy to Render

## Quick Deploy to Render (FREE)

1. **Push your code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/taufoods-backend.git
   git push -u origin main
   ```

2. **Go to [Render.com](https://render.com)**
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
3. **Configure the deployment:**
   - **Name**: `taufoods-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
   - **Plan**: Free
4. **Add Environment Variables:**

   - Click "Environment" tab
   - Add these variables:
     ```
     MONGO_URI=mongodb+srv://jephcoding:jephojeph123@cluster0.s0dps2u.mongodb.net/TAUFOODS?retryWrites=true&w=majority
     JWT_SECRET=jephojeph12345
     NODE_ENV=production
     CORS_ORIGIN=*
     PORT=5000
     ```

5. **Deploy!**

   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Your backend URL will be: `https://taufoods-backend.onrender.com`

6. **Update your app:**
   - Change `apiUrl` in `app.json` to your Render URL
   - Build APK with: `eas build --platform android --profile preview`

## Alternative: Railway (Also FREE)

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Add same environment variables
5. Deploy!

---

**After deployment, update the apiUrl in app.json to your live backend URL!**
