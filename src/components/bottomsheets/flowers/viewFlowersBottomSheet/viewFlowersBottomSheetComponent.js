import styles from "./viewFlower.module.css";
import { Sheet } from "react-modal-sheet";

export default function ViewFlowersBottomSheet({
  open,
  onClose,
  children,
  data,
  onDelete
}) {
  console.log("data here : ", data);

  const type = data?.type;

  // ----- TIME DIFFERENCE FUNCTION -----
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // ----- LABEL (From / To) -----
  const userLabel =
    data?.type === "received"
      ? `From ${data?.sender_id}`
      : `To ${data?.receiver_id}`;

  return (
    <Sheet isOpen={open} onClose={onClose} detent="content">
      <Sheet.Container>
        <Sheet.Header>
          <h3 className={styles.heading}>Flower</h3>
        </Sheet.Header>

        <Sheet.Content>
          {children || (
            <div className={styles.wrapper}>
              <div className={styles.card}>
                {/* Top section */}
                <div className={styles.userRow}>
                  <div className={styles.avatar}></div>

                  <div className={styles.userDetails}>
                    <p className={styles.name}>{userLabel}</p>
                    <span className={styles.time}>
                      {getTimeAgo(data?.created_at)}
                    </span>
                  </div>
                </div>

                {/* Message box */}
                <div className={styles.messageBox}>{data?.note}</div>

                {/* Buttons */}
                <div className={styles.btnRow}>
                  {/* Accepted uses data.status */}
                  {data?.status === "accepted" && (
                    <button className={styles.accept}>Chat With Them</button>
                  )}

                  {/* Others use type */}
                  {data?.status !== "accepted" && type === "received" && (
                    <>
                      <button onClick={onDelete} className={styles.reject}>Reject it</button>
                      <button className={styles.accept}>Accept it</button>
                    </>
                  )}

                  {data?.status !== "accepted" && type === "sent" && (
                    <button className={styles.accept}>Unsend</button>
                  )}
                </div>
                {/* Footer */}
                <p className={styles.footerNote}>This flower lasts 24hrs!</p>
              </div>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
