import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function handleAtomaCompletion(
  prompt: string,
) {
  try {

    const openAIClient = createOpenAI({
        apiKey: process.env.ATOMA_API_KEY,
        baseURL: "https://api.atoma.network/v1",
    });

    const model = openAIClient("deepseek-ai/DeepSeek-R1");

    const result = await generateText({
      model,
      prompt: prompt
    });

    if (!result.text) {
      throw new Error(`No response content received`);
    }

    return { textStream: [result.text] };

  } catch (error) {
    throw new Error(
      `Failed to get response from atoma. Please try again or use a different model.`
    );
  }
}