// components/MatchCard.tsx
import styles from "./profilecard.module.css";
import { Star } from "lucide-react";
import { X } from "lucide-react";
import { MessageCircleHeart } from "lucide-react";
import { Heart } from "lucide-react";

export default function ProfileCard({
  name,
  age,
  location,
  matchPercent,
  description,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>
          <div className={`${styles.badge} ${styles.ai}`}>AI Match</div>
          <div className={`${styles.badge}`}>
            <Star strokeWidth={1.25} size={"15px"} color="#09c092" />
            92%
          </div>
        </div>
        <div className={styles.userDetails}>
          <h1>Saroja Devi</h1>
          <p>Chinnalampatti, Madurai</p>
          <p>94% match</p>
        </div>
      </div>
      <div className={styles.actionPanel}>
        <div className={styles.row}>
          <p>TEst test test test test test test</p>
        </div>
        <div className={styles.row}>
          <button className={styles.ghost}>
            <X strokeWidth={1.25} size={15} />
            <p>Reject</p>
          </button>
          <button className={styles.primary}>
            {" "}
            <MessageCircleHeart strokeWidth={1.25} size={15} /> <p>Chat</p>
          </button>
          {/* <button className={styles.primary}>
            <Heart strokeWidth={1.55} size={15} color="white" /> <p>Like</p>
          </button> */}
        </div>
      </div>
    </div>
  );
}
