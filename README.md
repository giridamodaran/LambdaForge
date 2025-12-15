# LambdaForge 🚀

**LambdaForge** is an open-source engine that converts natural language into executable serverless functions. 

Powered by **Google Gemini** and built with **React**, it eliminates the boilerplate of setting up a cloud environment just to test simple logic. Describe what you want, and LambdaForge writes, secures, and simulates the code instantly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-8E44AD.svg)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg?logo=vite)

## ✨ Features

* **🗣️ Natural Language to Code:** Generate Node.js, Python, or Java logic from prompts like *"Filter this user array by active status."*
* **⚡ Instant Simulation:** Run and test the generated code immediately within the browser sandbox.
* **🛡️ Security Audit:** Built-in static analysis to detect hardcoded secrets or overly permissive IAM roles.
* **📚 Snippet Library:** One-click injection of common AWS patterns (S3 triggers, DynamoDB lookups).
* **🌗 Modern UI:** A responsive, dark-mode interface crafted with Tailwind CSS.

## 🛠️ Tech Stack

* **Frontend:** React 19 (Vite)
* **Styling:** Tailwind CSS + Lucide React
* **AI Engine:** Google Gemini 2.5 Flash
* **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* A [Google AI Studio](https://aistudio.google.com/) API Key.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/giridamodaran/LambdaForge.git](https://github.com/giridamodaran/LambdaForge.git)
    cd LambdaForge
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```bash
    touch .env
    ```
    
    Add your Gemini API key (Must use `VITE_` prefix):
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the Application**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view it in the browser.


## 🤝 Contributing

We love contributions! Open an issue or submit a PR.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
