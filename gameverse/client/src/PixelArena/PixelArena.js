import React, { useRef, useEffect } from "react";
import mapImage from "../assets/maps/zombie-city.png";
import playerSprite from "../assets/sprites/survivor.png";
import mapImageObstacles from "../assets/maps/zombie-city-obstacles.png";
import bullet from "../assets/images/bullet/bullet.png";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;
const PLAYER_SPEED = 1;
const SPRITE_SIZE = 16;
const SCALE = 3;
const BULLET_SPEED = 6;
const FORWARD_OFFSET = 16;
const SIDE_OFFSET = 12;
const SHOOT_COOLDOWN = 200;

const lerpAngle = (a, b, t) => {
  const diff = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  return a + diff * t;
};

function PixelArena() {
  const canvasRef = useRef(null);
  const bgImageRef = useRef(new Image());
  const spriteImageRef = useRef(new Image());
  const bulletImageRef = useRef(new Image());
  const obstacleImageRef = useRef(new Image());
  const obstacleCanvasRef = useRef(document.createElement("canvas"));
  const obstacleCtxRef = useRef(null);

  const keysRef = useRef({});
  const mouseRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const mouseActiveRef = useRef(false);
  const lastShotRef = useRef(0);
  const playerRef = useRef({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    angle: 0,
  });
  const lastAngleRef = useRef(0);
  const bulletsRef = useRef([]);

  useEffect(() => {
    bgImageRef.current.src = mapImage;
    spriteImageRef.current.src = playerSprite;
    bulletImageRef.current.src = bullet;

    obstacleImageRef.current.src = mapImageObstacles;
    obstacleImageRef.current.onload = () => {
      obstacleCanvasRef.current.width = obstacleImageRef.current.width;
      obstacleCanvasRef.current.height = obstacleImageRef.current.height;
      obstacleCtxRef.current = obstacleCanvasRef.current.getContext("2d");
      obstacleCtxRef.current.drawImage(obstacleImageRef.current, 0, 0);
    };
  }, []);

  const isWalkable = (x, y) => {
    if (!obstacleCtxRef.current) return true;
    const pixel = obstacleCtxRef.current.getImageData(x, y, 1, 1).data;
    return pixel[0] > 0;
  };

  const shootBullet = () => {
    const { x, y } = playerRef.current;
    const angle = lastAngleRef.current;

    bulletsRef.current.push({
      x:
        x +
        Math.cos(angle) * FORWARD_OFFSET +
        Math.cos(angle + Math.PI / 2) * SIDE_OFFSET,
      y:
        y +
        Math.sin(angle) * FORWARD_OFFSET +
        Math.sin(angle + Math.PI / 2) * SIDE_OFFSET,
      dx: Math.cos(angle) * BULLET_SPEED,
      dy: Math.sin(angle) * BULLET_SPEED,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleClick = () => {
      shootBullet();
    };

    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      mouseActiveRef.current = true;
    };

    const handleMouseLeave = () => {
      mouseActiveRef.current = false;
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleClick);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleClick);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const loop = () => {
      const keys = keysRef.current;
      const player = playerRef.current;

      let targetAngle = player.angle;

      if (mouseActiveRef.current) {
        const { x: mx, y: my } = mouseRef.current;
        targetAngle = Math.atan2(my - CANVAS_HEIGHT / 2, mx - CANVAS_WIDTH / 2);
      } else {
        let dx = 0,
          dy = 0;
        if (keys["w"]) dy -= 1;
        if (keys["s"]) dy += 1;
        if (keys["a"]) dx -= 1;
        if (keys["d"]) dx += 1;
        if (dx !== 0 || dy !== 0) {
          targetAngle = Math.atan2(dy, dx);
        }
      }

      lastAngleRef.current = targetAngle;
      player.angle = lerpAngle(player.angle, targetAngle, 0.2);

      let dx = 0,
        dy = 0;
      let forward = { x: 0, y: 0 };
      let strafe = { x: 0, y: 0 };

      if (mouseActiveRef.current) {
        // Twin-stick mode
        if (keys["w"]) {
          dx += Math.cos(player.angle) * PLAYER_SPEED;
          dy += Math.sin(player.angle) * PLAYER_SPEED;
        }
        if (keys["s"]) {
          dx -= Math.cos(player.angle) * PLAYER_SPEED;
          dy -= Math.sin(player.angle) * PLAYER_SPEED;
        }
        if (keys["a"]) {
          dx += Math.cos(player.angle - Math.PI / 2) * PLAYER_SPEED;
          dy += Math.sin(player.angle - Math.PI / 2) * PLAYER_SPEED;
        }
        if (keys["d"]) {
          dx += Math.cos(player.angle + Math.PI / 2) * PLAYER_SPEED;
          dy += Math.sin(player.angle + Math.PI / 2) * PLAYER_SPEED;
        }
      } else {
        // WASD mode — classic top-down movement
        if (keys["w"]) dy -= PLAYER_SPEED;
        if (keys["s"]) dy += PLAYER_SPEED;
        if (keys["a"]) dx -= PLAYER_SPEED;
        if (keys["d"]) dx += PLAYER_SPEED;
      }

      if (keys["w"]) {
        dx += forward.x * PLAYER_SPEED;
        dy += forward.y * PLAYER_SPEED;
      }
      if (keys["s"]) {
        dx -= forward.x * PLAYER_SPEED;
        dy -= forward.y * PLAYER_SPEED;
      }
      if (keys["a"]) {
        dx += strafe.x * PLAYER_SPEED;
        dy += strafe.y * PLAYER_SPEED;
      }
      if (keys["d"]) {
        dx -= strafe.x * PLAYER_SPEED;
        dy -= strafe.y * PLAYER_SPEED;
      }

      const nextX = Math.max(0, Math.min(WORLD_WIDTH, player.x + dx));
      const nextY = Math.max(0, Math.min(WORLD_HEIGHT, player.y + dy));

      if (isWalkable(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
      }

      const now = Date.now();
      if (keys[" "] && now - lastShotRef.current > SHOOT_COOLDOWN) {
        shootBullet();
        lastShotRef.current = now;
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => ({
          ...b,
          x: b.x + b.dx,
          y: b.y + b.dy,
        }))
        .filter(
          (b) =>
            b.x >= 0 &&
            b.x <= WORLD_WIDTH &&
            b.y >= 0 &&
            b.y <= WORLD_HEIGHT &&
            isWalkable(b.x, b.y)
        );

      const cameraX = player.x - CANVAS_WIDTH / 2;
      const cameraY = player.y - CANVAS_HEIGHT / 2;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (bgImageRef.current.complete) {
        ctx.drawImage(
          bgImageRef.current,
          -cameraX,
          -cameraY,
          WORLD_WIDTH,
          WORLD_HEIGHT
        );
      }

      bulletsRef.current.forEach((b) => {
        const angle = Math.atan2(b.dy, b.dx);
        const size = 16;

        ctx.save();
        ctx.translate(b.x - cameraX, b.y - cameraY);
        ctx.rotate(angle);
        ctx.drawImage(bulletImageRef.current, -size / 2, -size / 2, size, size);
        ctx.restore();
      });

      const sprite = spriteImageRef.current;
      ctx.save();
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.rotate(player.angle);
      ctx.drawImage(
        sprite,
        -((SPRITE_SIZE * SCALE) / 2),
        -((SPRITE_SIZE * SCALE) / 2),
        SPRITE_SIZE * SCALE,
        SPRITE_SIZE * SCALE
      );
      ctx.restore();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

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
          cursor: "crosshair",
        }}
      ></canvas>
    </div>
  );
}

export default PixelArena;
