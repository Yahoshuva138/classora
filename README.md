# Classora Academic OS — Scaler School of Technology (SST)

An enterprise-grade Academic Operations System and Dashboard engineered for the **Scaler School of Technology (SST) ENG-101 English Communication Skills** course.

---

## 🚀 Key Features

- **Strict 44-Student Cohort Access**: Only the 44 enrolled students in the official SST ENG-101 cohort are authorized to log in. Non-cohort and external domains (`@gmail.com`, etc.) are automatically blocked.
- **Shared Cohort Default Password (`SST@2026`)**: All 44 students can log in immediately using the shared cohort default password without prior individual registration.
- **Mandatory "Change Password After Login" Flow**:
  - Automatic modal prompt upon entry when using `SST@2026`.
  - Pinned security alert banner at the top of the dashboard.
  - Header profile menu indicator with an amber "Required" badge.
  - Secure personal password saving via `POST /api/auth/change-password`.
- **44-Student Cohort Roster Search Modal**: Real-time lookup dialog to search students by name, roll number (`26bcs...`), or discussion group with 1-click credential auto-fill.
- **Role-Based Experience**: Tailored views for Students, Class Representatives (CR), and Faculty/Teachers.
- **Full Academic Operations Suite**:
  - Live session tracking and attendance management.
  - Discussion groups distribution (7 official cohort groups).
  - Student leave request submission with automated attendance excuse sync.
  - Real-time institutional WhatsApp announcement generator.
  - Security audit activity log.
- **3-Tier Resilient Persistence Architecture**:
  - **Tier 1**: Native MongoDB (when available).
  - **Tier 2**: Embedded in-memory MongoDB.
  - **Tier 3**: Zero-crash high-performance in-memory store with auto-hydration.
- **Unified Single-Server Deployment**: In production, the Express backend serves both the compiled React Vite SPA and all `/api` endpoints on a single port.

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20 & v24)
- **npm**: v9+

### 2. Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd Dashboard_English_SST

# Install dependencies
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=518296317424-9b2p4qkkm7q7n8rsv0v1k8m5mflvsq01.apps.googleusercontent.com
```

### 4. Running in Development
```bash
npm run dev
```
- **Vite Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5000`

---

## 🧪 Verification & Testing

Classora comes with comprehensive automated verification suites:

```bash
# Full system verification suite (13/13 automated checks)
node scripts/testFullSystem.cjs

# Cohort authentication & authorization tests (8/8 checks)
node scripts/testStrictAuthWorkflow.cjs

# Default password & password update tests (6/6 checks)
node scripts/testDefaultPasswordWorkflow.cjs

# Verify cohort data, discussion groups, and attendance
node scripts/verifyCohortSystem.cjs

# Production TypeScript & Vite build
npm run build
```

---

## 🚢 Production Deployment

### Option 1: Vercel (1-Click Full-Stack Serverless)
Classora includes native Vercel configuration (`vercel.json` and `api/index.js`):

1. Go to [vercel.com](https://vercel.com) and import your repository **`Yahoshuva138/classora`**.
2. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_GOOGLE_CLIENT_ID` = `518296317424-9b2p4qkkm7q7n8rsv0v1k8m5mflvsq01.apps.googleusercontent.com`
   - `VITE_API_URL` = `/api`
   - *(Optional)* `MONGODB_URI` = your MongoDB Atlas connection string (falls back to built-in in-memory store if omitted).
4. Click **Deploy**. Vercel will build the frontend and deploy the serverless API automatically!

### Option 2: Render / Railway / Cyclic / VPS (Unified Long-Running Process)
Since `server/server.js` serves both the compiled frontend and the API:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start` (or `node server/server.js`)
3. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=5000` (or the port provided by the host)

---

## 📜 Default Credentials (SST 2026 Cohort)

| Student / Role | Official Email | Initial Password | Post-Login Step |
|---|---|---|---|
| **Class Representative** | `yahoshuva.26bcs10296@sst.scaler.com` | `SST@2026` | Prompted to change password |
| **All 44 Cohort Students** | `[name].[rollno]@sst.scaler.com` | `SST@2026` | Prompted to change password |
| **External Non-Cohort User** | `user@gmail.com` | *Any* | **Blocked** (403 Forbidden) |
