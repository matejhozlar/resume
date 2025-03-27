import React, { useRef, useEffect, useState } from "react";

const GalacticBlitz = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const ship = useRef({ x: 180, y: 450, width: 40, height: 40, speed: 5 });
  const animationFrameId = useRef(null);
  const spawnIntervalId = useRef(null);

  // Spawn an enemy at a random x position at the top of the canvas
  const spawnEnemy = () => {
    const enemy = {
      x: Math.random() * (400 - 40), // canvas width (400) minus enemy width
      y: -40,
      width: 40,
      height: 40,
      speed: 2 + Math.random() * 2,
    };
    setEnemies((prev) => [...prev, enemy]);
  };

  // Start (or restart) the game
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
    setEnemies([]);
    setBullets([]);
    ship.current = { x: 180, y: 450, width: 40, height: 40, speed: 5 };

    // Spawn a new enemy every 1.5 seconds
    spawnIntervalId.current = setInterval(spawnEnemy, 1500);
    // Start the game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);
  };

  // Stop the game
  const stopGame = () => {
    setGameOver(true);
    setGameRunning(false);
    clearInterval(spawnIntervalId.current);
    cancelAnimationFrame(animationFrameId.current);
  };

  // Basic rectangle collision detection
  const isColliding = (a, b) => {
    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  };

  // Main game loop: update game state and draw the frame
  const gameLoop = () => {
    updateGame();
    drawGame();
    if (!gameOver) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };

  // Update positions, check collisions, and update the score
  const updateGame = () => {
    // Update enemy positions and remove those that exit the canvas.
    setEnemies((prevEnemies) =>
      prevEnemies
        .map((enemy) => ({ ...enemy, y: enemy.y + enemy.speed }))
        .filter((enemy) => {
          // Award points if enemy leaves the canvas.
          if (enemy.y > 500) {
            setScore((prev) => prev + 1);
            return false;
          }
          // End game if enemy collides with the ship.
          if (isColliding(enemy, ship.current)) {
            stopGame();
            return false;
          }
          return true;
        })
    );

    // Update bullet positions and remove off-screen bullets.
    setBullets((prevBullets) =>
      prevBullets
        .map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed }))
        .filter((bullet) => bullet.y + bullet.height > 0)
    );

    // Check collisions between bullets and enemies.
    setEnemies((prevEnemies) => {
      let updatedEnemies = [...prevEnemies];
      setBullets((prevBullets) => {
        let updatedBullets = [];
        prevBullets.forEach((bullet) => {
          let hit = false;
          updatedEnemies = updatedEnemies.filter((enemy) => {
            if (isColliding(bullet, enemy)) {
              hit = true;
              setScore((prev) => prev + 5); // Increase score for a hit.
              return false;
            }
            return true;
          });
          if (!hit) {
            updatedBullets.push(bullet);
          }
        });
        return updatedBullets;
      });
      return updatedEnemies;
    });
  };

  // Draw the current frame on the canvas
  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player's ship
    ctx.fillStyle = "white";
    ctx.fillRect(
      ship.current.x,
      ship.current.y,
      ship.current.width,
      ship.current.height
    );

    // Draw enemies
    enemies.forEach((enemy) => {
      ctx.fillStyle = "red";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw bullets
    bullets.forEach((bullet) => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
  };

  // Handle key presses for ship movement and shooting.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameRunning) return;
      if (e.key === "ArrowLeft") {
        ship.current.x = Math.max(0, ship.current.x - ship.current.speed);
      } else if (e.key === "ArrowRight") {
        ship.current.x = Math.min(
          400 - ship.current.width,
          ship.current.x + ship.current.speed
        );
      } else if (e.key === " ") {
        // Shoot a bullet
        const bullet = {
          x: ship.current.x + ship.current.width / 2 - 2.5,
          y: ship.current.y,
          width: 5,
          height: 10,
          speed: 7,
        };
        setBullets((prev) => [...prev, bullet]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameRunning]);

  // Set up the canvas dimensions on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 500;
  }, []);

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      {!gameRunning && !gameOver && (
        <button onClick={startGame}>Start Game</button>
      )}
      {gameOver && (
        <div>
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <button onClick={startGame}>Restart Game</button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid white", marginTop: "20px" }}
      />
      {/* Leaderboard section: implement API integration as needed */}
      <div style={{ marginTop: "20px" }}>
        <h3>Leaderboard</h3>
        <p>(Leaderboard integration coming soon!)</p>
      </div>
    </div>
  );
};

export default GalacticBlitz;
