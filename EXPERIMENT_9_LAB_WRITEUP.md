# UNIVERSITY PRACTICAL FILE WRITE-UP
## EXPERIMENT NO. 9
### Containerizing App with Docker
*(Containerizing a Full-Stack Web Application Using Dockerfiles and Docker Compose)*

---

### 1. AIM & OBJECTIVES
* **Aim**: To containerize a full-stack web application (React frontend with Vite and Node.js/Express backend from Experiment 8) using Docker by creating individual service `Dockerfile`s, `.dockerignore` files, and an overarching multi-container `docker-compose.yml` orchestration configuration file.
* **Key Objectives**:
  1. Understand the core principles of operating-system-level virtualization and containerization using Docker.
  2. Author a lightweight, multi-layer `Dockerfile` for the Node.js/Express backend utilizing the official `node:20-alpine` base image.
  3. Author a development-ready `Dockerfile` for the React/Vite frontend binding to network host `0.0.0.0` on port `5173`.
  4. Implement `.dockerignore` files to optimize Docker build context by preventing bloat from `node_modules`, build artifacts, and sensitive `.env` files.
  5. Configure multi-container orchestration using `docker-compose.yml`, establishing service dependencies (`depends_on`), restart policies (`restart: unless-stopped`), port forwarding (`5000:5000`, `5173:5173`), and automated container networking.
  6. Execute build and lifecycle operations (`docker compose build`, `docker compose up -d`, `docker compose ps`, `docker compose logs`, `docker compose down`).
  7. Verify service health and endpoint responsiveness in web browsers at `http://localhost:5173` and `http://localhost:5000`.

---

### 2. SOFTWARE & SYSTEM REQUIREMENTS
| Software / Component | Version / Specification | Role in Containerization Workflow |
| :--- | :--- | :--- |
| **Operating System** | macOS / Windows 10/11 / Linux | Host operating system running the Docker engine |
| **Docker Engine** | 24.x / 25.x / 26.x+ | Container runtime responsible for building images and running containers |
| **Docker Compose** | v2.x+ (`docker compose`) | Multi-container orchestration tool defining shared networks and services |
| **Docker Desktop** | Latest | GUI management tool for inspecting active containers, images, and logs |
| **Node.js Base Image** | `node:20-alpine` | Minimalist Linux distribution (~50MB compressed) providing Node.js 20 |
| **Vite Dev Server** | v6.x / v8.x | React frontend toolchain configured to serve on `0.0.0.0:5173` |
| **Express Backend** | v5.x / v4.x | REST API & WebSocket server from Exp 8 listening on port 5000 |
| **Web Browser** | Google Chrome / Safari / Edge | Client interface accessing ports `5173` and `5000` |

---

### 3. THEORETICAL & ARCHITECTURAL FOUNDATION

#### 3.1 Containerization vs. Virtual Machines (VMs)
Traditional Virtual Machines rely on a Type-1 or Type-2 Hypervisor to emulate complete physical hardware, running a guest operating system per VM instance. In contrast, Docker implements **OS-level virtualization**, sharing the host Linux kernel while isolating processes through Linux namespaces and control groups (cgroups):

| Parameter | Virtual Machines (VMs) | Docker Containers |
| :--- | :--- | :--- |
| **Architecture** | Hypervisor + Guest OS + Libraries + App | Shared Host Kernel + Container Engine + App + Dependencies |
| **Startup Time** | Minutes (boots entire OS kernel) | Milliseconds to seconds (starts user-space process) |
| **Disk Footprint** | Gigabytes (typically 10 GB – 40 GB) | Megabytes (e.g., Alpine images ~50 MB – 250 MB) |
| **Resource Overhead**| High CPU & RAM dedicated to Guest OS | Near-zero virtualization overhead; executes natively on kernel |
| **Portability** | Hypervisor-dependent disk images | Guaranteed portability across any system running Docker Engine |

```
    ┌─────────────────────────┐               ┌─────────────────────────┐
    │  App A   │    App B     │               │  App A   │    App B     │
    ├──────────┼──────────────┤               ├──────────┼──────────────┤
    │ Bins/Libs│  Bins/Libs   │               │ Bins/Libs│  Bins/Libs   │
    ├──────────┼──────────────┤               ├─────────────────────────┤
    │ Guest OS │   Guest OS   │               │      Docker Engine      │
    ├─────────────────────────┤               ├─────────────────────────┤
    │       Hypervisor        │               │   Host Operating System │
    ├─────────────────────────┤               │     (Shared Kernel)     │
    │  Host Operating System  │               ├─────────────────────────┤
    ├─────────────────────────┤               │        Hardware         │
    │        Hardware         │               └─────────────────────────┘
    └─────────────────────────┘                   DOCKER CONTAINERS
        VIRTUAL MACHINES
```

#### 3.2 Multi-Container Orchestration Architecture
Docker Compose automatically provisions an isolated user-defined bridge network (`project-collaboration-tool-_default`). Within this network, containers discover each other automatically by service name via Docker's embedded DNS server:

```
                            [ Web Browser (Host Machine) ]
                                      │           │
                    http://localhost:5173       http://localhost:5000
                                      │           │
   ┌──────────────────────────────────┼───────────┼────────────────────────────────────┐
   │ Docker Host Engine               │           │                                    │
   │                                  ▼           ▼                                    │
   │                           [Port 5173]    [Port 5000]                              │
   │                                │             │                                    │
   │   ┌────────────────────────────┼─────────────┼────────────────────────────────┐   │
   │   │ Docker Bridge Network      │             │                                │   │
   │   │                            ▼             ▼                                │   │
   │   │                 ┌──────────────────┐  ┌──────────────────┐                │   │
   │   │                 │ frontend         │  │ backend          │                │   │
   │   │                 │ (Container)      │  │ (Container)      │                │   │
   │   │                 │ Vite React App   │  │ Node.js/Express  │                │   │
   │   │                 │ IP: 172.18.0.3   │  │ IP: 172.18.0.2   │                │   │
   │   │                 │ Port: 5173       │  │ Port: 5000       │                │   │
   │   │                 └────────┬─────────┘  └────────┬─────────┘                │   │
   │   │                          │                     │                          │   │
   │   │                          └─ depends_on backend ┘                          │   │
   │   │                                                                           │   │
   │   └───────────────────────────────────────────────────────────────────────────┘   │
   └───────────────────────────────────────────────────────────────────────────────────┘
```

#### 3.3 Dockerfile Instruction Breakdown
* `FROM node:20-alpine`: Specifies Alpine Linux with Node.js 20 as the immutable parent image, significantly reducing attack surface and build size.
* `WORKDIR /app`: Defines the absolute execution directory inside the container for all subsequent instructions.
* `COPY package*.json ./`: Copies package specifications separately before copying application source code.
* `RUN npm install`: Installs required packages inside the container. By placing this step before `COPY . .`, Docker leverages **layer caching**—dependencies are only reinstalled when `package.json` changes.
* `COPY . .`: Copies the remaining application code, adhering to exclusions specified in `.dockerignore`.
* `EXPOSE <port>`: Documents the network port the container listens on at runtime.
* `CMD [...]`: Specifies the default command executed when launching the container instance.

---

### 4. PROJECT FILE STRUCTURE
```
PROJECT-COLLABORATION-TOOL-/
├── backend/
│   ├── .dockerignore         # Excludes node_modules, .env, .git from Docker context
│   ├── Dockerfile            # Container build recipe for Node.js / Express backend
│   ├── package.json          # Node dependencies and "start" script
│   ├── server.js             # Express API & Socket.IO server (listening on 5000)
│   ├── models/               # Mongoose schemas (User, Task, Product)
│   ├── routes/               # Modular Express route handlers
│   └── .env                  # Local environment secrets (excluded from images)
├── frontend/
│   ├── .dockerignore         # Excludes node_modules, dist, .git from Docker context
│   ├── Dockerfile            # Container build recipe for Vite React development
│   ├── package.json          # Frontend dependencies and "dev" script
│   ├── vite.config.js        # Vite build tool configuration
│   └── src/                  # React components, pages, and Socket.IO client
└── docker-compose.yml        # Multi-service composition configuration file
```

---

### 5. IMPLEMENTATION CODE

#### 5.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### 5.2 Backend Dockerignore (`backend/.dockerignore`)
```
node_modules
npm-debug.log
.env
.git
```

#### 5.3 Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

#### 5.4 Frontend Dockerignore (`frontend/.dockerignore`)
```
node_modules
dist
.git
.env
```

#### 5.5 Docker Compose Specification (`docker-compose.yml`)
```yaml
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
    env_file:
      - path: ./backend/.env
        required: false
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    restart: unless-stopped
```

---

### 6. STEP-BY-STEP EXECUTION & VERIFICATION LOG

#### Step 1: Pre-flight Verification of Docker Engine
```bash
docker --version
docker compose version
docker info
```
* **Observed Output**:
```
Docker version 28.5.1, build e181472
Docker Compose version v2.40.2
Server Version: 28.5.1
Operating System: Docker Desktop
```

#### Step 2: Build Multi-Container Images
```bash
docker compose build
```
* **Observed Output**:
```
[+] Building 12.8s (22/22) FINISHED
 => [backend internal] load build definition from Dockerfile
 => => transferring dockerfile: 119B
 => [backend] FROM docker.io/library/node:20-alpine
 => [backend 2/5] WORKDIR /app
 => [backend 3/5] COPY package*.json ./
 => [backend 4/5] RUN npm install
 => [backend 5/5] COPY . .
 => [backend] exporting to image
 => => naming to docker.io/library/project-collaboration-tool--backend
 => [frontend internal] load build definition from Dockerfile
 => => transferring dockerfile: 151B
 => [frontend] FROM docker.io/library/node:20-alpine
 => [frontend 2/5] WORKDIR /app
 => [frontend 3/5] COPY package*.json ./
 => [frontend 4/5] RUN npm install
 => [frontend 5/5] COPY . .
 => [frontend] exporting to image
 => => naming to docker.io/library/project-collaboration-tool--frontend
```

#### Step 3: Start Application in Detached Mode
```bash
docker compose up -d
```
* **Observed Output**:
```
[+] up 3/3
 ✔ Network project-collaboration-tool-_default      Created   0.0s
 ✔ Container project-collaboration-tool--backend-1  Started   0.1s
 ✔ Container project-collaboration-tool--frontend-1 Started   0.1s
```

#### Step 4: Verify Container Status and Port Bindings
```bash
docker compose ps
```
* **Observed Output**:
```
NAME                                     IMAGE                                  COMMAND                  SERVICE    STATUS          PORTS
project-collaboration-tool--backend-1    project-collaboration-tool--backend    "docker-entrypoint.s…"   backend    Up 40 seconds   0.0.0.0:5000->5000/tcp
project-collaboration-tool--frontend-1   project-collaboration-tool--frontend   "docker-entrypoint.s…"   frontend   Up 40 seconds   0.0.0.0:5173->5173/tcp
```

#### Step 5: Inspect Runtime Application Logs
```bash
docker compose logs --tail=20
```
* **Observed Output**:
```
frontend-1  | > project-collaboration-tool@0.0.0 dev
frontend-1  | > vite --host 0.0.0.0
frontend-1  | 
frontend-1  |   VITE v8.2.1  ready in 198 ms
frontend-1  |   ➜  Local:   http://localhost:5173/
frontend-1  |   ➜  Network: http://172.18.0.3:5173/
backend-1   | > backend@1.0.0 start
backend-1   | > node server.js
backend-1   | 
backend-1   | WebSocket server running on port 5000
backend-1   | MongoDB connected
```

#### Step 6: Endpoint Testing via HTTP Requests
```bash
# Test Backend Root Health Endpoint
curl -i http://localhost:5000/

# Test Backend API Verification Endpoint
curl -i http://localhost:5000/api

# Test Frontend HTTP Response
curl -i http://localhost:5173/
```
* **Observed Output**:
  - `http://localhost:5000/` ➔ `HTTP/1.1 200 OK`, Body: `WebSocket and REST API is running`
  - `http://localhost:5000/api` ➔ `HTTP/1.1 200 OK`, Body: `{"message":"Backend is running inside Docker!"}`
  - `http://localhost:5173/` ➔ `HTTP/1.1 200 OK`, Body contains `<div id="app"></div>` (Vite SPA template)

#### Step 7: Container Lifecycle Teardown & Restart
```bash
# Stop and remove containers and network
docker compose down

# Restart the application
docker compose up -d
```
* **Observed Output**:
```
[+] down 3/3
 ✔ Container project-collaboration-tool--frontend-1 Removed  0.1s
 ✔ Container project-collaboration-tool--backend-1  Removed  0.6s
 ✔ Network project-collaboration-tool-_default      Removed  0.1s

[+] up 3/3
 ✔ Network project-collaboration-tool-_default      Created  0.0s
 ✔ Container project-collaboration-tool--backend-1  Started  0.1s
 ✔ Container project-collaboration-tool--frontend-1 Started  0.1s
```

---

### 7. COMMON ERRORS & SOLUTIONS ENCOUNTERED

| Error Condition | Root Cause | Implemented Solution |
| :--- | :--- | :--- |
| **Docker daemon not running** | Docker Desktop application was stopped or still initializing | Started Docker Desktop and verified connectivity using `docker info`. |
| **Port 5000 already in use (403 Forbidden)** | macOS AirPlay Receiver intercepts port 5000 by default | Disabled "AirPlay Receiver" in macOS *System Settings > General > AirDrop & AirPlay*. |
| **Vite container unreachable from host** | Vite defaults to binding only to `localhost` inside container | Added `--host 0.0.0.0` to Vite `CMD` instruction in `frontend/Dockerfile`. |
| **Case-sensitivity build failures** | Alpine Linux is case-sensitive, unlike macOS APFS | Standardized component import paths (e.g., `import Navbar from './components/navbar'`). |
| **MongoDB connection error in container** | `.dockerignore` excluded `.env` containing connection URI | Configured `env_file: ./backend/.env` with `required: false` in `docker-compose.yml`. |
| **Multiple Compose configuration warning** | Presence of both `compose.yaml` and `docker-compose.yml` | Removed redundant `compose.yaml` to standardize exclusively on `docker-compose.yml`. |

---

### 8. VIVA-VOCE QUESTIONS & ANSWERS

#### Q1: What is the fundamental difference between an image and a container in Docker?
* **Answer**: A **Docker image** is an immutable, read-only template that bundles the application code, runtime, system tools, libraries, and settings required to run a program. A **Docker container** is a runnable, isolated, stateful instance of an image. Multiple active containers can be instantiated concurrently from a single Docker image.

#### Q2: Why is `node:20-alpine` preferred over `node:20` for containerization?
* **Answer**: `node:20-alpine` is based on Alpine Linux, an ultra-compact security-oriented Linux distribution. It has an image size of approximately 50 MB compared to the full Debian-based `node:20` image (~1 GB). Smaller images result in faster build times, reduced network transfer latency, and a significantly smaller attack surface with fewer pre-installed utilities.

#### Q3: Why do we copy `package*.json` and execute `RUN npm install` before copying the rest of the source code?
* **Answer**: Docker builds images using a layered architecture with **build caching**. Docker caches each layer unless the files involved in that layer have changed. Since dependencies change much less frequently than application source code, separating `COPY package*.json ./` and `RUN npm install` allows Docker to reuse cached `node_modules` layers on subsequent code edits, drastically accelerating image build times.

#### Q4: Why is a `.dockerignore` file necessary?
* **Answer**: The `.dockerignore` file specifies files and folders that should not be transferred to the Docker daemon during build context creation. Excluding directories like `node_modules`, `dist`, `.git`, and `.env` prevents massive transfer overhead, eliminates platform-architecture conflicts (e.g., host macOS binaries being copied into Linux Alpine), and protects sensitive environment credentials from being baked into public image layers.

#### Q5: What does `EXPOSE 5173` do, and does it publish the port to the host?
* **Answer**: No. `EXPOSE` functions strictly as internal documentation between the image author and the container operator, stating which port the service listens on inside the container. To make the container accessible to the external host machine, explicit port publishing must be defined using the `-p` flag or the `ports: ["5173:5173"]` mapping in `docker-compose.yml`.

#### Q6: Why must the Vite development server be started with `--host 0.0.0.0` inside a Docker container?
* **Answer**: By default, Vite binds to loopback interface `127.0.0.1` (`localhost`), which only accepts connections originating from inside the container itself. Setting `--host 0.0.0.0` instructs Vite to listen on all available network interfaces, allowing requests forwarded from the host machine via the Docker bridge network to reach the application.

#### Q7: What role does `depends_on` play in `docker-compose.yml`?
* **Answer**: `depends_on` defines service startup ordering. In our setup, specifying `depends_on: - backend` under `frontend` ensures that the backend container is created and started before the frontend container initializes. (Note: `depends_on` does not wait for backend readiness checks unless paired with healthchecks).

#### Q8: What is the purpose of `restart: unless-stopped`?
* **Answer**: `restart: unless-stopped` is a container restart policy. It instructs the Docker daemon to automatically restart the container if it crashes or if the Docker daemon reboots, unless the container was explicitly stopped by a user command (such as `docker compose down` or `docker stop`).

#### Q9: What happens when you run `docker compose down`?
* **Answer**: `docker compose down` gracefully stops running containers for all services defined in the configuration file, removes those container instances, and tears down the default user-defined bridge network created for the project. The underlying Docker images remain intact on the host.

#### Q10: How do microservices communicate with one another within a Docker Compose environment?
* **Answer**: Docker Compose automatically configures an internal bridge network with an embedded DNS server. Any service can communicate with another service by using its service name as the hostname (for example, `http://backend:5000`), completely independent of host machine port forwarding.

---

### 9. CONCLUSION & LEARNING OUTCOMES
1. Successfully containerized the full-stack Project Collaboration Tool application using Docker and Docker Compose.
2. Verified that both the React/Vite frontend (port 5173) and Node.js/Express backend (port 5000) run simultaneously in isolated Linux Alpine containers.
3. Verified real-time connectivity between host browsers and containerized services.
4. Demonstrated clean container lifecycle management including build, startup, inspection, logs, and graceful shutdown.
