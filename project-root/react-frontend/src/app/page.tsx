"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameInsight, setGameInsight] = useState("");
  const [typing, setTyping] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    const video = document.getElementById("mainVideo") as HTMLVideoElement;
    if (video) {
      video.play();
    }
  };

  const generateGameInsight = () => {
    setGameInsight(""); // Reset previous text
    setTyping(true); // Start typing effect

    const insights = [
      "In the 67th minute, Player 10 executes a perfectly weighted through ball between two defenders, allowing the striker to break free towards goal. The goalkeeper rushes forward, but the striker calmly chips the ball over him, scoring a crucial goal to take the lead.",
      "As the opposing team builds an attack down the right flank, the left-back anticipates the play and makes a decisive interception just outside the penalty box. Immediately, he initiates a counterattack with a swift pass to the central midfielder, who quickly turns and launches a long ball towards the advancing winger.",
      "Following a missed shot, the opposition defense scrambles to clear the ball, but the central midfielder reacts first, controlling it with a delicate first touch before delivering an accurate cross into the box. The striker meets the ball with a powerful header, forcing the goalkeeper into a diving save.",
      "With just five minutes remaining, the right-winger receives the ball near the touchline, closely marked by a defender. He feints inside, then bursts down the outside, using his pace to get behind the backline before cutting the ball back to the edge of the box, where the attacking midfielder arrives late and fires a one-time shot into the bottom corner.",
      "During a high-pressing sequence, the defensive midfielder times his tackle perfectly, dispossessing the opponent near the halfway line. Recognizing the space ahead, he drives forward before threading a precise pass between two defenders, setting up an attacking opportunity just outside the 18-yard box.",
    ];

    const selectedInsight = insights[Math.floor(Math.random() * insights.length)];

    let i = 0;
    setGameInsight(""); // Ensure it's reset before typing starts

    const typingInterval = setInterval(() => {
      if (i < selectedInsight.length) {
        setGameInsight((prev) => prev + selectedInsight[i]); // Append characters properly
        i++;
      } else {
        clearInterval(typingInterval);
        setTyping(false);
      }
    }, 40); // Adjust speed for smoother typing effect
  };

  return (
    <div className={styles.page}>
      {/* Fixed Top Header */}
      <header className={styles.header}>
        <h1>Sportif-AI</h1>
      </header>

      <main className={styles.main}>
        {/* Sidebar Toggle Button (Always Visible & Clickable) */}
        <button
          className={`${styles.toggleButton} ${
            showSidebar ? styles.toggleOpen : styles.toggleClosed
          }`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "⏴" : "⏵"}
        </button>

        {/* Sidebar - Explore More (Collapsible) */}
        <aside
          className={`${styles.sidebar} ${
            showSidebar ? styles.open : styles.closed
          }`}
        >
          <h2>Explore More</h2>
          {showSidebar && (
            <div className={styles.sidebarContent}>
              <ul className={styles.videoList}>
                <li>
                  <video className={styles.sideVideo} controls>
                    <source src="/video1.mp4" type="video/mp4" />
                  </video>
                  <p>Video 1: Description</p>
                </li>
                <li>
                  <video className={styles.sideVideo} controls>
                    <source src="/video2.mp4" type="video/mp4" />
                  </video>
                  <p>Video 2: Description</p>
                </li>
                <li>
                  <video className={styles.sideVideo} controls>
                    <source src="/video3.mp4" type="video/mp4" />
                  </video>
                  <p>Video 3: Description</p>
                </li>
              </ul>
            </div>
          )}
        </aside>

        {/* Center Video Section with Title & Date */}
        <section className={styles.videoContainer}>
          <h2 className={styles.videoTitle}>
            Match Highlights: Team A vs. Team B
          </h2>
          <div className={styles.videoWrapper}>
            <video
              id="mainVideo"
              className={styles.video}
              controls={!isPlaying}
            >
              <source src="/Wrapped.mp4" type="video/mp4" />
            </video>
            {!isPlaying && (
              <div className={styles.playButton} onClick={handlePlay}>
                <div className={styles.circle}>
                  <div className={styles.triangle}></div>
                </div>
              </div>
            )}
          </div>
          <p className={styles.videoDate}>February 22, 2025</p>
        </section>

        {/* Right Column - What's Happening? Button & Generated Text */}
        <aside className={styles.chatBox}>
          <button className={styles.insightButton} onClick={generateGameInsight}>
            What's Happening?
          </button>
          <p className={styles.gameInsight}>
            {gameInsight} {typing && <span className={styles.typingCursor}>|</span>}
          </p>
        </aside>
      </main>
    </div>
  );
}
