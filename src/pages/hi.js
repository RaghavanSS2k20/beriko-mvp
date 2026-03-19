import styles from "../styles/hi.module.css";
import { Dialog } from "@chakra-ui/react";
import { useState } from "react";

function HiPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinWaitlist = async () => {
    if (isJoined) return;

    setLoading(true);

    try {
      const res = await fetch("/api/joinwaitlist", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setIsJoined(true);
        setIsOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={styles.container}>
        {/* Section 1: Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Online Datine Made Personal With Beriko
            </h1>
            <p className={styles.heroSubtitle}>
              Stop swiping. Start connecting.
            </p>

            <button
              className={styles.heroButton}
              onClick={handleJoinWaitlist}
              disabled={isJoined || loading}
            >
              {isJoined
                ? "Joined ✅"
                : loading
                  ? "Joining..."
                  : "Join the Waitlist"}
            </button>
          </div>
        </section>

        {/* Section 2: Features */}
        <section className={styles.features}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              Dating Apps Are Noisy. You Deserve Peace.
            </h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>Build Your Profile by Chatting</h3>
                <p>
                  No boring forms. Just talk to our AI about who you are and
                  what you're looking for. It understands you.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>3-5 Curated Matches, Not 3,000</h3>
                <p>
                  No endless swiping. We show you only highly compatible people
                  who want the same thing you do.
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Serious Intentions Only</h3>
                <p>
                  Everyone here wants a real relationship. No hookups, no games,
                  no wasted time on people who aren't ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className={styles.howItWorks}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>How Beriko Works</h2>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>
                <div className={styles.stepNumberWrapper}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepLine}></div>
                </div>
                <div className={styles.stepContent}>
                  <h3>Chat with AI</h3>
                  <p>
                    Have a real conversation. Tell us what you want, how you
                    think, what matters to you. No forms to fill.
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumberWrapper}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepLine}></div>
                </div>
                <div className={styles.stepContent}>
                  <h3>We Build Your Profile</h3>
                  <p>
                    Our AI understands your intentions, values, and
                    compatibility factors—not just your photos.
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumberWrapper}>
                  <div className={styles.stepNumber}>3</div>
                </div>
                <div className={styles.stepContent}>
                  <h3>Get 3-5 Matches</h3>
                  <p>
                    Receive a small number of highly aligned people. Choose from
                    quality, not quantity. No swiping required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready for Something Real?</h2>
            <p className={styles.ctaSubtitle}>
              No more swipe fatigue. No more unclear intentions. Just people who
              want what you want.
            </p>
            <button
              className={styles.ctaButton}
              onClick={handleJoinWaitlist}
              disabled={isJoined || loading}
            >
              {isJoined
                ? "Joined ✅"
                : loading
                  ? "Joining..."
                  : "Join the Waitlist"}
            </button>
          </div>
        </section>
      </div>

      <Dialog.Root
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
        placement={"center"}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="16px">
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Thanks For Showing Intrest! 🎉</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Thanks for joining Beriko's waitlist. While everyone else keeps
              swiping endlessly, you 're waiting for something
              <span className={styles.emphasis}> actually worth it</span>.
            </Dialog.Body>
            <Dialog.Footer>
              <button colorPalette="blue" onClick={() => setIsOpen(false)}>
                Got it
              </button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}
HiPage.noMobileContainer = true;

export default HiPage;
