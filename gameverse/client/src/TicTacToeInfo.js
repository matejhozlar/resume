import React, { useState } from "react";
import preview1 from "./assets/images/tictactoe-preview1.png";
import preview2 from "./assets/images/tictactoe-preview2.png";

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
        <h1 className="game-title titles">Tic Tac Toe</h1>

        <div className="game-content">
          <div className="description-section">
            <p>
              Tic-Tac-Toe is a two-player game played on a grid. The goal is to
              get 3 of your marks in a row—horizontally, vertically, or
              diagonally—before your opponent.
            </p>
            <h4 className="titles">Rules</h4>
            <p>
              Players take turns placing their mark (X or O) on an empty cell.
              The first player to get 3 of their marks in a row wins the game.
            </p>
            <h4 className="titles">AI Difficulties</h4>
            <p>
              The game offers 3 AI difficulties: Easy, Medium, and Hard.
              <ul>
                <li>Easy: AI makes random moves.</li>
                <li>Medium: AI blocks the player from winning.</li>
                <li>Hard: AI plays to win.</li>
              </ul>
            </p>
            <div className="tags">
              <span className="tag">👫 1-2 Players</span>
              <span className="tag">👥 Local Multiplayer</span>
              <span className="tag">🤖 AI Difficulty</span>
              <span className="tag">⚙️ Custom Rules</span>
              <span className="tag">🎵 Music</span>
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
              window.location.href = "http://matejhoz.com/games/tic-tac-toe/";
            }}
          >
            Play
          </button>
          <button
            className="game-btn"
            onClick={() =>
              window.open(
                "https://github.com/matejhozlar/resume/tree/main/games/tic-tac-toe",
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
