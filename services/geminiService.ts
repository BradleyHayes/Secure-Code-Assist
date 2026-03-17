
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvisorResponse, RiskType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sentinel Local-LLM acts as the SECOND-PASS VERIFIER and SENIOR ADVISOR.
 * It reviews the output of the deterministic C# engine and suggests additional redactions.
 */
export const performAIReviewAndAdvice = async (filename: string, cleanedCode: string): Promise<AIAdvisorResponse> => {
  const systemInstruction = `You are a Senior IT Advisor and QA Security Auditor.
Your task is to review code that has been processed by a deterministic redaction engine.

1. VERIFICATION: Look for any missed secrets, internal URLs, or credentials that the regex engine might have missed.
2. HIGH PRIORITY TARGETS: Ensure the following are redacted:
   - Company name: "Premise"
   - Keywords: "health", "premise"
   - Names: "Brad", "Bradley"
3. ADVICE: Provide senior-level architecture advice based on the code's logic.
3. FAIL CONDITION: If you see a clear credential or internal hostname, flag it explicitly.

You must return your response in JSON format matching this schema:
{
  "report": "A long, detailed markdown report for the user",
  "recommendations": [
    {
      "originalText": "the exact string missed",
      "reason": "why it should be redacted",
      "type": "one of RiskType: CREDENTIAL, API_SECRET, COMPANY_NAME, PRIVATE_URL, PII"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Review the following REDACTED code. 
      Filename: ${filename}
      ---
      ${cleanedCode}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          report: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalText: { type: Type.STRING },
                reason: { type: Type.STRING },
                type: { type: Type.STRING, enum: Object.values(RiskType) }
              },
              required: ["originalText", "reason", "type"]
            }
          }
        },
        required: ["report", "recommendations"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      report: data.report || "No report generated.",
      recommendations: data.recommendations || []
    };
  } catch (e) {
    console.error("AI Advisor failed to produce structured JSON", e);
    return {
      report: response.text || "Report parsing error.",
      recommendations: []
    };
  }
};
