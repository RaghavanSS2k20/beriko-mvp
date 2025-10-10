import { useEffect, useState } from "react";
import { useNavbar } from "@/context/NavbarContext";
import { getMatches } from "@/services/matchesService";
import ProfileCard from "@/components/profileCard/profileCard.component";
import styles from "../styles/matches.module.css";

import { useUser } from "@/context/userContext";

export default function MatchesScreen() {
  const { updateNavbar, resetNavbar } = useNavbar();
  const { userId } = useUser();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updateNavbar({
      title: "Matches",
      subtitle: "Online",
      avatar: false,
    });

    async function fetchMatches() {
      setLoading(true);
      setError(null);

      try {
        const response = await getMatches(userId);
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error fetching matches: ${response.statusText}`);
        }
        const data = await response.json();
        setMatches(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();

    return () => resetNavbar();
  }, [userId]);

  if (loading) {
    return <div className={styles.loading}>Loading matches...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        matches.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            name={profile.user_data.name}
            age={profile.age}
            id={profile.user_id}
            location={profile.location}
            matchPercent={profile.score * 100}
            description={profile.insight}
          />
        ))
      )}
    </div>
  );
}
