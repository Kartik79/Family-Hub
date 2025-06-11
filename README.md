# 🏠 Family Hub – Smart Household Manager

Family Hub is a web-based application designed to simplify family coordination. It allows a family of three to manage daily tasks such as weekly meal planning, child activity scheduling, and household roles through a clean UI and smart automation powered by LLMs like OpenAI GPT.

---

## 🔧 Features

- 🧠 AI-powered weekly meal planning
- 📅 Shared child activity calendar
- 🛒 Auto-generated shopping list
- 🧑‍🍳 Role-based dashboards for parent, cook, driver, and child
- 🔔 Real-time alerts (simulated)
- 🌐 Mobile-first responsive layout

---

## 🚀 Tech Stack

- **Frontend**: React.js (TypeScript), TailwindCSS
- **AI Integration**: OpenAI GPT-3.5/4 via REST API
- **State Persistence**: LocalStorage (no backend)
- **IDE Used**: VS Code, Cursor

---

## 📦 Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kartik79/Family-Hub.git
   cd Family-Hub

2. **Install Dependencies**
   ```bash
   npm install

3. **Run Development Server**
   ```bash
   npm run dev

---

## 📁 Folder Structure
    Family-Hub/
    ├── src/
    │   ├── components/       # Reusable UI components (Navbar, Cards, etc.)
    │   ├── pages/            # Main app pages (Dashboard, Roles)
    │   ├── utils/            # OpenAI API handlers, helpers
    │   └── App.tsx           # App entry point
    ├── .env                  # API keys and environment config
    ├── package.json
    ├── vite.config.ts
    └── README.md

---

## 🔐 API Configuration
   Create a .env file in the root folder:
   ```bash
    VITE_OPENAI_API_KEY=your_openai_api_key
