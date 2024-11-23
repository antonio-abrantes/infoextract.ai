/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { PROMPTS, PromptType } from "@/lib/prompts";
import { extractJsonArray } from "@/lib/utils";
// import { z } from "zod";
// import { zodResponseFormat } from "openai/helpers/zod";
// import { zodToJsonSchema } from 'zod-to-json-schema';

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

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }
    
    // const requestSchema = z.array(
    //   z.object({
    //     codigo: z.string().nullable().describe("The code of the menu item"),
    //     name: z.string().nullable().describe("The name of the menu item"),
    //     price: z.string().nullable().describe("The price of the menu item"),
    //     category: z.string().nullable().describe("The category of the menu item"),
    //     description: z
    //       .string()
    //       .nullable()
    //       .describe(
    //         "The description of the menu item. If this doesn't exist, please write a short one sentence description."
    //       ),
    //   })
    // );

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const menuItems = extractJsonArray(data.choices[0].message.content);

    return NextResponse.json({
      choices: [{
        message: {
          content: JSON.stringify(menuItems)
        }
      }]
    });
  } catch (error: any) {
    console.error("Parse menu error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse menu" },
      { status: 500 }
    );
  }
}