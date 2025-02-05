import { openai } from "@/app/openai";

// Handle chat completion requests
export async function POST(request) {
  try {
    const {
      messages,
      model = "gpt-4o",
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be an array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: "json_object" },
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
