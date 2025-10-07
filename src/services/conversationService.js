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
