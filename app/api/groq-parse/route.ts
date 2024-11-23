/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { PROMPTS, PromptType } from "@/lib/prompts";
import { extractJsonArray } from "@/lib/utils";

interface Message {
  role: string;
  content: {
    type: string;
    text?: string;
    image_url?: {
      url: string;
    };
  }[];
}

interface GroqRequest {
  messages: Message[];
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
  stop: null;
}

interface RequestBody {
  imageUrl: string;
  analysisType: PromptType;
  apiKey: string;
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, analysisType, apiKey } = await request.json() as RequestBody;

    if (apiKey !== process.env.GLOBAL_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API Key" },
        { status: 401 }
      );
    }

    const prompt = PROMPTS[analysisType].text;
    console.log("Prompt:", prompt);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const groqPayload: GroqRequest = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    };

    console.log("Sending request to Groq API...");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(groqPayload),
      }
    );

    console.log("Groq response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API Groq:", errorText);
      throw new Error(`Groq API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Groq API response:", data);

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid API response:", data);
      throw new Error("Invalid API response");
    }

    // Extrai o array JSON da resposta
    const menuItems = extractJsonArray(data.choices[0].message.content);
    console.log("Items extracted:", menuItems);

    return NextResponse.json({ 
      choices: [{ 
        message: { 
          content: JSON.stringify(menuItems) 
        } 
      }] 
    });
  } catch (error: any) {
    console.error("Full error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to parse menu",
        details: error.stack
      },
      { status: 500 }
    );
  }
}
