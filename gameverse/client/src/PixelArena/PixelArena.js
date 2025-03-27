import React, { useRef, useEffect, useState } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 20;
const PLAYER_SPEED = 4;

function PixelArena() {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [player, setPlayer] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  });

  // Movement logic
  useEffect(() => {
    const handleKeyDown = (e) =>
      setKeys((prev) => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e) => setKeys((prev) => ({ ...prev, [e.key]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    function gameLoop() {
      // Clear screen
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update player position
      setPlayer((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        if (keys["w"] || keys["ArrowUp"]) newY -= PLAYER_SPEED;
        if (keys["s"] || keys["ArrowDown"]) newY += PLAYER_SPEED;
        if (keys["a"] || keys["ArrowLeft"]) newX -= PLAYER_SPEED;
        if (keys["d"] || keys["ArrowRight"]) newX += PLAYER_SPEED;

        // Constrain to bounds
        newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));
        newY = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));

        return { x: newX, y: newY };
      });

      // Draw player
      ctx.fillStyle = "white";
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }, [keys, player]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="titles">Pixel Arena</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "2px solid #8a5cf6", backgroundColor: "#000" }}
      ></canvas>
    </div>
  );
}

export default PixelArena;
