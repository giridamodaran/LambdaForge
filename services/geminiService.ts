import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode, CodeLanguage, SecurityReport } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLambdaCode = async (
  prompt: string,
  language: CodeLanguage
): Promise<Omit<GeneratedCode, 'id' | 'timestamp' | 'prompt'>> => {
  const ai = getClient();
  
  const sysInstruction = `You are a Senior AWS Serverless Engineer. 
  Your task is to generate production-ready, secure, and efficient AWS Lambda function code based on the user's request.
  
  Guidelines:
  1. Use the requested runtime (${language}).
  2. For Node.js, use ES Modules (import/export) and AWS SDK v3.
  3. For Python, use Boto3.
  4. For Java, use AWS SDK v2, return a class named 'Handler' implementing RequestHandler, and standard imports.
  5. Include clear comments explaining the logic.
  6. Handle errors gracefully.
  7. Return a JSON object with the code, filename, dependencies, and a brief explanation.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: sysInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: {
            type: Type.STRING,
            description: "The complete source code for the Lambda function. For Java, ensure the class name matches the filename."
          },
          filename: {
            type: Type.STRING,
            description: "The appropriate filename. e.g., index.mjs, lambda_function.py, or Handler.java"
          },
          explanation: {
            type: Type.STRING,
            description: "A short paragraph explaining how the code works and any setup required."
          },
          dependencies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of npm packages, pip libraries, or Maven coordinates required."
          }
        },
        required: ["code", "filename", "explanation", "dependencies"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    const data = JSON.parse(text);
    return {
      code: data.code,
      filename: data.filename,
      explanation: data.explanation,
      dependencies: data.dependencies || [],
      language: language
    };
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse AI response");
  }
};

export const analyzeCodeSecurity = async (code: string, language: string): Promise<SecurityReport> => {
  const ai = getClient();
  
  const sysInstruction = `You are an expert Security Engineer specializing in Cloud Serverless applications.
  Analyze the provided ${language} code for security vulnerabilities.
  
  Focus on:
  1. IAM Permissions (Least Privilege).
  2. Hardcoded Secrets (API Keys, Credentials).
  3. Input Validation (Injection attacks).
  4. Exception Handling (Information leakage).
  5. Insecure dependencies or practices.
  
  Return a JSON report.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: code,
    config: {
      systemInstruction: sysInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "Security score from 0 (critical insecure) to 100 (secure)."
          },
          summary: {
            type: Type.STRING,
            description: "A brief summary of the security posture."
          },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              },
              required: ["severity", "title", "description", "suggestion"]
            }
          }
        },
        required: ["score", "summary", "issues"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as SecurityReport;
};
