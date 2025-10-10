import { environment } from "@/environment";

export function getUserByUserId(user_id, with_chat = true) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/user/${user_id}?chats=${with_chat}`);
}

export function getProfileForUser(user_id) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/user/${user_id}/profile`);
}

export function getPersonaDescription(user_id) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/user/${user_id}/persona-description`);
}
