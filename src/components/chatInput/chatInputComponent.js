import { useState } from "react";
import styles from "./ChatInput.module.css"; // your styles

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim() !== "") {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed) return; // prevent sending empty messages
    onSend(trimmed); // send the value to parent
    setValue(""); // clear input after send
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={send}
        className={styles.sendButton}
        disabled={value.trim() === ""} // disable if empty
      >
        &#9658;
      </button>
    </div>
  );
}
