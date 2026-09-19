# 🧪 Neo Ontorjal Bot - AI Sales Agent & Google Sheets Lead Automation

This project is an AI Sales Agent & Lead Automation Bot template. Powered by the Google Gemini API (`gemini-2.5-flash`), Google Sheets API, and Nodemailer, it engages in natural sales conversations with customers, extracts lead details (Name, Email, Budget, Timeline), auto-saves them to Google Sheets, sends a proposal email to the client, and triggers an instant alert email to the admin.

---

## 📋 Table of Contents
- [📥 Files & Software to Download](#-files--software-to-download)
- [🔑 Where to Get API Keys & Credentials](#-where-to-get-api-keys--credentials)
- [🚀 Step-by-Step Installation & Run Guide](#-step-by-step-installation--run-guide)
- [🎯 Chat Testing & Usage Commands](#-chat-testing--usage-commands)
- [🔒 Security Guidelines](#-security-guidelines)

---

## 📥 Files & Software to Download

### 1. Software & Tools (Must be installed on your machine):
- **Node.js (v18.0.0 or higher):** Download and install from [nodejs.org](https://nodejs.org/) to execute the code.
- **Git:** Download and install from [git-scm.com](https://git-scm.com/) to clone the repository.

### 2. Files to Download/Create inside the Project Folder:
- **`credentials.json`:** Download the Service Account JSON key from Google Cloud Console and save it with this exact name.
- **`node_modules/`:** Automatically generated after running the package installation command in the terminal.

---

## 🔑 Where to Get API Keys & Credentials

### 1. Google Gemini API Key:
- Go to: [Google AI Studio](https://aistudio.google.com/)
- Log in, click **Get API Key**, and generate/copy a new API Key.

### 2. Google Sheets API & `credentials.json`:
- Go to: [Google Cloud Console](https://console.cloud.google.com/)
- Create/select a project and search for **Google Sheets API** to enable/activate it.
- Navigate to **Credentials** > **Create Credentials** > **Service Account**.
- Under the Service Account **Keys** tab, click **Add Key** > **Create New Key (JSON)** to download the file.
- Rename the downloaded file to **`credentials.json`** and place it in the root folder of your project.
- Open your target Google Sheet, click the **Share** button at the top-right corner, and grant `Editor` access to your Service Account email.
- Copy the **Spreadsheet ID** from your Google Sheet URL:
  `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`

### 3. Gmail App Password:
- Go to: [Google Account Security](https://myaccount.google.com/security)
- Turn ON **2-Step Verification**.
- Search for **App Passwords** in the security settings search bar.
- Enter an App Name (e.g., `Bot Email`), then generate and copy the **16-digit App Password**.

---

## 🚀 Step-by-Step Installation & Run Guide

Open your Terminal or Command Prompt (CMD) and execute the following commands in sequence:

### Step 1: Clone the Repository
```bash
git clone [https://github.com/RafchanSami/Auto-Chat-Bot-Tamplete.git](https://github.com/RafchanSami/Auto-Chat-Bot-Tamplete.git)
cd YOUR_REPOSITORY_NAME
Step 2: Download Required Dependencies/Packages
Bash
npm install
Step 3: Place credentials.json File
Paste/save the downloaded JSON key file from Google Cloud Console into the project root directory as credentials.json.

Step 4: Update Configuration in index.js
Open index.js in VS Code or any text editor and update your credentials:

JavaScript
// 1. Gemini API Key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; 

// 2. Google Sheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 

// 3. Email Configurations
const SENDER_EMAIL = 'your-gmail@gmail.com';       
const GMAIL_APP_PASSWORD = 'xxxx xxxx xxxx xxxx'; // 16-digit App Password
const ADMIN_EMAIL = 'admin-email@gmail.com';     // Admin Alert Email
Step 5: Run the Bot
Start the bot by running the following command in your terminal:

Bash
node index.js
🎯 Chat Testing & Usage Commands
Once the bot is running in the terminal, use the following commands:

To start the chat: Type Hi or Hello

To save order & trigger emails: Type save, confirm, or save order

To close/stop the bot: Type exit

🔒 Security Guidelines
🚨 IMPORTANT: Never commit or push your credentials.json file, Gemini API Key, or Gmail App Password to GitHub!

Ensure you have a .gitignore file in your project root with the following entries:

Plaintext
node_modules/
credentials.json
.env
📜 License
This project is licensed under the MIT License.
