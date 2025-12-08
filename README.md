# ChefAI / SafeHaven (Project Dana v2)

> **"Hidden in Plain Sight"** - A dual-purpose application designed to protect domestic abuse survivors through plausible deniability and secure evidence logging.

---

## 🚨 The Problem
Survivors of domestic abuse, particularly those experiencing coercive control, often lack a safe way to document incidents. Abusers heavily monitor devices, making traditional journaling or evidence collection dangerous.

## 🛡️ The Solution
**ProjectDANA** is a secure vault disguised as **ChefAI**, a fully functional recipe finder application.
- **Surface Layer (Decoy):** A polished, working recipe app powered by TheMealDB API. It stands up to scrutiny if a perpetrator checks the phone.
- **Hidden Vault:** Accessed only via specific "Magic Words" in the recipe search bar, revealing a secure interface for logging abuse, saving evidence, and tracking safety indicators.

---

## ✨ Features

### 🍳 Decoy View (ChefAI)
- **Functional Recipe Finder:** Search for meals, view trending recipes, and get detailed instructions.
- **Live API Integration:** Powered by `TheMealDB` for real-time data.
- **Stealth Triggers:**
  - Search **"Blueberry Pancakes"** → Unlocks the Secure Vault.
  - Search **"Burnt Toast"** → Opens a "Gratitude Log" (Duress View) to appease a suspicious abuser demanding to see what was "hidden".

### 🔒 Secure Vault (ProjectDANA)
- **Incident Logging:**
  - **Split-View Analysis:** Records the survivor's raw emotional account alongside an AI-generated, legally-aligned summary.
  - **Scottish Law Alignment:** AI analyses text for indicators of *Coercive Control* (e.g., isolation, financial abuse) to aid legal professionals.
- **Evidence Locker:**
  - **Secure Uploads:** Store photos/documents with SHA-256 hashing for integrity.
  - **Chain of Custody:** Metadata tracking (Time, Date, Location) to ensure admissibility.
- **Child Welfare Tracker:**
  - Monitor handover timeliness, parent state (calm/hostile), and child's condition (items missing, distress).
- **Safety Planning:** Store safe contacts and emergency plans.

### 🎭 Duress View (Love Bombing Log)
- A "fake" secret area disguised as a "Gratitude Journal".
- If an abuser suspects something is hidden and demands access, the user can trigger this view to show "positive" entries (Love Bombing tracking), protecting the *real* evidence in the Vault.

---

## 🛠️ Technology Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Directory)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **AI Integration:** Google Gemini 2.5 Pro (via `GenerateContent`)
- **API:** TheMealDB (Decoy content)

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/project-dana.git
   cd project-dana
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## ⚠️ Important Safety & Security Note
**This is a Proof of Concept (POC).**
While designed with security in mind (client-side hashing, decoy interface), it is currently a local-only prototype.
- **Data Persistence:** Currently uses local state/mock data for demonstration. A production build would require a secure, encrypted backend (e.g., Supabase with RLS or local-only encrypted storage).
- **Emergency Use:** This tool is **not** a replacement for emergency services. If you are in immediate danger, call 999.

---

## 🤝 Contribution
This project is open-source to encourage development of safety tech. Contributions focused on encryption, legal alignment, and UI stealth are welcome.

---

*Built with ❤️ and rage. | Nicola Berry | 2025*
