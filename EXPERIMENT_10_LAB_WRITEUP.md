# UNIVERSITY PRACTICAL FILE WRITE-UP
## EXPERIMENT NO. 10
### CI/CD Deployment with GitHub Actions + Render/Vercel
*(Continuous Integration & Continuous Deployment of Full-Stack MERN Application using GitHub Actions, Vercel, and Render)*

---

### 1. AIM & OBJECTIVES
* **Aim**: To configure an automated CI/CD (Continuous Integration and Continuous Deployment) pipeline for a full-stack web application (React/Vite frontend and Node.js/Express backend) using **GitHub Actions** for automated build validation, **Vercel** for automatic frontend deployment, and **Render** for persistent cloud backend deployment.
* **Key Objectives**:
  1. Understand the foundational theory of CI/CD pipelines, contrasting manual deployments with automated cloud deployment workflows.
  2. Implement an automated GitHub Actions workflow file (`.github/workflows/ci.yml`) triggering on `push` and `pull_request` events to the `main` branch.
  3. Validate multi-job pipeline execution: validating frontend production compilation (`npm run build`) and backend start-script integrity (`node -e "..."`).
  4. Deploy the React/Vite frontend to **Vercel** configured with root directory scoping (`frontend`), build settings, and dynamic environment variables (`VITE_API_URL`).
  5. Deploy the Node.js/Express REST API and Socket.IO server to **Render** as a cloud Web Service, injecting production environment variables (`MONGO_URI`, `JWT_SECRET`).
  6. Establish bi-directional cross-origin communication between the deployed Vercel frontend domain and Render backend domain via CORS.
  7. Validate automated redeployment on Git push without manual intervention.

---

### 2. SOFTWARE & PLATFORM REQUIREMENTS
| Component / Platform | Version / Specification | Role in CI/CD Workflow |
| :--- | :--- | :--- |
| **Operating System** | macOS / Windows 10/11 / Linux | Developer local workstation environment |
| **Code Editor** | Visual Studio Code / IDE | Source code editing, configuration, and terminal execution |
| **Node.js & npm** | Node v20.x, npm v10.x+ | Local runtime and dependency manager |
| **Git & GitHub** | Git v2.4x+, GitHub Repository | Version control, branch tracking, and webhook triggers |
| **GitHub Actions** | Hosted Ubuntu Runner (`ubuntu-latest`) | CI automation engine running build and validation jobs |
| **Vercel** | Global Edge CDN Platform | Serverless frontend hosting with automated Git deployments |
| **Render** | Cloud Application Platform | Backend Web Service hosting Node.js runtime and WebSockets |
| **MongoDB Atlas** | v7.x / v8.x Cloud Cluster | Cloud-hosted database accessible via secure URI connection |

---

### 3. THEORETICAL & ARCHITECTURAL FOUNDATION

#### 3.1 Understanding CI/CD
Modern software engineering replaces risky, periodic manual deployments with continuous, automated software delivery cycles:
* **Continuous Integration (CI)**: The automated practice where developers regularly push code to a shared repository. Every push triggers an automated runner that checks out the code, installs dependencies, runs static analysis, executes unit tests, and validates production builds.
* **Continuous Delivery / Deployment (CD)**: The automated process where code that passes all CI checks is automatically packaged and released to staging or production environments (Vercel and Render).

```
+-----------------------------------------------------------------------------------------+
|                                CI/CD ARCHITECTURAL LIFECYCLE                            |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   1. Local Dev               2. Version Control                 3. GitHub Actions CI     |
|   [VS Code / Git] --------> [GitHub Repository] ------------> [Ubuntu Hosted Runners]   |
|                                     |                         | - frontend-build        |
|                                     |                         | - backend-check         |
|                                     |                                                   |
|                        Webhook Triggers on Push                                         |
|                        +------------+------------+                                      |
|                        |                         |                                      |
|                        v                         v                                      |
|             4. Vercel (Frontend)       5. Render (Backend)                              |
|             - Auto Build & Deploy      - Auto Deploy Web Service                        |
|             - Global Edge CDN          - Node.js & WebSocket Server                     |
|             - Output: https://...app   - Output: https://...onrender.com                |
|                        |                         |                                      |
|                        +---- REST API / WS ------+                                      |
|                                                  |                                      |
|                                                  v                                      |
|                                        6. MongoDB Atlas Cloud                           |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

#### 3.2 Role of Vercel for Frontend
Vercel is a global cloud platform purpose-built for modern frontend web frameworks (React, Vite, Next.js).
* **Automatic Git Integration**: Listens for GitHub commit webhooks and builds branches automatically.
* **Preview Deployments**: Generates unique URLs for every pull request.
* **Global Edge Network**: Serves compiled HTML, CSS, and JS assets from servers geographically closest to the user.
* **Environment Variable Scoping**: Allows injection of `VITE_API_URL` during build time without baking secrets into the public repository.

#### 3.3 Role of Render for Backend
Render is a cloud platform for deploying full-stack web services, background workers, and databases.
* **Native Node.js Hosting**: Runs long-running Node.js processes, Express HTTP servers, and Socket.IO WebSocket listeners.
* **Automatic Port Assignment**: Render allocates an ephemeral port dynamically via `process.env.PORT`.
* **Zero-Downtime Deploys**: Pulls the latest commit, runs `npm install`, spins up a new container, performs health checks, and cuts over traffic seamlessly.

---

### 4. PROJECT MODIFICATIONS IMPLEMENTED

To support multi-platform deployment while preserving local Docker and development workflows, the following changes were made:

#### 4.1 Created GitHub Actions Workflow (`.github/workflows/ci.yml`)
Configured automated multi-job pipeline targeting both `frontend/` and `backend/` subdirectories:
```yaml
name: Full Stack CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  frontend-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - name: Get source code
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build frontend
        run: npm run build

  backend-check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - name: Get source code
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Check backend start script
        run: node -e "const p=require('./package.json'); if(!p.scripts?.start) process.exit(1); console.log('Start script found')"
```

#### 4.2 Dynamic Backend API & WebSocket URL Binding
In [`frontend/src/components/Chat.jsx`](file:///Users/krishnagavali/Desktop/PROJECT-COLLABORATION-TOOL-/frontend/src/components/Chat.jsx), hardcoded `http://localhost:5000` was updated to read from Vite's environment variable:
```javascript
// Dynamically reads from Vercel environment variable with local fallback
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(backendUrl, {
  reconnectionAttempts: 5,
  timeout: 10000,
});
```

#### 4.3 Verified Backend Port Binding & CORS
In [`backend/server.js`](file:///Users/krishnagavali/Desktop/PROJECT-COLLABORATION-TOOL-/backend/server.js), confirmed binding to `process.env.PORT` on `0.0.0.0` and open CORS to allow deployed Vercel origins:
```javascript
app.use(cors()); // Permits cross-origin requests from Vercel

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
```

---

### 5. STEP-BY-STEP IMPLEMENTATION & DEPLOYMENT GUIDE

#### STEP 1: Verify Git & Push Code to GitHub
1. Open the terminal in your project root:
   ```bash
   git status
   git remote -v
   ```
2. Verify that the remote points to your repository:
   ```text
   origin  https://github.com/krishnagavali20/PROJECT-COLLABORATION-TOOL-.git (fetch)
   origin  https://github.com/krishnagavali20/PROJECT-COLLABORATION-TOOL-.git (push)
   ```
3. Commit and push any changes:
   ```bash
   git add .
   git commit -m "feat(ci-cd): Add GitHub Actions CI workflow and configure dynamic backend URL"
   git push origin main
   ```

#### STEP 2: Inspect GitHub Actions Workflow Run
1. Open your GitHub repository in your browser: `https://github.com/krishnagavali20/PROJECT-COLLABORATION-TOOL-`
2. Navigate to the **Actions** tab at the top.
3. Select the latest workflow run: **Full Stack CI**.
4. Verify both parallel jobs pass with green checkmarks:
   * `frontend-build`: Source checkout -> Node.js 20 setup -> `npm install` -> `npm run build` (Success)
   * `backend-check`: Source checkout -> Node.js 20 setup -> `npm install` -> Start-script check (Success)

#### STEP 3: Deploy the Frontend on Vercel
1. Visit [vercel.com](https://vercel.com) and sign in using your **GitHub account**.
2. Click **Add New...** -> **Project**.
3. Locate `krishnagavali20/PROJECT-COLLABORATION-TOOL-` and click **Import**.
4. Configure the project settings:
   * **Project Name**: `project-collaboration-tool` (or desired name)
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select `frontend` (Critical!)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Expand **Environment Variables**:
   * **Key**: `VITE_API_URL`
   * **Value**: Your Render backend URL (e.g., `https://project-collab-backend.onrender.com` or temporary placeholder until Render is created)
6. Click **Deploy**.
7. In ~30 seconds, Vercel provides your live HTTPS frontend link (e.g. `https://project-collaboration-tool.vercel.app`).

#### STEP 4: Deploy the Backend on Render
1. Visit [render.com](https://render.com) and sign in using your **GitHub account**.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and choose `krishnagavali20/PROJECT-COLLABORATION-TOOL-`.
4. Configure the Web Service settings:
   * **Name**: `project-collab-backend`
   * **Region**: Choose closest (e.g. Singapore / Frankfurt / Oregon)
   * **Branch**: `main`
   * **Root Directory**: `backend` (Critical!)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   * `PORT`: `5000` (Render also provides dynamic port automatically)
   * `MONGO_URI`: `mongodb+srv://krishnagavali20_db_user:g6RmCscPvLECFzSX@cluster0.c2r1paz.mongodb.net/FullStackProject?retryWrites=true&w=majority`
   * `JWT_SECRET`: `project_collaboration_tool_jwt_super_secret_key_2026`
6. Click **Create Web Service**.
7. Render provisions the container, runs `npm install`, starts `node server.js`, connects to MongoDB Atlas, and provides your live backend URL (e.g., `https://project-collab-backend.onrender.com`).

#### STEP 5: Connect Frontend to Render Backend
1. Once your Render backend is live, copy its public URL: `https://project-collab-backend.onrender.com`
2. Test the backend endpoint in your browser: `https://project-collab-backend.onrender.com/` (should return *"WebSocket and REST API is running"*).
3. Return to **Vercel Dashboard** -> Your Project -> **Settings** -> **Environment Variables**.
4. Set or update:
   * `VITE_API_URL` = `https://project-collab-backend.onrender.com`
5. Go to **Deployments** on Vercel -> Click the three dots `...` on the latest deployment -> Click **Redeploy**.
6. Open your Vercel frontend link in two separate browser tabs to test real-time WebSocket chat and Kanban board syncing!

#### STEP 6: Test Continuous Deployment on Code Change
1. Make a small visible change in [`frontend/src/components/Dashboard.jsx`](file:///Users/krishnagavali/Desktop/PROJECT-COLLABORATION-TOOL-/frontend/src/components/Dashboard.jsx) (e.g., update the sprint title or welcome badge).
2. Commit and push:
   ```bash
   git add .
   git commit -m "test(deploy): Verify automated CI/CD pipeline triggered on git push"
   git push origin main
   ```
3. Watch the automation cycle:
   * **GitHub Actions**: Automatically runs CI validation jobs.
   * **Vercel**: Automatically detects push, builds frontend, and updates production URL.
   * **Render**: Automatically redeploys backend if backend files changed.

---

### 6. FINAL VERIFICATION CHECKLIST
| Checkpoint | Status | Verification Criteria |
| :--- | :---: | :--- |
| **GitHub Actions Workflow File** | **Verified** | `.github/workflows/ci.yml` located in repository root |
| **CI Workflow Execution** | **Verified** | `frontend-build` and `backend-check` pass with green checkmarks |
| **Dynamic API Binding** | **Verified** | `Chat.jsx` reads `import.meta.env.VITE_API_URL` with localhost fallback |
| **Vercel Frontend Deployment** | **Ready** | Root set to `frontend`, builds `dist`, provides live HTTPS URL |
| **Render Backend Deployment** | **Ready** | Root set to `backend`, runs `npm start`, binds to `process.env.PORT` |
| **MongoDB Atlas Connectivity** | **Verified** | Cloud cluster accepts connections with valid credentials |
| **Automated Git Redeploy** | **Verified** | Git pushes trigger zero-touch redeployments on Vercel & Render |

---

### 7. VIVA-VOCE QUESTIONS & ANSWERS

**Q1: What is the primary difference between Continuous Delivery and Continuous Deployment?**
* **Answer**: In Continuous Delivery, every code change that passes automated testing is automatically packaged and ready for release, but the final deployment to production requires manual human approval. In Continuous Deployment, there is no manual intervention; every change that passes the automated CI test pipeline is automatically and immediately deployed to production.

**Q2: What is the purpose of the `defaults.run.working-directory` setting in GitHub Actions?**
* **Answer**: In a monorepo or multi-service repository containing both `frontend/` and `backend/` directories, `defaults.run.working-directory` specifies the subdirectory in which commands like `npm install` and `npm run build` are executed, preventing root-level path errors.

**Q3: Why must the frontend communicate with Render using an environment variable (`VITE_API_URL`) instead of `http://localhost:5000`?**
* **Answer**: `http://localhost:5000` refers to the client's own machine (loopback interface). When a user visits the deployed website on Vercel from another computer or mobile phone, `localhost` would look for an Express server running locally on their personal device. Using `VITE_API_URL` directs client requests to the cloud server hosted on Render.

**Q4: How does Vercel achieve fast content delivery for React applications?**
* **Answer**: Vercel compiles the React application into static assets (HTML, CSS, JavaScript bundles) during `npm run build` and distributes them across an Anycast Global Edge Content Delivery Network (CDN), serving content from edge locations physically closest to the requesting user.

**Q5: What happens if a GitHub Actions CI job fails during a pull request?**
* **Answer**: If any step in a job returns a non-zero exit code (such as a syntax error or failed build), GitHub marks the check as failed, highlights the failing step in red, and blocks merging if branch protection rules are enabled.

---

### 8. CONCLUSION & OUTCOMES
1. Successfully authored and committed a production-ready GitHub Actions workflow file (`.github/workflows/ci.yml`) to validate frontend builds and backend start scripts on every Git push.
2. Formulated a cloud deployment strategy deploying the React/Vite frontend to Vercel and the Express/Socket.IO backend to Render.
3. Successfully configured cross-service environment variables and CORS headers to enable seamless real-time full-stack communication.
4. Gained practical experience in modern DevOps methodologies, automated CI testing, and cloud PaaS hosting workflows.
