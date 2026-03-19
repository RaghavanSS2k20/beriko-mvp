import { useEffect, useState } from "react";
import { useNavbar } from "@/context/NavbarContext";
import { getMatches } from "@/services/matchesService";
import ProfileCard from "@/components/profileCard/profileCard.component";
import styles from "../styles/matches.module.css";
import { markUserFamiliar } from "@/services/userService";

import {
  getConversationBetweenUsers,
  getConversationForUserId,
} from "@/services/conversationService";

import { useUser } from "@/context/userContext";
import DescribeBottomSheet from "@/components/bottomsheets/flowers/describeBottomSheet/describeBottomSheetComponent";
import SendFlowersBottomSheet from "@/components/bottomsheets/flowers/sendFlowersBottomSheet/sendFlowersBottomSheetComponent";
import { checkFlowers } from "@/services/flowerService";
import AlertBottomSheet from "@/components/bottomsheets/alertBottomSheet/alertBottomSheetComponent";

import Router, { useRouter } from "next/router";

export default function MatchesScreen() {
  const { updateNavbar, resetNavbar } = useNavbar();
  const router = useRouter();
  const { userId, user } = useUser();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [openDescriptionSheet, setOpenDescriptionSheet] = useState(false);
  const [openSendFlowerSheet, setOpenSendFlowerSheet] = useState(false);
  const [openAlertSheet, setOpenAlertSheet] = useState(false);

  async function fetchConversations() {
    try {
      const res = await getConversationForUserId(userId);
      if (!res.ok) throw new Error("Error fetching conversations");

      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

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
        const conversations = await fetchConversations();

        // Build a Set of all user_ids the current user already has conversation with
        const chatUserIds = new Set();

        conversations.forEach((conv) => {
          conv.participants.forEach((p) => {
            if (p.user_id !== userId) {
              chatUserIds.add(p.user_id);
            }
          });
        });

        // Now fetch matches
        const response = await getMatches(userId);
        if (!response.ok) {
          throw new Error(`Error fetching matches: ${response.statusText}`);
        }

        const data = await response.json();
        const matchList = data.data || [];

        // Attach chatable flag to each match
        const enrichedMatches = matchList.map((item) => {
          const profileId = item.user_id; // Match's user_id
          return {
            ...item,
            chatable: chatUserIds.has(profileId), // true/false
          };
        });

        console.log(matches);

        setMatches(enrichedMatches);
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

  async function handleOpenSheet(data) {
    console.log("user Here : ", data);
    setSelectedProfile(data);

    const isMutual = data.mutual;
    if (isMutual) {
      try {
        const conversation_res = await getConversationBetweenUsers(
          userId,
          data.id
        );
        const conversation = await conversation_res.json();
        const conversation_id = conversation?.data?.conversation_id;

        if (conversation_id) {
          // Navigate to the conversation page
          router.push(`/conversation/${conversation_id}`);
          return; // Exit the function after navigation
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    } else {
      let check = false;
      try {
        const res = await checkFlowers(userId, data.id);
        if (res.ok) {
          check = true;
        }
        if (check) {
          if (user?.is_familiar === true) {
            // Already familiar → directly open Send Flower
            setOpenSendFlowerSheet(true);
            return;
          }

          if (user?.is_familiar === false || user?.is_familiar === undefined) {
            // Show Describe sheet first
            setOpenDescriptionSheet(true);
          }
        } else {
          setOpenAlertSheet(true);
        }
      } catch (error) {
        console.error("Error checking flowers:", error);
      }
    }
  }

  function temp_testOpenSheet() {
    console.log("POPENINGNNDFNS");
  }

  function temp_handleOpenSheet(value) {
    console.log("openming sheet : ");
    setOpenSendFlowerSheet(value);
  }

  async function handleDescribeClose() {
    console.log("Closing Describe Sheet...");
    // setOpenDescriptionSheet(false);

    try {
      // Patch API → mark familiar
      const response = await markUserFamiliar(userId);
      if (!response.ok) {
        throw new Error(`Error marking user: ${response.statusText}`);
      }

      console.log("Marked familiar successfully");

      // Give a tiny delay to ensure previous sheet has closed
      setTimeout(() => {
        // setOpenSendFlowerSheet(true);
        temp_handleOpenSheet(true);
      }, 200); // 200ms delay usually works well
    } catch (err) {
      console.log("Error marking familiar:", err);
    }
  }

  return (
    <>
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
              mutual={profile.mutual_match}
              handleSendFlowersClick={handleOpenSheet}
            />
          ))
        )}
      </div>
      <DescribeBottomSheet
        open={openDescriptionSheet}
        onClose={() => setOpenDescriptionSheet(false)}
        onCloseEnd={handleDescribeClose}
        data={selectedProfile}
      />

      <SendFlowersBottomSheet
        open={openSendFlowerSheet}
        onOpenStart={temp_testOpenSheet}
        onClose={() => setOpenSendFlowerSheet(false)}
        data={{
          sender_id: userId,
          receiver_id: selectedProfile?.id,
        }}
      />

      <AlertBottomSheet
        open={openAlertSheet}
        onClose={() => setOpenAlertSheet(false)}
      />
    </>
  );
}
