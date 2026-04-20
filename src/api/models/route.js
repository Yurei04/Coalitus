import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are an emotionally intelligent AI assistant in a cyberpunk terminal interface. Be concise (2-3 sentences), thoughtful, and genuine. Match the user's energy.",
        },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "Signal lost. Reconnecting…";
    return Response.json({ content });
  } catch (error) {
    console.error("Groq API error:", error);
    return Response.json({ error: "Chat error", content: "⚠ Groq connection failed. Check your GROQ_API_KEY." }, { status: 500 });
  }
}
