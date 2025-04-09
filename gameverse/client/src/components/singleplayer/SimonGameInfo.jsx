import React, { useState } from "react";
import preview1 from "../../assets/images/simongame-preview1.png";
import preview2 from "../../assets/images/simongame-preview2.png";

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
          This game is not tracked in the leaderboards
        </p>
        <h1 className="game-title titles">Simon Game</h1>

        <div className="game-content">
          <div className="description-section">
            <p>
              Simon Game is a memory game where players must repeat a sequence
              of colors and sounds. The game starts with a single color and
              sound, and the sequence grows longer as the game progresses.
            </p>
            <h4 className="titles">Rules</h4>
            <p>
              Players must repeat the sequence of colors and sounds by clicking
              the corresponding buttons. The game ends when a player makes a
              mistake.
            </p>
            <div className="tags">
              <span className="tag">🕹️ 1 player</span>
              <span className="tag">🧠 Memory</span>
              <span className="tag">🎵 Sound</span>
              <span className="tag">🎮 Classic</span>
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
              window.location.href = "http://matejhoz.com/games/simongame/";
            }}
          >
            Play
          </button>
          <button
            className="game-btn"
            onClick={() =>
              window.open(
                "https://github.com/matejhozlar/resume/tree/main/games/simongame",
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
