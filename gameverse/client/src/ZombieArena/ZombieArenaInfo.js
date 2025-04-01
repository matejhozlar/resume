import React, { useState } from "react";
import preview1 from "../assets/images/tictactoe-preview1.png";
import preview2 from "../assets/images/tictactoe-preview2.png";

function ZombieArenaInfo({ onPageChange }) {
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
        <h1 className="game-title titles">Zombie Arena</h1>

        <div className="game-content">
          <div className="description-section">
            <p>
              Zombie Arena is a top-down survival shooter where you battle
              endless waves of the undead. You begin in a sprawling,
              post-apocalyptic city armed with a rifle and limited ammo. Each
              wave introduces more zombies, forcing you to scavenge for
              supplies—ammo packs, medkits, and armor—to stay alive. The
              challenge ramps up quickly, testing both your aim and resource
              management skills.
            </p>
            <h4 className="titles">Controls</h4>
            <ul>
              <li>Movement: Use WASD to move.</li>
              <li>Ammo: Reaload your weapon by pressing 'R'.</li>
              <li>
                MedKits: Apply medkits to heal 10 points of your health by
                pressing 'E'
              </li>
              <li>
                Aiming & Shooting: Aim with your mouse and click or press
                'Space'/'Mouse1' to shoot.
              </li>
            </ul>
            <h4 className="titles">Features</h4>
            <ul>
              <li>
                Scavenging: Pick up ammo packs, medkits, and armor to increase
                your chances of survival.
              </li>
              <li>
                Health & Armor: Keep an eye on your health bar and ammo
                bar--when health hits zero, it's game over!
              </li>
              <li>
                Waves: Each wave spawns more zombies with increasing aggression.
                Survive as many waves as possible to achieve a high score and be
                the top player in the leaderboards!
              </li>
            </ul>
            <p>
              The game ends when your health reaches zero--how many waves can
              you outlast? Good luck, survivor!
            </p>
            <div className="tags">
              <span className="tag">🕹️ 1 player</span>
              <span className="tag">🧟‍♂️ Zombie Apocalypse</span>
              <span className="tag">🔫 Survival Shooter</span>
              <span className="tag">🎮 Top-Down Action</span>
              <span className="tag">🚧 Wave Defense</span>
              <span className="tag">👻 Horror Game</span>
              <span className="tag">⚔️ Intense</span>
              <span className="tag">🗑️ Resource Scavanger</span>
              <span className="tag">🔄 Reload And Survive</span>
              <span className="tag">🌊 Endless Waves</span>
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
              onPageChange("zombiearena-play");
            }}
          >
            Play
          </button>
          <button
            className="game-btn"
            onClick={() =>
              window.open(
                "https://github.com/matejhozlar/resume/tree/gameverse-REACT/gameverse/client/src/ZombieArena",
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

export default ZombieArenaInfo;
