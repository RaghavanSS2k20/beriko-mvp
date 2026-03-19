import { addToWaitlist } from "@/backend/services/db";
export default async function handler(req, res) {
  // only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await addToWaitlist();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Waitlist API error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
