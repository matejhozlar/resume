import React from "react";
import preview1 from "./assets/images/tictactoe-preview1.png";
import preview2 from "./assets/images/tictactoe-preview2.png";

function TicTacToeInfo() {
  return (
    <div className="game-info-wrapper">
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
            Players take turns placing their mark (X or O) on an empty cell. The
            first player to get 3 of their marks in a row wins the game.
          </p>
          <h4 className="titles">AI Difficulties</h4>
          <p>
            The game offers 3 AI difficulties: Easy, Medium, and Hard.
            <br></br>
            Easy: AI makes random moves.
            <br></br>
            Medium: AI blocks the player from winning.
            <br></br>
            Hard: AI plays to win.
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
              <img src={preview1} alt="Gameplay Preview 1" />
            </div>
            <div className="preview-card">
              <img src={preview2} alt="Gameplay Preview 2" />
            </div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="play-btn">Play</button>
        <button
          className="game-btn"
          onClick={() =>
            window.open("https://github.com/your-username/tictactoe", "_blank")
          }
        >
          GitHub
        </button>
      </div>
    </div>
  );
}

export default TicTacToeInfo;
