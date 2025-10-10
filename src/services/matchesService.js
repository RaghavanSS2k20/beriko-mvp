import { environment } from "@/environment";

export function getMatches(user_id) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/user/${user_id}/matches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
