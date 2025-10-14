import styles from "../../styles/profile.module.css";
import { useEffect, useState } from "react";

import { useUser } from "@/context/userContext";
import { useNavbar } from "@/context/NavbarContext";
import { useRouter } from "next/router";
import {
  getProfileForUser,
  getPersonaDescription,
} from "@/services/userService";

import {
  MapPin,
  SquarePen,
  Heart,
  MessageCircle,
  Settings,
} from "lucide-react";

export default function ProfilePage() {
  const { userId } = useUser();
  const { updateNavbar, resetNavbar } = useNavbar();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [personaData, setPersonaData] = useState(null);

  const [profileLoading, setProfileLoading] = useState(true);
  const [personaLoading, setPersonaLoading] = useState(true);

  const [error, setError] = useState(null);

  const routeToConversation = () => {
    router.push("/conversation");
  };

  const routeToSettings = () => {
    router.push("/profile/settings");
  };

  const routeToMatches = () => {
    router.push("/matches");
  };

  useEffect(() => {
    updateNavbar({
      title: "Myself",
      subtitle: "Online",
      avatar: false,
      //   backRoute: "/profile",
    });
    if (!userId) return;

    // ✅ Run both in parallel but handle separately
    const fetchProfile = async () => {
      try {
        const res = await getProfileForUser(userId);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const json = await res.json();
        setProfileData(json.data);
      } catch (err) {
        console.error(err);
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchPersona = async () => {
      try {
        const res = await getPersonaDescription(userId);
        if (!res.ok) throw new Error("Failed to fetch persona");
        const json = await res.json();
        setPersonaData(json.data);
      } catch (err) {
        console.error(err);
        setPersonaError(err.message);
      } finally {
        setPersonaLoading(false);
      }
    };

    // Run both simultaneously
    fetchProfile();
    fetchPersona();
  }, [userId]);

  if (profileLoading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles["image-container"]}>
        <div className={styles.heading}>
          <div className={styles["heading-content"]}>
            <h1>{profileData.user.name || "No name"}</h1>
            <div className={styles.subcontent}>
              <MapPin />
              <p>
                {profileData?.user?.location
                  ? `${profileData.user.location.city || ""}${
                      profileData.user.location.state
                        ? `, ${profileData.user.location.state}`
                        : ""
                    }${
                      profileData.user.location.country_code
                        ? `, ${profileData.user.location.country_code}`
                        : ""
                    }`.trim() || "Location not available"
                  : "Location not available"}
              </p>
            </div>
          </div>
          <div className={styles["edit-button"]} onClick={routeToSettings}>
            <SquarePen size={18} />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <div
            className={[styles.section, styles.column].join(" ")}
            onClick={routeToMatches}
          >
            <Heart size={25} color="#09CC7F" />
            <h1>{profileData["matches_count"]}</h1>
            <div className={styles.subtext}>Total Matches</div>
          </div>
          <div
            className={[styles.section, styles.column].join(" ")}
            onClick={routeToConversation}
          >
            <MessageCircle size={25} color="#09CC7F" />
            <h1> {profileData["conversation_count"]}</h1>
            <div className={styles.subtext}>Conversations</div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.section}>
            <h1>About You</h1>

            {personaLoading ? (
              <div className={styles.skeleton}></div>
            ) : (
              <p>
                {personaData?.persona || "No persona description available."}
              </p>
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <h1>Interests</h1>
            <div className={styles.tags}>
              {(profileData?.interests || []).map((interest, idx) => (
                <div key={idx} className={styles.tag}>
                  {interest}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <h1>Photos</h1>
            <div className={styles["place-holder"]}>Nothing to show here</div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.button} onClick={routeToSettings}>
            <Settings size={20} />
            <p>Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
