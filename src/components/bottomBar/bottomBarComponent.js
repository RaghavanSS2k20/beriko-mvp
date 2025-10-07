import { useRouter } from "next/router";
import styles from "./bottombar.module.css";
import { FaUser, FaComments, FaRobot, FaHeart } from "react-icons/fa";

const tabs = [
  { path: "/matches", label: "Matches", icon: <FaHeart /> },
  { path: "/conversations", label: "Chats", icon: <FaComments /> },
  { path: "/chat", label: "AI", icon: <FaRobot /> },
  { path: "/profile", label: "Profile", icon: <FaUser /> },
];

export default function TabBar() {
  const router = useRouter();

  const handleClick = (path) => {
    if (router.pathname !== path) {
      router.push(path); // client-side navigation
    }
  };

  return (
    <nav className={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = router.pathname === tab.path;
        return (
          <div
            key={tab.path}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => handleClick(tab.path)}
          >
            <div className={styles.icon}>{tab.icon}</div>
            <span className={styles.label}>{tab.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
