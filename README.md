# 🧠 Synapse — Multi-game platform to train and benchmark your cognitive skills

> **Live Application:** [synapse.vercel.app](https://synapse.vercel.app)  
> **Developer:** Syed Muhammad Hashir Ali ([hashir.dev](https://hashir-dev-delta.vercel.app/))

Synapse is a high-precision, web-based cognitive training suite designed to measure, train, and benchmark fundamental spatial perception, color discrimination, and visual reaction speed. Built with a dark glassmorphic design system, Synapse provides instant performance feedback and global leaderboard tracking across three core cognitive modules.

---

## 🎮 Cognitive Modules

### 1. 📏 ScaleGuess (Spatial & Dimensional Estimation)
- **Concept:** Estimate the real-world scale of objects across multi-order logarithmic dimensions—from sub-micron molecular structures ($\text{nm}/\mu\text{m}$) to planetary scales ($\text{km}$).
- **Engine:** SVG vector rendering with unpadded scale transformations to ensure 100% geometric accuracy.
- **Scoring:** Precision-based scoring curve using logarithmic deviation from real-world metric attributes.

### 2. 🎨 Not Color Blind (HSB Color Memory & Discrimination)
- **Concept:** Train fine-grained color perception and working visual memory under strict time constraints.
- **Engine:** Dynamic HSB (Hue, Saturation, Brightness) color manipulation algorithms.
- **Gameplay:** Memorize a target swatch within 5 seconds, then reconstruct the exact shade using 3-axis interactive sliders.

### 3. ⚡ Human Benchmark (Visual Reflex Speed)
- **Concept:** Benchmark millisecond-level neural reaction latency.
- **Engine:** High-frequency event loop tracking with anti-anticipation logic (false start detection).
- **Analytics:** 5-round average reaction time tracking ($\text{ms}$) with latency distribution breakdowns.

---

## 🛠️ Tech Stack & Architecture

Synapse is engineered as a Vercel Multi-Service project, separating client-side rendering from serverless REST API microservices:

### **Frontend**
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Glassmorphism, custom design tokens, dark theme)
- **Icons:** Lucide React
- **Type Safety:** TypeScript (Strict mode)

### **Backend & Database**
- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL (Supabase) with zero-config in-memory fallback for local development
- **Authentication:** JWT (JSON Web Tokens) with Google & GitHub OAuth integration
- **Deployment:** Vercel Multi-Service (`vercel.json` routing architecture)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/pikacoder44/Synapse.git
cd Synapse
```

### 2. Install Dependencies
Install root and server dependencies:
```bash
npm install
npm install --prefix server
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory for the client:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3001
```

Create a `server/.env` file for the backend server:
```env
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
JWT_SECRET=your-32-byte-random-jwt-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Run Development Servers
Start the backend server and Vite frontend concurrently:
```bash
# Terminal 1: Start Express API Server
npm run dev --prefix server

# Terminal 2: Start Vite Client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📊 Quality Assurance & Verification
The codebase strictly enforces 0 lint, type, or runtime warnings:
```bash
# Run client and server linter + typechecks
npm run lint && npx tsc -b && npx tsc --noEmit --project server/tsconfig.json

# Test production builds
npm run build && npm run build --prefix server
```

---

## 👨‍💻 Author
**Syed Muhammad Hashir Ali**  
Backend & Full-Stack Software Engineer  
- **Portfolio:** [hashir.dev](https://hashir-dev-delta.vercel.app/)  
- **GitHub:** [@pikacoder44](https://github.com/pikacoder44)  
- **LinkedIn:** [syedmhashirali](https://www.linkedin.com/in/syedmhashirali/)  
- **Email:** hashiralibusiness@gmail.com  

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
