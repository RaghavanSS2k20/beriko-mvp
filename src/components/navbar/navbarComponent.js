import { useRouter } from "next/router";
// import { ChevronLeft, Filter } from "lucide-react";
import { useNavbar } from "@/context/NavbarContext";

import styles from "./navbar.module.css";
import { ChevronLeft, Filter, User, MessageCircle } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const { navbarData } = useNavbar();
  const { title, showFilter, avatar, subtitle, backRoute } = navbarData;

  const isActive = router.pathname === "/conversation";
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Left Section — back + avatar + title */}
        <div className={styles.leftSection}>
          {backRoute && backRoute.length > 0 && (
            <button
              className={styles.backBtn}
              onClick={() => router.push(backRoute)}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div className={styles.headerGroup}>
            {avatar && (
              <div className={styles.chatAvatar}>
                <User className={styles.icon} />
              </div>
            )}
            <h1 className={styles.navTitle}>{title}</h1>
          </div>
        </div>

        {/* Right Section — filter button */}
        <div className={styles.rightElements}>
          {showFilter && (
            <button className={styles.filterBtn}>
              <Filter size={17} />
            </button>
          )}
          <button
            className={styles.filterBtn}
            style={{
              color: isActive ? "#09cc7f" : "inherit",
            }}
            onClick={() => router.push("/conversation")}
          >
            <MessageCircle size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  );
}
