import { useRouter } from "next/router";
import { useUser } from "@/context/userContext";
import styles from "@/styles/Home.module.css";
import { environment } from "@/environment";
import { useState } from "react";

export default function Home() {
  const { userId, setUserId } = useUser();
  const router = useRouter();
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const name = isExistingUser ? null : form.name.value.trim();

    if (!username || (!isExistingUser && !name)) return;

    try {
      if (isExistingUser) {
        // ✅ Existing user: just check if user exists
        const check = await fetch(`${environment.apiUrl}/user/${username}`);
        if (!check.ok) throw new Error("User not found");

        setUserId(username);
        router.push("/matches");
      } else {
        // 🆕 New user: register
        const res = await fetch(`${environment.apiUrl}/user/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: username, name }),
        });

        if (!res.ok) throw new Error("Failed to register");

        setUserId(username);
        router.push("/matches");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(
        isExistingUser ? "User not found!" : "Something went wrong, try again!"
      );
    }
  };

  // If already logged in, skip landing
  if (userId) {
    router.push("/matches");
    return null;
  }

  return (
    <div className={styles.landing}>
      <div className={styles.heroText}>
        <h1>Say Bye To Endless Swipes With Beriko</h1>
        <p>Get meaningful connections that last longer</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input type="text" name="username" placeholder="Username" />
        {!isExistingUser && (
          <input type="text" name="name" placeholder="Name" />
        )}
        <button type="submit">{isExistingUser ? "Login" : "Register"}</button>
      </form>

      <div className={styles.toggleLink}>
        {isExistingUser ? (
          <p>
            New here?{" "}
            <span onClick={() => setIsExistingUser(false)}>Create account</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsExistingUser(true)}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
}
