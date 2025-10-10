import { environment } from "@/environment";

export function getConversationForUserId(user_id) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/conversation/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getConversationById(conversation_id) {
  if (!conversation_id) return;

  return fetch(`${environment.apiUrl}/conversation/detail/${conversation_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function createConversation(user_id, participant2) {
  if (!user_id || !participant2) {
    console.log("No participant : ", user_id, participant2);
    return;
  }
  const participant1 = user_id;

  // Make a sorted array of participants
  const participants = [participant1, participant2].sort();
  console.log("participants", participants);

  return fetch(`${environment.apiUrl}/conversation/${user_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participants }),
  });
}
