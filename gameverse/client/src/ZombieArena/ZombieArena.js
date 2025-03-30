import React, { useRef, useEffect, useState } from "react";
import mapImage from "../assets/maps/zombie-city.png";
import playerSprite from "../assets/sprites/survivor.png";
import mapImageObstacles from "../assets/maps/zombie-city-obstacles.png";
import bullet from "../assets/sprites/bullet/bullet.png";
import reload1 from "../assets/sprites/reloading/survivor-reload_rifle_0.png";
import reload2 from "../assets/sprites/reloading/survivor-reload_rifle_1.png";
import reload3 from "../assets/sprites/reloading/survivor-reload_rifle_2.png";
import reload4 from "../assets/sprites/reloading/survivor-reload_rifle_3.png";
import reload5 from "../assets/sprites/reloading/survivor-reload_rifle_4.png";
import reload6 from "../assets/sprites/reloading/survivor-reload_rifle_5.png";
import reload7 from "../assets/sprites/reloading/survivor-reload_rifle_6.png";
import reload8 from "../assets/sprites/reloading/survivor-reload_rifle_7.png";
import reload9 from "../assets/sprites/reloading/survivor-reload_rifle_8.png";
import reload10 from "../assets/sprites/reloading/survivor-reload_rifle_9.png";
import reload11 from "../assets/sprites/reloading/survivor-reload_rifle_10.png";
import reload12 from "../assets/sprites/reloading/survivor-reload_rifle_11.png";
import reload13 from "../assets/sprites/reloading/survivor-reload_rifle_12.png";
import reload14 from "../assets/sprites/reloading/survivor-reload_rifle_13.png";
import reload15 from "../assets/sprites/reloading/survivor-reload_rifle_14.png";
import reload16 from "../assets/sprites/reloading/survivor-reload_rifle_15.png";
import reload17 from "../assets/sprites/reloading/survivor-reload_rifle_16.png";
import reload18 from "../assets/sprites/reloading/survivor-reload_rifle_17.png";
import reload19 from "../assets/sprites/reloading/survivor-reload_rifle_18.png";
import zombie from "../assets/sprites/zombie.png";

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
const ACCELERATION = 0.2;
const FRICTION = 0.1;
const RELOAD_DURATION = 1000;
const RELOAD_FRAMES = [
  reload1,
  reload2,
  reload3,
  reload4,
  reload5,
  reload6,
  reload7,
  reload8,
  reload9,
  reload10,
  reload11,
  reload12,
  reload13,
  reload14,
  reload15,
  reload16,
  reload17,
  reload18,
  reload19,
];

const lerpAngle = (a, b, t) => {
  const diff = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  return a + diff * t;
};

function ZombieArena() {
  const zombieSpriteRef = useRef(new Image());
  const zombiesRef = useRef([]);
  const waveRef = useRef(0);
  const lastWaveTimeRef = useRef(Date.now());
  const canvasRef = useRef(null);
  const bgImageRef = useRef(new Image());
  const spriteImageRef = useRef(new Image());
  const bulletImageRef = useRef(new Image());
  const reloadImages = useRef(
    RELOAD_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    })
  );
  const obstacleImageRef = useRef(new Image());
  const obstacleCanvasRef = useRef(document.createElement("canvas"));
  const obstacleCtxRef = useRef(null);

  const keysRef = useRef({});
  const mouseRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const mouseActiveRef = useRef(false);
  const mouseDownRef = useRef(false);
  const lastShotRef = useRef(0);
  const isReloadingRef = useRef(false);
  const reloadStartTimeRef = useRef(0);
  const currentAmmoRef = useRef(30);
  const reserveAmmoRef = useRef(270);
  const bulletsRef = useRef([]);
  const lastAngleRef = useRef(0);
  const playerRef = useRef({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    angle: 0,
    vx: 0,
    vy: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    bgImageRef.current.src = mapImage;
    spriteImageRef.current.src = playerSprite;
    bulletImageRef.current.src = bullet;
    zombieSpriteRef.current.src = zombie;
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
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const clampedX = Math.max(
      0,
      Math.min(obstacleCanvasRef.current.width - 1, ix)
    );
    const clampedY = Math.max(
      0,
      Math.min(obstacleCanvasRef.current.height - 1, iy)
    );
    const pixel = obstacleCtxRef.current.getImageData(
      clampedX,
      clampedY,
      1,
      1
    ).data;
    return pixel[0] > 0;
  };

  const shootBullet = () => {
    if (currentAmmoRef.current <= 0 || isReloadingRef.current) return;
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
    currentAmmoRef.current--;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      if (
        key === "r" &&
        !isReloadingRef.current &&
        currentAmmoRef.current < 30 &&
        reserveAmmoRef.current > 0
      ) {
        isReloadingRef.current = true;
        reloadStartTimeRef.current = Date.now();
      }
    };
    const handleKeyUp = (e) => (keysRef.current[e.key.toLowerCase()] = false);
    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseEnter = () => (mouseActiveRef.current = true);
    const handleMouseLeave = () => {
      mouseActiveRef.current = false;
      mouseDownRef.current = false;
    };
    const handleMouseDown = () => (mouseDownRef.current = true);
    const handleMouseUp = () => (mouseDownRef.current = false);

    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

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
        if (dx || dy) targetAngle = Math.atan2(dy, dx);
      }

      lastAngleRef.current = targetAngle;
      player.angle = lerpAngle(player.angle, targetAngle, 0.2);

      let inputX = 0,
        inputY = 0;
      if (mouseActiveRef.current) {
        if (keys["w"]) {
          inputX += Math.cos(player.angle);
          inputY += Math.sin(player.angle);
        }
        if (keys["s"]) {
          inputX -= Math.cos(player.angle);
          inputY -= Math.sin(player.angle);
        }
        if (keys["a"]) {
          inputX += Math.cos(player.angle - Math.PI / 2);
          inputY += Math.sin(player.angle - Math.PI / 2);
        }
        if (keys["d"]) {
          inputX += Math.cos(player.angle + Math.PI / 2);
          inputY += Math.sin(player.angle + Math.PI / 2);
        }
      } else {
        if (keys["w"]) inputY -= 1;
        if (keys["s"]) inputY += 1;
        if (keys["a"]) inputX -= 1;
        if (keys["d"]) inputX += 1;
      }

      const len = Math.hypot(inputX, inputY);
      if (len > 0) {
        inputX /= len;
        inputY /= len;
      }

      player.vx += inputX * ACCELERATION;
      player.vy += inputY * ACCELERATION;
      if (len === 0) {
        player.vx *= 1 - FRICTION;
        player.vy *= 1 - FRICTION;
      }

      const speed = Math.hypot(player.vx, player.vy);
      if (speed > PLAYER_SPEED) {
        player.vx = (player.vx / speed) * PLAYER_SPEED;
        player.vy = (player.vy / speed) * PLAYER_SPEED;
      }

      const nextX = player.x + player.vx;
      const nextY = player.y + player.vy;
      if (isWalkable(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
      }

      if (isReloadingRef.current) {
        const elapsed = Date.now() - reloadStartTimeRef.current;
        const frameIndex = Math.floor(
          (elapsed / RELOAD_DURATION) * reloadImages.current.length
        );
        if (elapsed >= RELOAD_DURATION) {
          const toReload = Math.min(
            30 - currentAmmoRef.current,
            reserveAmmoRef.current
          );
          currentAmmoRef.current += toReload;
          reserveAmmoRef.current -= toReload;
          isReloadingRef.current = false;
        }
        spriteImageRef.current =
          reloadImages.current[
            Math.min(frameIndex, reloadImages.current.length - 1)
          ];
      } else {
        spriteImageRef.current = new Image();
        spriteImageRef.current.src = playerSprite;
      }

      const now = Date.now();
      if (
        (keys[" "] || mouseDownRef.current) &&
        now - lastShotRef.current > SHOOT_COOLDOWN
      ) {
        shootBullet();
        lastShotRef.current = now;
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => ({ ...b, x: b.x + b.dx, y: b.y + b.dy }))
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

      const time = Date.now();
      if (time - lastWaveTimeRef.current >= 20000) {
        waveRef.current++;
        lastWaveTimeRef.current = time;
        for (let i = 0; i < waveRef.current; i++) {
          const spawnX = Math.random() * WORLD_WIDTH;
          const spawnY = Math.random() * WORLD_HEIGHT;
          zombiesRef.current.push({ x: spawnX, y: spawnY });
        }
      }

      zombiesRef.current.forEach((zombie) => {
        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;
        const dist = Math.hypot(dx, dy);
        const speed = 0.3;

        if (dist > 1) {
          zombie.x += (dx / dist) * speed;
          zombie.y += (dy / dist) * speed;
        }

        zombie.angle = Math.atan2(dy, dx);
      });

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
        ctx.save();
        ctx.translate(b.x - cameraX, b.y - cameraY);
        ctx.rotate(angle);
        ctx.drawImage(bulletImageRef.current, -8, -8, 16, 16);
        ctx.restore();
      });
      zombiesRef.current.forEach((zombie) => {
        const zx = zombie.x - cameraX;
        const zy = zombie.y - cameraY;
        ctx.save();
        ctx.translate(zx, zy);
        ctx.rotate(zombie.angle - Math.PI / 2);
        ctx.drawImage(zombieSpriteRef.current, -24, -24, 48, 48);
        ctx.restore();
      });

      ctx.save();
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.rotate(player.angle);
      ctx.drawImage(
        spriteImageRef.current,
        -24,
        -24,
        SPRITE_SIZE * SCALE,
        SPRITE_SIZE * SCALE
      );
      ctx.restore();

      ctx.fillStyle = "white";
      ctx.font = "16px monospace";
      ctx.fillText(
        `${currentAmmoRef.current} / ${reserveAmmoRef.current}`,
        10,
        20
      );

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, [gameStarted]);

  return (
    <div
      style={{ position: "relative", width: CANVAS_WIDTH, margin: "0 auto" }}
    >
      {!gameStarted && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <button
            onClick={() => setGameStarted(true)}
            style={{
              fontSize: "24px",
              padding: "12px 36px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#8a5cf6",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            Play
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: "2px solid #8a5cf6",
          backgroundColor: "#000",
          imageRendering: "pixelated",
          cursor: "crosshair",
          filter: !gameStarted ? "blur(6px)" : "none",
        }}
      ></canvas>
    </div>
  );
}

export default ZombieArena;
