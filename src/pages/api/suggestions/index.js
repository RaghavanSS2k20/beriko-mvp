export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { question = "" } = req.body;
  const q = question.toLowerCase();

  let suggestions = [];

  // 🔹 START STATE
  if (!q) {
    suggestions = [
      "I am a recruiter",
      "Just want to know about him",
      "Whats Beriko?",
    ];
  }

  // 🔹 RECRUITER FLOW
  else if (q.includes("recruiter")) {
    suggestions = [
      "Why should I hire him?",
      "What is his experience?",
      "What are his skills?",
    ];
  }

  // 🔹 HIRING / VALUE
  else if (q.includes("hire")) {
    suggestions = [
      "What kind of problems can he solve?",
      "Has he worked on real-world systems?",
      "What makes him different from others?",
    ];
  }

  // 🔹 EXPERIENCE FLOW
  else if (q.includes("experience")) {
    suggestions = [
      "What projects has he worked on?",
      "What technologies does he use?",
      "Any notable achievements?",
    ];
  }

  // 🔹 SKILLS FLOW
  else if (q.includes("skills") || q.includes("work")) {
    suggestions = [
      "Is he strong in backend or frontend?",
      "Does he work with AI systems?",
      "What languages does he prefer?",
    ];
  }

  // 🔹 PROJECT FLOW
  else if (q.includes("projects")) {
    suggestions = [
      "Tell me about Beriko",
      "What is Staybroke?",
      "What kind of systems does he build?",
    ];
  }

  // 🔥 BERIKO FLOW (IMPORTANT)
  else if (q.includes("beriko")) {
    suggestions = [
      "What problem is Beriko solving?",
      "How does Beriko work?",
      "What makes Beriko different from other dating apps?",
    ];
  }

  // 🔥 BERIKO DEEPER
  else if (q.includes("dating") || q.includes("problem")) {
    suggestions = [
      "How does it match people?",
      "What is personality-based matching?",
      "Is it using AI conversations?",
    ];
  }

  // 🔹 COLLAB FLOW
  else if (q.includes("collaborate")) {
    suggestions = [
      "What can we build together?",
      "Is he open to startups?",
      "How can I reach out to him?",
    ];
  }

  // 🔹 GENERAL / FORMAL FLOW
  else if (
    q.includes("know about him") ||
    q.includes("about him") ||
    q.includes("who is he")
  ) {
    suggestions = [
      "What are his interests?",
      "What does he enjoy building?",
      "What is his background?",
    ];
  }

  // 🔹 INTERESTS FLOW
  else if (q.includes("interests")) {
    suggestions = [
      "Does he play any instruments?",
      "What kind of music does he like?",
      "Is he into sports or movies?",
    ];
  }

  // 🔹 MUSIC / PERSONAL
  else if (q.includes("music") || q.includes("instrument")) {
    suggestions = [
      "Does he play violin seriously?",
      "What kind of film scores does he like?",
      "Who is his favorite composer?",
    ];
  }

  // 🔹 DEFAULT FALLBACK
  else {
    suggestions = [
      "Tell me about his work",
      "What is he building right now?",
      "What are his main strengths?",
    ];
  }

  return res.status(200).json({
    success: true,
    suggestions,
  });
}
