import React, { useRef, useEffect, useState } from "react";
import mapImage from "../assets/maps/zombie-city.png";
import playerSprite from "../assets/sprites/survivor.png";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;
const PLAYER_SPEED = 2;
const SPRITE_SIZE = 16;
const SCALE = 3;

const obstacles = [
  { x: 195, y: 156, width: 273, height: 273 },
  { x: 762, y: 176, width: 273, height: 273 },
  { x: 1328, y: 195, width: 312, height: 312 },
  { x: 195, y: 781, width: 312, height: 312 },
  { x: 1406, y: 781, width: 273, height: 312 },
  { x: 195, y: 1406, width: 312, height: 273 },
  { x: 781, y: 1406, width: 312, height: 273 },
  { x: 1348, y: 1367, width: 312, height: 312 },
  { x: 566, y: 1602, width: 117, height: 59 },
  { x: 1641, y: 625, width: 78, height: 117 },
];

function isColliding(x, y) {
  return obstacles.some((obs) => {
    return (
      x < obs.x + obs.width &&
      x + SPRITE_SIZE > obs.x &&
      y < obs.y + obs.height &&
      y + SPRITE_SIZE > obs.y
    );
  });
}

function PixelArena() {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [player, setPlayer] = useState({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    angle: 0, // Radians
  });

  const bgImageRef = useRef(new Image());
  const spriteImageRef = useRef(new Image());

  useEffect(() => {
    bgImageRef.current.src = mapImage;
    spriteImageRef.current.src = playerSprite;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e) =>
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const draw = () => {
      let { x, y } = player;
      let dx = 0,
        dy = 0;

      if (keys["w"] || keys["arrowup"]) dy -= 1;
      if (keys["s"] || keys["arrowdown"]) dy += 1;
      if (keys["a"] || keys["arrowleft"]) dx -= 1;
      if (keys["d"] || keys["arrowright"]) dx += 1;

      // Normalize diagonal movement
      if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy);
        dx = (dx / length) * PLAYER_SPEED;
        dy = (dy / length) * PLAYER_SPEED;

        const newX = Math.max(0, Math.min(WORLD_WIDTH - SPRITE_SIZE, x + dx));
        const newY = Math.max(0, Math.min(WORLD_HEIGHT - SPRITE_SIZE, y + dy));

        if (!isColliding(newX, newY)) {
          x = newX;
          y = newY;
        }

        // Update facing angle
        const angle = Math.atan2(dy, dx);
        setPlayer((prev) => ({ ...prev, x, y, angle }));
      } else {
        setPlayer((prev) => ({ ...prev, x, y }));
      }

      const cameraX = x - CANVAS_WIDTH / 2;
      const cameraY = y - CANVAS_HEIGHT / 2;

      // Clear
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      if (bgImageRef.current.complete && bgImageRef.current.naturalWidth > 0) {
        ctx.drawImage(
          bgImageRef.current,
          -cameraX,
          -cameraY,
          WORLD_WIDTH,
          WORLD_HEIGHT
        );
      }

      // Draw obstacles (optional)
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      obstacles.forEach((obs) => {
        ctx.fillRect(obs.x - cameraX, obs.y - cameraY, obs.width, obs.height);
      });

      // Draw player (rotated)
      const sprite = spriteImageRef.current;
      const drawX = CANVAS_WIDTH / 2;
      const drawY = CANVAS_HEIGHT / 2;

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(player.angle);
      ctx.drawImage(
        sprite,
        -((SPRITE_SIZE * SCALE) / 2),
        -((SPRITE_SIZE * SCALE) / 2),
        SPRITE_SIZE * SCALE,
        SPRITE_SIZE * SCALE
      );
      ctx.restore();

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, [keys, player]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="titles">Pixel Arena</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: "2px solid #8a5cf6",
          backgroundColor: "#000",
          imageRendering: "pixelated",
        }}
      ></canvas>
    </div>
  );
}

export default PixelArena;
