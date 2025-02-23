"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useEvents } from "./_hooks/useEvents";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // For typed text effect
  const [gameInsight, setGameInsight] = useState("");
  const [typing, setTyping] = useState(false);

  // Track how much of the video is watched (in seconds)
  const [timeWatched, setTimeWatched] = useState(0);

  // Track commentary: 0 => none, 1 => first, 2 => second
  const [insightIndex, setInsightIndex] = useState(0);

  // Show/hide the info popup
  const [showInfo, setShowInfo] = useState(false);

  const { events, loading, reFetchEvents } = useEvents(timeWatched);

  // Handle main video play
  const handlePlay = () => {
    setIsPlaying(true);
    const video = document.getElementById("mainVideo") as HTMLVideoElement;
    if (video) video.play();
  };

  // Called whenever the video updates its time
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setTimeWatched(e.currentTarget.currentTime);
  };

  // Type out commentary text
  const typeText = (text: string) => {
    setGameInsight("");
    setTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setGameInsight((prev) => prev + (text[i] || ""));
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 20);
  };

  console.log(events);

  useEffect(() => {
    if (events && events.analysis && timeWatched > 0) {
      typeText(events.analysis);
      setInsightIndex(Math.floor(timeWatched / 15));
    }
  }, [events]);

  // Disable button until 15s for first, 30s for second
  const isDisabled =
    (insightIndex === 0 && timeWatched < 15) ||
    (insightIndex === 1 && timeWatched < 30) ||
    insightIndex === 2;

  return (
    <div className={styles.page}>
      {/* Fixed Top Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Sportif-AI</h1>
      </header>

      <main className={styles.main}>
        {/* Sidebar Toggle Button */}
        <button
          className={`${styles.toggleButton} ${
            showSidebar ? styles.toggleOpen : styles.toggleClosed
          }`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "⏴" : "⏵"}
        </button>

        {/* Sidebar - Explore More */}
        <aside
          className={`${styles.sidebar} ${
            showSidebar ? styles.open : styles.closed
          }`}
        >
          <button
            className={styles.insightButton}
            onClick={() => alert("Explore More clicked!")}
          >
            Explore More
          </button>

          {showSidebar && (
            <div className={styles.sidebarContent}>
              <ul className={styles.videoList}>
                <li>
                  <div className={styles.sideVideoContainer}>
                    <img
                      src="/curling.png"
                      alt="Video 1"
                      className={styles.sideVideo}
                    />
                    <div className={styles.playOverlay}>▶</div>
                    <span className={styles.sportTag}>Curling</span>
                  </div>
                  <p>
                    <span className={styles.videoName}>
                      Winter Olympics 2018: Norway vs Canada
                    </span>
                  </p>
                </li>
                <li>
                  <div className={styles.sideVideoContainer}>
                    <img
                      src="/crciket.png"
                      alt="Video 2"
                      className={styles.sideVideo}
                    />
                    <div className={styles.playOverlay}>▶</div>
                    <span className={styles.sportTag}>Cricket</span>
                  </div>
                  <p>
                    <span className={styles.videoName}>
                      England vs Australia | Champions Trophy 2025
                    </span>
                  </p>
                </li>
                <li>
                  <div className={styles.sideVideoContainer}>
                    <img
                      src="/football.png"
                      alt="Video 3"
                      className={styles.sideVideo}
                    />
                    <div className={styles.playOverlay}>▶</div>
                    <span className={styles.sportTag}>Football</span>
                  </div>
                  <p>
                    <span className={styles.videoName}>
                      Kansas City Chiefs vs Philadelphia Eagles
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          )}
        </aside>

        {/* Center Video Section */}
        <section className={styles.videoContainer}>
          <h2 className={styles.videoTitle}>
            Match Highlights: TSG Hoffenheim vs. VfB Stuttgart
          </h2>
          <div className={styles.videoWrapper}>
            <div className={`${styles.liveBadge} ${styles.liveBadgeOnVideo}`}>
              <div className={styles.liveLeft}>
                <div className={styles.blinkingCircle}></div>
              </div>
              <div className={styles.liveRight}>LIVE</div>
            </div>

            <video
              id="mainVideo"
              className={styles.video}
              controls={!isPlaying}
              onTimeUpdate={handleTimeUpdate}
            >
              <source src="/vid.mp4" type="video/mp4" />
            </video>

            {!isPlaying && (
              <div className={styles.playButton} onClick={handlePlay}>
                <div className={styles.circle}>
                  <div className={styles.triangle}></div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.videoDescription}>
            <p>
              February 22, 2025 | 2:30 PM | Rhein-Neckar-Arena
              <br />
              <strong>Game Description:</strong> Watch Hoffenheim battling
              Stuttgart in this thrilling live play. Learn about key plays,
              incredible saves, and impressive team coordination in what will be
              one of the most memorable clashes of the season!
            </p>
          </div>
        </section>

        {/* Right Chat Box - "What's Happening?" */}
        <aside className={styles.chatBox}>
          <button
            className={styles.insightButton}
            onClick={() => reFetchEvents()}
            disabled={isDisabled}
          >
            {!loading ? "What's Happening?" : "Loading..."}
          </button>
          <p className={styles.gameInsight}>
            {gameInsight}
            {typing && <span className={styles.typingCursor}>|</span>}
          </p>
        </aside>
      </main>

      {/* Info Icon - fixed at bottom-right of the viewport, not inside any panel */}
      <div className={styles.infoIcon} onClick={() => setShowInfo(true)}>
        i
      </div>

      {/* Info Popup Overlay */}
      {showInfo && (
        <div
          className={styles.infoPopupOverlay}
          onClick={() => setShowInfo(false)}
        >
          <div
            className={styles.infoPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>About Sportif-AI</h2>
            <p>
              Sportif-AI is dedicated to harnessing data-driven insights and AI
              technology to enhance sports analysis, storytelling, and fan
              engagement. Our mission is to bring a new level of insight and
              excitement to sports enthusiasts worldwide.
            </p>
            <button
              className={styles.closePopupButton}
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
