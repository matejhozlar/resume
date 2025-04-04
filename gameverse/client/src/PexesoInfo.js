import React, { useState } from "react";
import preview1 from "./assets/images/pexeso-preview1.png";
import preview2 from "./assets/images/pexeso-preview2.png";

function TicTacToeInfo() {
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleImageClick = (src) => {
    setZoomedImage(src);
    document.body.style.overflow = "hidden";
  };

  const closeZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="game-info-wrapper">
        <p className="alert alert-danger">
          {" "}
          This game is not tracked in the leaderboards
        </p>
        <h1 className="game-title titles">Pexeso</h1>

        <div className="game-content">
          <div className="description-section">
            <p>
              Pexeso is a memory card game where players must find matching
              pairs of cards. The game starts with all cards face down, and
              players must remember the position of each card to find the
              matching pairs. Avaiable board-sizes: 2x2, 4x4, 6x6, 8x8.
            </p>
            <h4 className="titles">Rules</h4>
            <p>
              Singleplayer version of the game offers 4 difficulty levels: Easy,
              Medium, Hard and Insane. The player must find all matching pairs
              to win the game.
            </p>
            <h4 className="titles">Difficulties</h4>
            <p>
              The game offers 4 difficulty levels:
              <ul>
                <li>Easy: Relaxing, with no timer.</li>
                <li>Medium: Balanced timer.</li>
                <li>Hard: 20-second interval shuffles.</li>
                <li>
                  Insane: 10-second interval shuffles with a timer + instant
                  card flip-back
                </li>
              </ul>
            </p>
            <div className="tags">
              <span className="tag">🕹️ 1 player</span>
              <span className="tag">🧠 Memory</span>
              <span className="tag">🎵 Music</span>
              <span className="tag">🃏 Cards</span>
              <span className="tag">🧩 Puzzle</span>
              <span className="tag">⏱️ Timed</span>
              <span className="tag">👨‍🎓 Brain Training</span>
              <span className="tag">🎯 Focus</span>
              <span className="tag">👾 Retro</span>
            </div>
          </div>

          <div className="preview-section">
            <h3>Preview:</h3>
            <div className="preview-images">
              <div className="preview-card">
                <img
                  src={preview1}
                  alt="Gameplay Preview 1"
                  onClick={() => handleImageClick(preview1)}
                />
              </div>
              <div className="preview-card">
                <img
                  src={preview2}
                  alt="Gameplay Preview 2"
                  onClick={() => handleImageClick(preview2)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            className="play-btn"
            onClick={() => {
              window.location.href = "http://127.0.0.1:3001/games/pexeso/";
            }}
          >
            Play
          </button>
          <button
            className="game-btn"
            onClick={() =>
              window.open(
                "https://github.com/matejhozlar/resume/tree/main/games/pexeso",
                "_blank"
              )
            }
          >
            GitHub
          </button>
        </div>
      </div>

      {zoomedImage && (
        <div className="zoom-overlay" onClick={closeZoom}>
          <img className="zoomed-image" src={zoomedImage} alt="Zoomed" />
        </div>
      )}
    </>
  );
}

export default TicTacToeInfo;
