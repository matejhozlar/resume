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
import { aStar } from "./pathfinding";
import ammoPack from "../assets/sprites/bullet/ammo.png";

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
  const ammoPacksRef = useRef([]);
  const ammoPackImageRef = useRef(new Image());

  const zombiesKilledRef = useRef(0);
  const zombieSpriteRef = useRef(new Image());
  const zombiesRef = useRef([]);
  const waveRef = useRef(0);
  const lastWaveTimeRef = useRef(Date.now());

  const canvasRef = useRef(null);
  const bgImageRef = useRef(new Image());
  const spriteImageRef = useRef(new Image());
  const bulletImageRef = useRef(new Image());
  const pathfindingGridRef = useRef([]);
  const isGridReadyRef = useRef(false);
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
  const waveNotificationTimeRef = useRef(0);
  const playerRef = useRef({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    angle: 0,
    vx: 0,
    vy: 0,
    health: 100,
    maxHealth: 100,
    lastDamageTime: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    bgImageRef.current.src = mapImage;
    spriteImageRef.current.src = playerSprite;
    bulletImageRef.current.src = bullet;
    ammoPackImageRef.current.src = ammoPack;
    zombieSpriteRef.current.src = zombie;
    obstacleImageRef.current.src = mapImageObstacles;
    obstacleImageRef.current.onload = () => {
      obstacleCanvasRef.current.width = WORLD_WIDTH;
      obstacleCanvasRef.current.height = WORLD_HEIGHT;
      obstacleCtxRef.current = obstacleCanvasRef.current.getContext("2d");
      obstacleCtxRef.current.imageSmoothingEnabled = false;
      obstacleCtxRef.current.mozImageSmoothingEnabled = false;
      obstacleCtxRef.current.webkitImageSmoothingEnabled = false;
      obstacleCtxRef.current.msImageSmoothingEnabled = false;

      // FIX: draw the obstacle image at full world dimensions.
      obstacleCtxRef.current.drawImage(
        obstacleImageRef.current,
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
      );

      const tileSize = 16;
      const grid = [];
      const tilesX = Math.floor(WORLD_WIDTH / tileSize);
      const tilesY = Math.floor(WORLD_HEIGHT / tileSize);

      for (let y = 0; y < tilesY; y++) {
        const row = [];
        for (let x = 0; x < tilesX; x++) {
          const centerX = x * tileSize + tileSize / 2;
          const centerY = y * tileSize + tileSize / 2;
          const pixel = obstacleCtxRef.current.getImageData(
            Math.floor(centerX),
            Math.floor(centerY),
            1,
            1
          ).data;
          const threshold = 50;
          const isWhite =
            pixel[0] > threshold &&
            pixel[1] > threshold &&
            pixel[2] > threshold;
          row.push(isWhite ? 1 : 0);
          console.log(`Pixel at (${centerX}, ${centerY}) =`, pixel);
        }
        grid.push(row);
      }
      pathfindingGridRef.current = grid;
      pathfindingGridRef.current.width = grid[0].length;
      pathfindingGridRef.current.height = grid.length;
      isGridReadyRef.current = true;
    };
  }, []);

  const tileSize = 16;

  const isTileWalkable = (tx, ty) => {
    return pathfindingGridRef.current[ty]?.[tx] === 1;
  };

  const isWalkable = (x, y) => {
    const tx = Math.floor(x / tileSize);
    const ty = Math.floor(y / tileSize);
    return isTileWalkable(tx, ty);
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
      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const bullet = bulletsRef.current[i];
        for (let j = zombiesRef.current.length - 1; j >= 0; j--) {
          const zombie = zombiesRef.current[j];
          const dx = bullet.x - zombie.x;
          const dy = bullet.y - zombie.y;
          const distance = Math.hypot(dx, dy);
          const bulletRadius = 8;
          const zombieRadius = 20;
          if (distance < bulletRadius + zombieRadius) {
            zombie.health -= 20;
            zombie.flashTimer = 10;
            bulletsRef.current.splice(i, 1);
            if (zombie.health <= 0) {
              zombiesRef.current.splice(j, 1);
              zombiesKilledRef.current++;
            }
            break;
          }
        }
      }

      const cameraX = player.x - CANVAS_WIDTH / 2;
      const cameraY = player.y - CANVAS_HEIGHT / 2;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background (only once)
      if (bgImageRef.current.complete) {
        ctx.drawImage(
          bgImageRef.current,
          -cameraX,
          -cameraY,
          WORLD_WIDTH,
          WORLD_HEIGHT
        );
      }

      ammoPacksRef.current.forEach((pack, index) => {
        // Check collision with the player (simple distance check)
        const dx = player.x - pack.x;
        const dy = player.y - pack.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 20) {
          reserveAmmoRef.current += pack.value;
          ammoPacksRef.current.splice(index, 1);
        } else {
          ctx.save();
          ctx.shadowColor = "yellow";
          ctx.shadowBlur = 10;
          ctx.drawImage(
            ammoPackImageRef.current,
            pack.x - cameraX - 16,
            pack.y - cameraY - 16,
            32,
            32
          );
          ctx.restore();
        }
      });

      const time = Date.now();
      if (isGridReadyRef.current && time - lastWaveTimeRef.current >= 20000) {
        waveRef.current++;
        lastWaveTimeRef.current = time;

        waveNotificationTimeRef.current = time;

        for (let i = 0; i < waveRef.current; i++) {
          let spawnX, spawnY;
          const tileSize = 16;
          const gridW = pathfindingGridRef.current.width;
          const gridH = pathfindingGridRef.current.height;
          do {
            const tx = Math.floor(Math.random() * gridW);
            const ty = Math.floor(Math.random() * gridH);
            spawnX = tx * tileSize + tileSize / 2;
            spawnY = ty * tileSize + tileSize / 2;
            if (
              spawnX < 0 ||
              spawnY < 0 ||
              spawnX > WORLD_WIDTH ||
              spawnY > WORLD_HEIGHT
            ) {
              continue;
            }
          } while (!isWalkable(spawnX, spawnY));

          zombiesRef.current.push({
            x: spawnX,
            y: spawnY,
            angle: 0,
            health: 50,
            maxHealth: 50,
          });
          ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
          ctx.fillRect(
            Math.floor(spawnX / tileSize) * tileSize - cameraX,
            Math.floor(spawnY / tileSize) * tileSize - cameraY,
            tileSize,
            tileSize
          );
        }

        let ammoSpawnChance = 0;
        if (waveRef.current < 4) {
          ammoSpawnChance = 0.0;
        } else if (waveRef.current < 11) {
          ammoSpawnChance = 0.3;
        } else {
          ammoSpawnChance = Math.min(0.3 + (waveRef.current - 10) * 0.02, 1);
        }
        if (Math.random() < ammoSpawnChance) {
          let packX, packY;
          do {
            const tx = Math.floor(
              Math.random() * pathfindingGridRef.current.width
            );
            const ty = Math.floor(
              Math.random() * pathfindingGridRef.current.height
            );
            packX = tx * tileSize + tileSize / 2;
            packY = ty * tileSize + tileSize / 2;
          } while (!isWalkable(packX, packY));
          ammoPacksRef.current.push({ x: packX, y: packY, value: 30 });
        }
      }

      zombiesRef.current.forEach((zombie) => {
        const tileSize = 16;
        const grid = pathfindingGridRef.current;
        if (!grid.length) return;

        const now = Date.now();
        const zx = Math.floor(zombie.x / tileSize);
        const zy = Math.floor(zombie.y / tileSize);
        const px = Math.floor(player.x / tileSize);
        const py = Math.floor(player.y / tileSize);

        // Update the zombie's path every 1000ms or if it doesn't have one yet.
        if (!zombie.path || now - zombie.lastPathUpdate > 1000) {
          zombie.path = aStar(grid, [zx, zy], [px, py]);
          zombie.lastPathUpdate = now;
        }

        if (zombie.path && zombie.path.length > 1) {
          const [nextX, nextY] = zombie.path[1];
          const targetX = nextX * tileSize + tileSize / 2;
          const targetY = nextY * tileSize + tileSize / 2;
          const dx = targetX - zombie.x;
          const dy = targetY - zombie.y;
          const dist = Math.hypot(dx, dy);
          const speed = 0.5;

          if (dist < speed) {
            zombie.x = targetX;
            zombie.y = targetY;
            zombie.path.shift();
          } else {
            zombie.x += (dx / dist) * speed;
            zombie.y += (dy / dist) * speed;
          }
          const targetAngle = Math.atan2(dy, dx);
          const rotationSpeed = 0.05;
          zombie.angle = lerpAngle(zombie.angle, targetAngle, rotationSpeed);
        }
      });

      for (let i = 0; i < zombiesRef.current.length; i++) {
        const zombieA = zombiesRef.current[i];
        for (let j = i + 1; j < zombiesRef.current.length; j++) {
          const zombieB = zombiesRef.current[j];
          const dx = zombieB.x - zombieA.x;
          const dy = zombieB.y - zombieA.y;
          const distance = Math.hypot(dx, dy);
          const minDistance = 20;
          if (distance < minDistance && distance > 0) {
            const overlap = (minDistance - distance) / 2;
            const nx = dx / distance;
            const ny = dy / distance;
            const pushFactors = [1, 0.5, 0.25];
            for (const factor of pushFactors) {
              const newXA = zombieA.x - nx * overlap * factor;
              const newYA = zombieA.y - ny * overlap * factor;
              const newXB = zombieB.x + nx * overlap * factor;
              const newYB = zombieB.y + ny * overlap * factor;
              if (isWalkable(newXA, newYA) && isWalkable(newXB, newYB)) {
                zombieA.x = newXA;
                zombieA.y = newYA;
                zombieB.x = newXB;
                zombieB.y = newYB;
                break;
              }
            }
          }
        }
      }

      const damageCooldown = 500;
      const damageAmount = 10;
      const currentTime = Date.now();

      const playerMinDistance = 20;
      zombiesRef.current.forEach((zombie) => {
        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;
        const distance = Math.hypot(dx, dy);
        if (distance < playerMinDistance && distance > 0) {
          if (currentTime - player.lastDamageTime >= damageCooldown) {
            player.health -= damageAmount;
            player.lastDamageTime = currentTime;
          }

          const overlap = playerMinDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;

          const pushFactors = [1, 0.5, 0.25];
          for (const factor of pushFactors) {
            const newX = player.x + nx * overlap * factor;
            const newY = player.y + ny * overlap * factor;
            if (isWalkable(newX, newY)) {
              player.x = newX;
              player.y = newY;
              break;
            }
          }
        }
      });

      bulletsRef.current.forEach((b) => {
        const angle = Math.atan2(b.dy, b.dx);
        ctx.save();
        ctx.translate(b.x - cameraX, b.y - cameraY);
        ctx.rotate(angle);
        ctx.drawImage(bulletImageRef.current, -8, -8, 16, 16);
        ctx.restore();
      });
      zombiesRef.current.forEach((zombie) => {
        zombiesRef.current.forEach((zombie) => {
          const zx = Math.round(zombie.x - cameraX);
          const zy = Math.round(zombie.y - cameraY);
          ctx.save();
          ctx.translate(zx, zy);
          ctx.rotate(zombie.angle - Math.PI / 2);
          ctx.drawImage(zombieSpriteRef.current, -24, -24, 48, 48);

          if (zombie.flashTimer && zombie.flashTimer > 0) {
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(-8, -8, 16, 16);
            ctx.globalCompositeOperation = "source-over";

            zombie.flashTimer--;
          }

          ctx.restore();

          const zHealthBarWidth = 40;
          const zHealthBarHeight = 4;
          const zHealthPercentage = zombie.health / zombie.maxHealth;
          const zHealthBarX = zx - zHealthBarWidth / 2;
          const zHealthBarY = zy - 30;

          ctx.fillStyle = "black";
          ctx.fillRect(
            zHealthBarX,
            zHealthBarY,
            zHealthBarWidth,
            zHealthBarHeight
          );

          ctx.fillStyle = "red";
          ctx.fillRect(
            zHealthBarX,
            zHealthBarY,
            zHealthBarWidth * zHealthPercentage,
            zHealthBarHeight
          );

          ctx.strokeStyle = "white";
          ctx.strokeRect(
            zHealthBarX,
            zHealthBarY,
            zHealthBarWidth,
            zHealthBarHeight
          );
        });
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

      const healthBarWidth = 50;
      const healthBarHeight = 5;
      const healthPercentage = player.health / player.maxHealth;
      const healthBarX = CANVAS_WIDTH / 2 - healthBarWidth / 2;
      const healthBarY = CANVAS_HEIGHT / 2 - 40;

      ctx.fillStyle = "red";
      ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

      ctx.fillStyle = "green";
      ctx.fillRect(
        healthBarX,
        healthBarY,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );

      ctx.strokeStyle = "black";
      ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

      ctx.fillStyle = "white";
      ctx.font = "16px monospace";
      ctx.fillText(
        `${currentAmmoRef.current} / ${reserveAmmoRef.current}`,
        10,
        20
      );

      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`Wave: ${waveRef.current}`, CANVAS_WIDTH - 20, 30);

      const nextWaveCountdown = Math.max(
        0,
        (20000 - (time - lastWaveTimeRef.current)) / 1000
      ).toFixed(1);
      ctx.fillText(`Next Wave: ${nextWaveCountdown}s`, CANVAS_WIDTH - 20, 60);
      ctx.textAlign = "start";

      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.textAlign = "right";
      ctx.fillText(
        `Zombies Alive: ${zombiesRef.current.length}`,
        CANVAS_WIDTH - 20,
        90
      );
      ctx.fillText(
        `Zombies Killed: ${zombiesKilledRef.current}`,
        CANVAS_WIDTH - 20,
        120
      );
      ctx.textAlign = "start";

      if (time - waveNotificationTimeRef.current < 3000) {
        ctx.fillStyle = "red";
        ctx.font = "40px 'Creepster', cursive";
        ctx.textAlign = "center";
        ctx.fillText(
          `Wave ${waveRef.current} Started!`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2
        );
        ctx.textAlign = "start";
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
