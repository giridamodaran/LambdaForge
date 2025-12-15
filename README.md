# Lambda Forge 🚀

**Lambda Forge** is an AI-powered web application designed to accelerate the development of AWS Lambda functions. By leveraging the **Google Gemini API**, it generates production-ready, secure, and efficient serverless code from simple natural language prompts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Gemini API](https://img.shields.io/badge/AI-Gemini-8e44ad.svg)

## ✨ Features

- **AI Code Generation**: Instantly generate AWS Lambda functions in **Node.js**, **Python**, and **Java** based on textual descriptions.
- **Security Scanning**: Built-in static analysis tool to detect vulnerabilities (e.g., IAM permission issues, hardcoded secrets) and suggest fixes.
- **Snippet Library**: Access a repository of common AWS patterns (S3, DynamoDB, etc.) to quickly insert into your code.
- **History Management**: Automatically saves your generation history for quick retrieval.
- **Multi-Runtime Support**:
  - Node.js (AWS SDK v3)
  - Python (Boto3)
  - Java (AWS SDK v2)
- **Modern UI**: Built with React and Tailwind CSS for a dark-mode, developer-centric experience.

## 🛠️ Technologies

- **Frontend**: React 19, Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (`@google/genai`)
- **Icons**: Lucide React
- **Build/Bundling**: ES Modules (setup via importmap for lightweight usage or Vite for production)

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A **Google Cloud Project** with the **Gemini API** enabled.
- An API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lambda-forge.git
   cd lambda-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables** 🔑
   
   > **Important**: This application requires a valid Google Gemini API Key to function.
   
   Create a `.env` file in the root directory (or rename `.env.example` if provided):
   
   ```bash
   touch .env
   ```
   
   Add your API Key to the file:
   ```env
   # .env
   API_KEY=your_google_gemini_api_key_here
   ```
   
   *Note: Ensure your bundler (e.g., Vite, Webpack) is configured to expose this key as `process.env.API_KEY` or `import.meta.env` depending on your build setup.*

4. **Run the Application**
   ```bash
   npm start
   ```

## 📖 Usage

1. **Login**: Click "Continue with Google/GitHub" (Mock authentication is enabled for demo purposes).
2. **Generate**:
   - Select your runtime (Node.js, Python, or Java).
   - Type a prompt: *"Create a function that triggers on S3 upload and creates a thumbnail."*
   - Click **Generate**.
3. **Refine**:
   - Use the **Snippet Library** (right sidebar) to inject code blocks.
   - Run the **Security Scanner** (right sidebar) to audit your code.
4. **Export**: Copy the code to your clipboard or download the file directly.

## 🛡️ Security

This app uses AI to generate code. While the built-in **Security Scanner** helps identify common pitfalls, always review generated code and IAM policies before deploying to a production AWS environment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
