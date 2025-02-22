"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    const video = document.getElementById("mainVideo") as HTMLVideoElement;
    if (video) {
      video.play();
    }
  };

  return (
    <div className={styles.page}>
      {/* Fixed Top Header */}
      <header className={styles.header}>
        <h1>Football Analyzer</h1>
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

        {/* Sidebar - Related Videos (Collapsible) */}
        <aside
          className={`${styles.sidebar} ${
            showSidebar ? styles.open : styles.closed
          }`}
        >
          <h2>Related Videos</h2>
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

        {/* Right Column - Ask a Question (Styled Like ChatGPT) */}
        <aside className={styles.chatBox}>
          <h2>Ask a Question</h2>
          <div className={styles.chatInputContainer}>
            <textarea
              placeholder="Type your message..."
              className={styles.chatInput}
            ></textarea>
            <button className={styles.sendButton}>Send</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
