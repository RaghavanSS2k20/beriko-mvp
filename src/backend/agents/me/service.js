import { model } from "./llm";
import { prompt } from "./prompt";
import fs from "fs";
import path from "path";

export async function ask(question) {
  console.log("User question:", question);

  const filePath = path.join(process.cwd(), "data", "UserContext.xml");
  const userContextXml = fs.readFileSync(filePath, "utf-8");

  const finalPrompt = prompt(question, userContextXml);

  const result = await model.models.generateContent({
    model: "gemini-2.5-flash",
    contents: finalPrompt,
  });
  const reply = result.text;

  console.log("Beriko reply:", reply);

  return reply;
}

export async function berikoInit() {
  console.log("Initializing Beriko...");

  const filePath = path.join(process.cwd(), "data", "user-context.xml");
  const userContextXml = fs.readFileSync(filePath, "utf-8");

  const finalPrompt = BERIKO_INIT_PROMPT(userContextXml);

  const result = await model.generateContent(finalPrompt);
  const response = result.response.text();

  // Parse the response
  const greeting = response
    .split("GREETING:")[1]
    ?.split("SUGGESTIONS:")[0]
    ?.trim();
  const suggestionsText = response.split("SUGGESTIONS:")[1]?.trim();
  const suggestions = suggestionsText
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line.length > 0);

  console.log("Beriko initialized:", { greeting, suggestions });

  return { greeting, suggestions };
}
