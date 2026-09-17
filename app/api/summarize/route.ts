import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text provided" }, { status: 400 });
    }

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return NextResponse.json({ error: "Text cannot be empty or whitespace only" }, { status: 400 });
    }

    if (trimmedText.length < 50) {
      return NextResponse.json({ error: "Text must be at least 50 characters long" }, { status: 400 });
    }

    if (trimmedText.length > 5000) {
      return NextResponse.json({ error: "Text cannot exceed 5000 characters" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set.");
      return NextResponse.json({ error: "AI service configuration is missing." }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a concise summarization assistant. Summarize the provided text accurately without adding information that is not present. Return your answer as a short summary in exactly 3 bullet points."
        },
        {
          role: "user",
          content: trimmedText
        }
      ],
      model: "groq/compound-mini", 
      temperature: 0.5,
    });

    const summary = chatCompletion.choices[0]?.message?.content;

    if (!summary) {
      console.error("Groq API returned an empty response.");
      return NextResponse.json({ error: "Failed to generate summary from AI provider." }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error during summarization:", error);
    return NextResponse.json({ error: "Failed to process request and generate summary." }, { status: 500 });
  }
}
