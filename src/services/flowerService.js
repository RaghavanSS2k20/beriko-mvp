import { environment } from "@/environment";

export function getFlowersForUser(user_id) {
  if (!user_id) return;

  return fetch(`${environment.apiUrl}/flower/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function deleteFlower(flower_id, user_id, reject = false) {
  if (!flower_id || !user_id) return;

  const url = `${environment.apiUrl}/flower/${flower_id}?reject=${reject}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user_id, // backend expects user_id in body
    }),
  });
}
export function sendFlower(sender_id, reciver_id, note) {
  if (!sender_id || !reciver_id || !note) {
    return;
  }
  const body = {
    sender_id: sender_id,
    receiver_id: reciver_id,
    note: note,
  };

  return fetch(`${environment.apiUrl}/flower/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function checkFlowers(sender_id, receiver_id) {
  if (!sender_id || !receiver_id) return;

  const query = `sender_id=${sender_id}&receiver_id=${receiver_id}`;

  return fetch(`${environment.apiUrl}/flower/check?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
