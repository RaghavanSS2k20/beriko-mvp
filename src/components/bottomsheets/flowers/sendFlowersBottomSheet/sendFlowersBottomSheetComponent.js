import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import styles from "./sendFlowers.module.css";
import { sendFlower } from "@/services/flowerService";

export default function SendFlowersBottomSheet({
  open,
  onClose,
  children,
  data,
  ...props
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!data?.sender_id || !data?.receiver_id || !input.trim()) return;

    try {
      setLoading(true);

      const res = await sendFlower(
        data.sender_id,
        data.receiver_id,
        input.trim()
      );

      // ✅ success
      onClose();
      setInput("");
    } catch (err) {
      console.log("Error sending flower:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet isOpen={open} onClose={onClose} detent="content" {...props}>
      <Sheet.Container>
        <Sheet.Header>
          <h3 className={styles.heading}>send flowers</h3>
        </Sheet.Header>

        <Sheet.Content>
          {children || (
            <div className={styles.container}>
              <p className={styles.title}>
                What Made This Profile So Beautiful To Stop?
              </p>

              <input
                className={styles.input}
                placeholder="short and sweet here please"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                className={styles.ctaButton}
                onClick={handleSend}
                disabled={!input.trim() || loading} // ✅ disabled when empty/just spaces
              >
                {loading ? "Sending..." : "Send!"}
              </button>

              <p className={styles.footerNote}>your flower lasts 24hrs!</p>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
