import { ask } from "@/backend/agents/me/service";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { question } = req.body;

      if (!question || question.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Question is required",
        });
      }

      // const reply = await ask(question);
      const reply = `Hey there! So glad you asked! Raghavan M is a really cool software engineer from Coimbatore, India, who absolutely loves building systems from scratch and creating products that actually make a difference. He's super passionate about turning ideas into practical software solutions that people can use.

He's done some amazing work, like enhancing a Q&A platform into an LLM-powered conversational system, and even built an AI-driven dating platform called Beriko! But he's not just about code – he's also a passionate VIT student, loves film scores (especially Clint Mansell's!), and is a big fan of Formula 1. He's definitely someone who brings a lot of creativity and passion to everything he does.`;

      return res.status(200).json({
        success: true,
        response: reply,
      });
    } catch (error) {
      console.error("❌ Chat Error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get response",
      });
    }
  }
}
