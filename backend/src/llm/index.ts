import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
export const llm = google('gemini-2.0-flash')