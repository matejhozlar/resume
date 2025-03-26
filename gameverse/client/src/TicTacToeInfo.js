import React from "react";
import preview1 from "./assets/images/tictactoe-preview1.png";
import preview2 from "./assets/images/tictactoe-preview2.png";

function TicTacToeInfo() {
  return (
    <div className="game-info-wrapper">
      <h1 className="game-title">Tic Tac Toe</h1>

      <div className="game-description-box">
        <h3>Description:</h3>
        <p>
          Tic-Tac-Toe is a two-player game played on a grid. The goal is to get
          3 of your marks in a row—horizontally, vertically, or diagonally—
          before your opponent.
        </p>
      </div>

      <div className="game-preview-box">
        <p className="preview-label">photo previews</p>
        <div className="preview-images">
          <img src={preview1} alt="Preview 1" />
          <img src={preview2} alt="Preview 2" />
        </div>
      </div>

      <div className="game-buttons">
        <button className="play-btn">Play</button>
        <button className="game-btn">GitHub</button>
      </div>
    </div>
  );
}

export default TicTacToeInfo;
