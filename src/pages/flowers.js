import { Tabs } from "@chakra-ui/react";
import styles from "../styles/flowers.module.css";
import { useState, useEffect } from "react";
import ViewFlowersBottomSheet from "@/components/bottomsheets/flowers/viewFlowersBottomSheet/viewFlowersBottomSheetComponent";
import {
  deleteFlower as apiDeleteFlower,
  getFlowersForUser,
} from "@/services/flowerService";
import { useUser } from "@/context/userContext";
import { useNavbar } from "@/context/NavbarContext";
import { EmptyState } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { CircleCheck } from "lucide-react";

const FlowerPage = () => {
  const { userId } = useUser();
  const { updateNavbar, resetNavbar } = useNavbar();

  const [openSheet, setOpenSheet] = useState(false);
  const [error, setError] = useState(null);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentFlowers, setSentFlowers] = useState([]);
  const [receivedFlowers, setReceivedFlowers] = useState([]);
  // const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [selectedFlower, setSelectedFlower] = useState(null);

  // --------------------------
  // FETCH FLOWERS
  // --------------------------
  const getFlowers = async () => {
    setLoading(true);
    try {
      const response = await getFlowersForUser(userId);

      if (!response.ok) {
        throw new Error(`Error fetching flowers: ${response.statusText}`);
      }

      const res = await response.json();

      setSentFlowers(res.data.sent || []);
      setReceivedFlowers(res.data.received || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // DELETE FLOWER
  // --------------------------
  const handleDeleteFlower = async (flowerId, reject = false) => {
    setButtonLoading(true);
    try {
      const response = await apiDeleteFlower(flowerId, userId, reject);

      if (!response.ok) {
        throw new Error(`Error deleting flower: ${response.statusText}`);
      }

      const res = await response.json();

      if (res.success) {
        // Refresh list after delete
        await getFlowers();
        setOpenSheet(false);
      }
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      setButtonLoading(false);
    }
  };

  // --------------------------
  // onDelete passed to sheet
  // --------------------------
  const onDelete = (flowerId, reject = false) => {
    console.log("Deteilskfnlkxnvkdn");
    handleDeleteFlower(flowerId, reject);
  };

  // --------------------------
  // NAVBAR SETUP + FETCH DATA
  // --------------------------
  useEffect(() => {
    updateNavbar({
      title: "Flowers",
      subtitle: "Online",
      avatar: false,
    });

    getFlowers();

    return () => resetNavbar();
  }, [userId]);

  const handleClickFlower = (flower, type) => {
    console.log("Flower is here : ", flower);
    flower["type"] = type;
    setSelectedFlower(flower);
    setOpenSheet(true);
  };

  return (
    <>
      <Tabs.Root
        defaultValue="received"
        style={{ width: "100%" }}
        variant="line"
      >
        <Tabs.List className={styles.tabList}>
          <Tabs.Trigger value="received">Received</Tabs.Trigger>
          <Tabs.Trigger value="sent">Sent</Tabs.Trigger>
        </Tabs.List>

        {/* -------------------------------- */}
        {/* RECEIVED FLOWERS */}
        {/* -------------------------------- */}
        <Tabs.Content value="received">
          <div className={styles.cardList}>
            {loading ? (
              // LOADING STATE
              <p className={styles.loadingText}>Loading...</p>
            ) : receivedFlowers.length === 0 ? (
              // EMPTY STATE
              <EmptyState.Root>
                <EmptyState.Content>
                  <VStack textAlign="center">
                    <EmptyState.Title>No flowers received</EmptyState.Title>
                    <EmptyState.Description>
                      When someone sends you a flower 🌸, it will appear here.
                    </EmptyState.Description>
                  </VStack>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : (
              // LIST
              receivedFlowers.map((card) => (
                <div
                  key={card.id}
                  className={styles.card}
                  onClick={() => handleClickFlower(card, "received")}
                >
                  <div>
                    <div className={styles.avatar}></div>
                    <div className={styles.info}>
                      <div className={styles.headerRow}>
                        <h4 className={styles.name}>{card.sender_id}</h4>
                        <span className={styles.time}>24hrs</span>
                      </div>
                      <p className={styles.content}>{card.note}</p>
                    </div>
                  </div>
                  {card.status === "accepted" && (
                    <div className={styles.acceptedMarker}>
                      <CircleCheck color="#09cc7f" />
                      <p>Accepted</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Tabs.Content>

        {/* -------------------------------- */}
        {/* SENT FLOWERS */}
        {/* -------------------------------- */}
        <Tabs.Content value="sent">
          <div className={styles.cardList}>
            {loading ? (
              // LOADING
              <p className={styles.loadingText}>Loading...</p>
            ) : sentFlowers.length === 0 ? (
              // EMPTY STATE
              <EmptyState.Root>
                <EmptyState.Content>
                  <VStack textAlign="center">
                    <EmptyState.Title>No flowers sent</EmptyState.Title>
                    <EmptyState.Description>
                      Send someone a flower 🌸 to brighten their day.
                    </EmptyState.Description>
                  </VStack>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : (
              // LIST
              sentFlowers.map((card) => (
                <div
                  key={card.id}
                  className={styles.card}
                  onClick={() => handleClickFlower(card, "sent")}
                >
                  <div className={styles.cardDetails}>
                    <div className={styles.avatar}></div>
                    <div className={styles.info}>
                      <h4 className={styles.name}>{card.receiver_id}</h4>
                      <p className={styles.content}>{card.note}</p>
                    </div>
                  </div>
                  {card.status === "accepted" && (
                    <div className={styles.acceptedMarker}>
                      <CircleCheck color="#09cc7f" />
                      <p>Accepted</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <ViewFlowersBottomSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        onDelete={() => onDelete(selectedFlower.id, true)} // Pass delete handler
        // loading={isButtonLoading}
        data={selectedFlower}
      />
    </>
  );
};

export default FlowerPage;
