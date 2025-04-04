import React, { useRef, useEffect, useState } from "react";
import mapImage from "../assets/maps/zombie-city.png";
import playerSprite from "../assets/sprites/survivor.png";
import mapImageObstacles from "../assets/maps/zombie-city-obstacles.png";
import playerSpriteHandgun from "../assets/sprites/survivor-handgun.png";
import bullet from "../assets/sprites/bullet/bullet.png";
import zombie from "../assets/sprites/zombie.png";
import { aStar } from "./pathfinding";
import ammoPack from "../assets/sprites/bullet/ammo.png";
import armorPack from "../assets/sprites/bullet/armor.png";
import medkit from "../assets/sprites/bullet/medkit.png";
import reloadingRifle from "../assets/sprites/reloading/reloadingRifle.js";
import reloadingHandgun from "../assets/sprites/reloading/reloadingHandgun.js";
import grenade from "../assets/sprites/bullet/grenade.png";
import explosionSprite from "../assets/sprites/bullet/explosion.png";
import shootRifle from "../assets/sprites/shooting/shootRifle.js";
import shootHandgun from "../assets/sprites/shooting/shootHandgun.js";
import shootSoundRifle from "../assets/sprites/sounds/shootSoundRifle.js";
import shootSoundHandgun from "../assets/sprites/sounds/shootSoundHandgun.js";
import reloadSound from "../assets/sprites/sounds/reload.mp3";
import backgroundMusic from "../assets/sprites/sounds/background_music/backgroundMusic.js";
import grenadeExplosion from "../assets/sprites/sounds/grenadeExplosion.mp3";

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
const ACCELERATION = 0.2;
const FRICTION = 0.1;
const RELOAD_DURATION = 1000;
const MAX_PATHFINDING_UPDATES_PER_FRAME = 3;
const RIFLE_DAMAGE = 20;
const HANDGUN_DAMAGE = 30;
const RIFLE_COOLDOWN = 200;
const HANDGUN_COOLDOWN = 400;
const GRENADE_TIMER = 3000;
const GRENADE_RADIUS = 100;
const GRENADE_DAMAGE = 50;
const EXPLOSION_COLS = 8;
const EXPLOSION_TOTAL_FRAMES = 64;
const EXPLOSION_FRAME_DURATION = 5;
const EXPLOSION_DRAW_SIZE = 256;
const EXPLOSION_ATLAS_FRAME_SIZE = 512;
const SPATIAL_GRID_SIZE = 64;
const RELOAD_FRAMES = [
  reloadingRifle.reload1,
  reloadingRifle.reload2,
  reloadingRifle.reload3,
  reloadingRifle.reload4,
  reloadingRifle.reload5,
  reloadingRifle.reload6,
  reloadingRifle.reload7,
  reloadingRifle.reload8,
  reloadingRifle.reload9,
  reloadingRifle.reload10,
  reloadingRifle.reload11,
  reloadingRifle.reload12,
  reloadingRifle.reload13,
  reloadingRifle.reload14,
  reloadingRifle.reload15,
  reloadingRifle.reload16,
  reloadingRifle.reload17,
  reloadingRifle.reload18,
  reloadingRifle.reload19,
];

const lerpAngle = (a, b, t) => {
  const diff = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  return a + diff * t;
};

function getGridKey(x, y) {
  const gx = Math.floor(x / SPATIAL_GRID_SIZE);
  const gy = Math.floor(y / SPATIAL_GRID_SIZE);
  return `${gx},${gy}`;
}

function ZombieArena() {
  const soundEnabledRef = useRef(true);

  const pathCacheRef = useRef(new Map());

  const explosionsRef = useRef([]);
  const explosionsImageRef = useRef(new Image());

  const grenadesRef = useRef([]);
  const grenadeImageRef = useRef(new Image());
  const grenadeCountRef = useRef(0);

  const weaponRef = useRef("rifle");

  const handgunAmmoRef = useRef(7);
  const handgunReserveRef = useRef(14);

  const backgroundCanvasRef = useRef(document.createElement("canvas"));
  const backgroundCtxRef = useRef(null);

  const ammoUsedRef = useRef(0);

  const ammoPacksRef = useRef([]);
  const ammoPackImageRef = useRef(new Image());

  const medkitsRef = useRef([]);
  const medkitImageRef = useRef(new Image());
  const medkitCountRef = useRef(1);

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
  const reloadSounds = useRef(new Audio());
  const grenadeExplosionSound = useRef(new Audio(grenadeExplosion));
  const reloadImages = useRef(
    RELOAD_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    })
  );
  const rifleShootSounds = useRef(
    Object.values(shootSoundRifle).map((src) => new Audio(src))
  );
  const handgunShootSounds = useRef(
    Object.values(shootSoundHandgun).map((src) => new Audio(src))
  );
  const musicTracks = useRef(
    Object.values(backgroundMusic).map((src) => {
      const audio = new Audio(src);
      audio.volume = 0.5;
      audio.loop = false;
      return audio;
    })
  );
  const currentTrackIndex = useRef(null);
  const obstacleImageRef = useRef(new Image());
  const obstacleCanvasRef = useRef(document.createElement("canvas"));
  const obstacleCtxRef = useRef(null);

  const armorPacksRef = useRef([]);
  const armorPackImageRef = useRef(new Image());

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
  const bulletHitsRef = useRef(0);
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
    armor: 0,
    maxArmor: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const restartGame = () => {
    playerRef.current = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      angle: 0,
      vx: 0,
      vy: 0,
      health: 100,
      maxHealth: 100,
      lastDamageTime: 0,
      armor: 0,
      maxArmor: 0,
    };

    zombiesRef.current = [];
    waveRef.current = 0;
    ammoPacksRef.current = [];
    medkitsRef.current = [];
    armorPacksRef.current = [];
    currentAmmoRef.current = 30;
    reserveAmmoRef.current = 270;
    handgunAmmoRef.current = 7;
    handgunReserveRef.current = 14;
    medkitCountRef.current = 1;
    lastWaveTimeRef.current = Date.now();
    zombiesKilledRef.current = 0;
    ammoUsedRef.current = 0;
    grenadeCountRef.current = 0;
    bulletHitsRef.current = 0;

    setGameOver(false);
    setGameStarted(false);
    stopBackgroundMusic();
    setTimeout(() => {
      setGameStarted(true);
    }, 0);
  };

  useEffect(() => {
    bgImageRef.current.src = mapImage;
    bgImageRef.current.onload = () => {
      backgroundCanvasRef.current.width = WORLD_WIDTH;
      backgroundCanvasRef.current.height = WORLD_HEIGHT;
      backgroundCtxRef.current = backgroundCanvasRef.current.getContext("2d");
      backgroundCtxRef.current.imageSmoothingEnabled = false;
      backgroundCtxRef.current.drawImage(
        bgImageRef.current,
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
      );
    };

    spriteImageRef.current.src = playerSprite;
    bulletImageRef.current.src = bullet;
    ammoPackImageRef.current.src = ammoPack;
    grenadeImageRef.current.src = grenade;
    armorPackImageRef.current.src = armorPack;
    medkitImageRef.current.src = medkit;
    zombieSpriteRef.current.src = zombie;
    explosionsImageRef.current.src = explosionSprite;
    reloadSounds.current.src = reloadSound;

    obstacleImageRef.current.src = mapImageObstacles;
    obstacleImageRef.current.onload = () => {
      obstacleCanvasRef.current.width = WORLD_WIDTH;
      obstacleCanvasRef.current.height = WORLD_HEIGHT;
      obstacleCtxRef.current = obstacleCanvasRef.current.getContext("2d");
      obstacleCtxRef.current.imageSmoothingEnabled = false;
      obstacleCtxRef.current.mozImageSmoothingEnabled = false;
      obstacleCtxRef.current.webkitImageSmoothingEnabled = false;
      obstacleCtxRef.current.msImageSmoothingEnabled = false;

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
        }
        grid.push(row);
      }
      pathfindingGridRef.current = grid;
      pathfindingGridRef.current.width = grid[0].length;
      pathfindingGridRef.current.height = grid.length;
      isGridReadyRef.current = true;
    };
  }, []);

  const reloadHandgunImages = useRef(
    Object.values(reloadingHandgun).map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    })
  );

  const shootRifleFrames = useRef(
    Object.values(shootRifle).map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    })
  );

  const shootingAnimationRifleRef = useRef({
    active: false,
    startTime: 0,
    duration: 150,
    frameIndex: 0,
  });

  const shootHandgunFrames = useRef(
    Object.values(shootHandgun).map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    })
  );

  const shootingAnimationsHandgunRef = useRef({
    active: false,
    startTime: 0,
    duration: 150,
    frameIndex: 0,
  });

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
    if (isReloadingRef.current) return;

    const { x, y } = playerRef.current;
    const angle = lastAngleRef.current;

    const weapon = weaponRef.current;
    const currentAmmo =
      weapon === "rifle" ? currentAmmoRef.current : handgunAmmoRef.current;

    if (currentAmmo <= 0) return;

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

    ammoUsedRef.current++;

    if (weapon === "rifle") {
      currentAmmoRef.current--;

      shootingAnimationRifleRef.current = {
        active: true,
        startTime: Date.now(),
        frameIndex: 0,
        duration: 150,
      };

      const sounds = rifleShootSounds.current;
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      if (soundEnabledRef.current) {
        randomSound.currentTime = 0;
        randomSound.play();
      }
    } else {
      handgunAmmoRef.current--;

      shootingAnimationsHandgunRef.current = {
        active: true,
        startTime: Date.now(),
        frameIndex: 0,
        duration: 150,
      };
      const sounds = handgunShootSounds.current;
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      if (soundEnabledRef.current) {
        randomSound.currentTime = 0;
        randomSound.play();
      }
    }
  };

  const stopBackgroundMusic = () => {
    musicTracks.current.forEach((track) => {
      track.pause();
      track.currentTime = 0;
      track.onended = null;
    });
  };

  useEffect(() => {
    if (!gameStarted) return;

    const tracks = musicTracks.current;

    if (soundEnabled) {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      currentTrackIndex.current = nextIndex;
      const nextTrack = tracks[nextIndex];

      nextTrack.currentTime = 0;
      nextTrack.play();

      nextTrack.onended = () => {
        if (!soundEnabledRef.current) return;
        const newIndex = Math.floor(Math.random() * tracks.length);
        currentTrackIndex.current = newIndex;
        const newTrack = tracks[newIndex];
        newTrack.currentTime = 0;
        newTrack.play();
        newTrack.onended = nextTrack.onended;
      };
    } else {
      tracks.forEach((track) => {
        track.pause();
        track.currentTime = 0;
        track.onended = null;
      });
    }
  }, [soundEnabled, gameStarted]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      if (
        key === "r" &&
        !isReloadingRef.current &&
        ((weaponRef.current === "rifle" &&
          currentAmmoRef.current < 30 &&
          reserveAmmoRef.current > 0) ||
          (weaponRef.current === "handgun" &&
            handgunAmmoRef.current < 7 &&
            handgunReserveRef.current > 0))
      ) {
        isReloadingRef.current = true;
        reloadStartTimeRef.current = Date.now();

        if (soundEnabledRef.current) {
          reloadSounds.current.currentTime = 0;
          reloadSounds.current.play();
        }
      }
      if (key === "q") {
        weaponRef.current = weaponRef.current === "rifle" ? "handgun" : "rifle";
      }
      if (key === "g" && grenadeCountRef.current > 0) {
        grenadesRef.current.push({
          x: playerRef.current.x,
          y: playerRef.current.y,
          spawnTime: Date.now(),
          isPickup: false,
        });
        grenadeCountRef.current--;
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
  }, [reloadSounds, soundEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const cache = pathCacheRef.current;
      for (const [key, value] of cache.entries()) {
        if (now - value.time > 2000) {
          cache.delete(key);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const ctx = canvasRef.current.getContext("2d");

    const loop = () => {
      const keys = keysRef.current;
      const player = playerRef.current;

      if (player.health <= 0) {
        if (!gameOver) {
          const accuracy = (bulletHitsRef.current / ammoUsedRef.current) * 100;
          setGameOver(true);
          stopBackgroundMusic();

          fetch("http://localhost:5000/ZombieArenaScore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              wave: waveRef.current,
              zombiesKilled: zombiesKilledRef.current,
              ammoUsed: ammoUsedRef.current,
              accuracy: accuracy,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                console.log("Best score updated if was higher!");
              } else {
                console.error("Error updating best score:", data.error);
              }
            })
            .catch((err) => console.error("Fetch error:", err));
        }
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(
          `Wave reached: ${waveRef.current}`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2
        );
        ctx.fillText(
          `Zombies killed: ${zombiesKilledRef.current}`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 40
        );
        return;
      }

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

        const frames =
          weaponRef.current === "rifle"
            ? reloadImages.current
            : reloadHandgunImages.current;

        const frameIndex = Math.floor(
          (elapsed / RELOAD_DURATION) * frames.length
        );
        spriteImageRef.current =
          frames[Math.min(frameIndex, frames.length - 1)];

        if (elapsed >= RELOAD_DURATION) {
          if (weaponRef.current === "rifle") {
            const toReload = Math.min(
              30 - currentAmmoRef.current,
              reserveAmmoRef.current
            );
            currentAmmoRef.current += toReload;
            reserveAmmoRef.current -= toReload;
          } else {
            const toReload = Math.min(
              7 - handgunAmmoRef.current,
              handgunReserveRef.current
            );
            handgunAmmoRef.current += toReload;
            handgunReserveRef.current -= toReload;
          }

          isReloadingRef.current = false;
        }
      } else {
        spriteImageRef.current = new Image();
        spriteImageRef.current.src =
          weaponRef.current === "rifle" ? playerSprite : playerSpriteHandgun;
      }

      const now = Date.now();
      const weaponInUse = weaponRef.current;
      const cooldown =
        weaponInUse === "rifle" ? RIFLE_COOLDOWN : HANDGUN_COOLDOWN;
      if (
        (keys[" "] || mouseDownRef.current) &&
        now - lastShotRef.current > cooldown
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

      const spatialGrid = new Map();

      zombiesRef.current.forEach((zombie) => {
        const key = getGridKey(zombie.x, zombie.y);
        if (!spatialGrid.has(key)) spatialGrid.set(key, []);
        spatialGrid.get(key).push(zombie);
      });
      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const bullet = bulletsRef.current[i];
        const bx = bullet.x;
        const by = bullet.y;
        const bKeyX = Math.floor(bx / SPATIAL_GRID_SIZE);
        const bKeyY = Math.floor(by / SPATIAL_GRID_SIZE);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${bKeyX + dx},${bKeyY + dy}`;
            const cellZombies = spatialGrid.get(key);
            if (!cellZombies) continue;

            for (let j = cellZombies.length - 1; j >= 0; j--) {
              const zombie = cellZombies[j];
              const dx = bullet.x - zombie.x;
              const dy = bullet.y - zombie.y;
              const distance = Math.hypot(dx, dy);
              const bulletRadius = 8;
              const zombieRadius = 20;

              if (distance < bulletRadius + zombieRadius) {
                const damage =
                  weaponRef.current === "rifle" ? RIFLE_DAMAGE : HANDGUN_DAMAGE;
                zombie.health -= damage;
                zombie.flashTimer = 10;
                bulletsRef.current.splice(i, 1);
                bulletHitsRef.current++;

                if (zombie.health <= 0) {
                  const index = zombiesRef.current.indexOf(zombie);
                  if (index !== -1) {
                    zombiesRef.current.splice(index, 1);
                    zombiesKilledRef.current++;
                  }
                }

                break;
              }
            }
          }
        }
      }

      const cameraX = player.x - CANVAS_WIDTH / 2;
      const cameraY = player.y - CANVAS_HEIGHT / 2;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (backgroundCanvasRef.current) {
        ctx.drawImage(backgroundCanvasRef.current, -cameraX, -cameraY);
      }

      armorPacksRef.current.forEach((pack, index) => {
        const dx = player.x - pack.x;
        const dy = player.y - pack.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 20) {
          player.armor = pack.value;
          player.maxArmor = pack.value;
          armorPacksRef.current.splice(index, 1);
        } else {
          ctx.save();
          ctx.shadowColor = "cyan";
          ctx.shadowBlur = 10;
          ctx.drawImage(
            armorPackImageRef.current,
            pack.x - cameraX - 16,
            pack.y - cameraY - 16,
            32,
            32
          );
          ctx.restore();
        }
      });

      ammoPacksRef.current.forEach((pack, index) => {
        const dx = player.x - pack.x;
        const dy = player.y - pack.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 20) {
          reserveAmmoRef.current += pack.value;
          handgunReserveRef.current += 14;
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

        const zombieCount = Math.floor((waveRef.current + 1) / 2);
        for (let i = 0; i < zombieCount; i++) {
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

        if (waveRef.current >= 5 && Math.random() < 0.2) {
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
          armorPacksRef.current.push({ x: packX, y: packY, value: 50 });
        }

        if (waveRef.current >= 5 && Math.random() < 0.2) {
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

          grenadesRef.current.push({
            x: packX,
            y: packY,
            spawnTime: -1,
            isPickup: true,
          });
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

        if (waveRef.current >= 5 && Math.random() < 0.2) {
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
          medkitsRef.current.push({
            x: packX,
            y: packY,
            spawnTime: Date.now(),
          });
        }
      }

      let pathfindingUpdatesThisFrame = 0;

      zombiesRef.current.forEach((zombie) => {
        const tileSize = 16;
        const grid = pathfindingGridRef.current;
        if (!grid.length) return;

        const now = Date.now();
        const zx = Math.floor(zombie.x / tileSize);
        const zy = Math.floor(zombie.y / tileSize);
        const px = Math.floor(player.x / tileSize);
        const py = Math.floor(player.y / tileSize);

        const needsNewPath =
          !zombie.path ||
          now - zombie.lastPathUpdate > 1500 + Math.random() * 500;

        if (
          needsNewPath &&
          pathfindingUpdatesThisFrame < MAX_PATHFINDING_UPDATES_PER_FRAME
        ) {
          const cacheKey = `${zx},${zy}->${px},${py}`;
          const cached = pathCacheRef.current.get(cacheKey);

          if (cached && now - cached.time < 500) {
            zombie.path = cached.path;
          } else {
            const path = aStar(grid, [zx, zy], [px, py]);
            zombie.path = path;
            pathCacheRef.current.set(cacheKey, { path, time: now });
            pathfindingUpdatesThisFrame++;
          }

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
            let remainingDamage = damageAmount;
            if (player.armor > 0) {
              if (player.armor >= remainingDamage) {
                player.armor -= remainingDamage;
                remainingDamage = 0;
              } else {
                remainingDamage -= player.armor;
                player.armor = 0;
              }
            }
            if (remainingDamage > 0) {
              player.health -= remainingDamage;
            }
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

      if (keysRef.current["e"]) {
        if (medkitCountRef.current > 0 && player.health < player.maxHealth) {
          medkitCountRef.current--;
          player.health = Math.min(player.health + 20, player.maxHealth);
        }
        keysRef.current["e"] = false;
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

      ctx.save();
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.rotate(player.angle);

      const weap = weaponRef.current;

      if (weap === "rifle" && shootingAnimationRifleRef.current.active) {
        const { startTime, duration } = shootingAnimationRifleRef.current;
        const elapsed = Date.now() - startTime;
        const totalFrames = shootRifleFrames.current.length;

        const frameIndex = Math.floor((elapsed / duration) * totalFrames);
        const frame =
          shootRifleFrames.current[Math.min(frameIndex, totalFrames - 1)];

        ctx.drawImage(
          frame,
          -24,
          -24,
          SPRITE_SIZE * SCALE,
          SPRITE_SIZE * SCALE
        );

        if (elapsed > duration) {
          shootingAnimationRifleRef.current.active = false;
        }
      } else if (
        weap === "handgun" &&
        shootingAnimationsHandgunRef.current.active
      ) {
        const { startTime, duration } = shootingAnimationsHandgunRef.current;
        const elapsed = Date.now() - startTime;
        const totalFrames = shootHandgunFrames.current.length;

        const frameIndex = Math.floor((elapsed / duration) * totalFrames);
        const frame =
          shootHandgunFrames.current[Math.min(frameIndex, totalFrames - 1)];

        ctx.drawImage(
          frame,
          -24,
          -24,
          SPRITE_SIZE * SCALE,
          SPRITE_SIZE * SCALE
        );

        if (elapsed > duration) {
          shootingAnimationsHandgunRef.current.active = false;
        }
      } else {
        ctx.drawImage(
          spriteImageRef.current,
          -24,
          -24,
          SPRITE_SIZE * SCALE,
          SPRITE_SIZE * SCALE
        );
      }

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

      if (player.armor > 0) {
        const armorBarWidth = healthBarWidth;
        const armorBarHeight = 5;
        const armorPercentage = player.armor / player.maxArmor;
        const armorBarX = CANVAS_WIDTH / 2 - armorBarWidth / 2;
        const armorBarY = healthBarY - 10;
        ctx.fillStyle = "cyan";
        ctx.fillRect(
          armorBarX,
          armorBarY,
          armorBarWidth * armorPercentage,
          armorBarHeight
        );
        ctx.strokeStyle = "black";
        ctx.strokeRect(armorBarX, armorBarY, armorBarWidth, armorBarHeight);
      }

      medkitsRef.current.forEach((pack, index) => {
        const dx = player.x - pack.x;
        const dy = player.y - pack.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 20) {
          medkitCountRef.current++;
          medkitsRef.current.splice(index, 1);
        } else {
          ctx.save();
          ctx.shadowColor = "magenta";
          ctx.shadowBlur = 10;
          ctx.drawImage(
            medkitImageRef.current,
            pack.x - cameraX - 16,
            pack.y - cameraY - 16,
            32,
            32
          );
          ctx.restore();
        }
      });

      for (let i = grenadesRef.current.length - 1; i >= 0; i--) {
        const grenade = grenadesRef.current[i];

        if (!grenade.isPickup) continue;

        const dx = playerRef.current.x - grenade.x;
        const dy = playerRef.current.y - grenade.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 20) {
          grenadeCountRef.current++;
          grenadesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.shadowColor = "orange";
          ctx.shadowBlur = 10;
          ctx.drawImage(
            grenadeImageRef.current,
            grenade.x - cameraX - 16,
            grenade.y - cameraY - 16,
            32,
            32
          );
          ctx.restore();
        }
      }

      grenadesRef.current
        .filter((grenade) => !grenade.isPickup)
        .forEach((grenade, index) => {
          const timeSinceDrop = Date.now() - grenade.spawnTime;

          if (timeSinceDrop >= GRENADE_TIMER) {
            for (let j = zombiesRef.current.length - 1; j >= 0; j--) {
              const zombie = zombiesRef.current[j];
              const dx = zombie.x - grenade.x;
              const dy = zombie.y - grenade.y;
              const dist = Math.hypot(dx, dy);
              if (dist <= GRENADE_RADIUS) {
                zombie.health -= GRENADE_DAMAGE;
                zombie.flashTimer = 10;
                if (zombie.health <= 0) {
                  zombiesRef.current.splice(j, 1);
                  zombiesKilledRef.current++;
                }
              }
            }

            const pdx = player.x - grenade.x;
            const pdy = player.y - grenade.y;
            const playerDistance = Math.hypot(pdx, pdy);
            if (playerDistance <= GRENADE_RADIUS) {
              let remainingDamage = GRENADE_DAMAGE;
              if (player.armor > 0) {
                if (player.armor >= remainingDamage) {
                  player.armor -= remainingDamage;
                  remainingDamage = 0;
                } else {
                  remainingDamage -= player.armor;
                  player.armor = 0;
                }
              }
              if (remainingDamage > 0) {
                player.health -= remainingDamage;
              }
            }

            explosionsRef.current.push({
              x: grenade.x,
              y: grenade.y,
              startTime: Date.now(),
            });

            if (soundEnabled) {
              grenadeExplosionSound.current.currentTime = 0;
              grenadeExplosionSound.current.play();
            }

            const grenadeIndex = grenadesRef.current.indexOf(grenade);
            if (grenadeIndex !== -1) {
              grenadesRef.current.splice(grenadeIndex, 1);
            }
          } else {
            ctx.drawImage(
              grenadeImageRef.current,
              grenade.x - cameraX - 16,
              grenade.y - cameraY - 16,
              32,
              32
            );
            ctx.fillStyle = "white";
            ctx.font = "12px monospace";
            ctx.fillText(
              (3 - timeSinceDrop / 1000).toFixed(1),
              grenade.x - cameraX - 8,
              grenade.y - cameraY - 20
            );
          }
        });

      explosionsRef.current = explosionsRef.current.filter((explosion) => {
        const elapsed = Date.now() - explosion.startTime;
        const frame = Math.floor(elapsed / EXPLOSION_FRAME_DURATION);

        if (frame >= EXPLOSION_TOTAL_FRAMES) return false;

        const sx = (frame % EXPLOSION_COLS) * EXPLOSION_ATLAS_FRAME_SIZE;
        const sy =
          Math.floor(frame / EXPLOSION_COLS) * EXPLOSION_ATLAS_FRAME_SIZE;
        const dx = explosion.x - cameraX - EXPLOSION_DRAW_SIZE / 2;
        const dy = explosion.y - cameraY - EXPLOSION_DRAW_SIZE / 2;

        ctx.drawImage(
          explosionsImageRef.current,
          sx,
          sy,
          EXPLOSION_ATLAS_FRAME_SIZE,
          EXPLOSION_ATLAS_FRAME_SIZE,
          dx,
          dy,
          EXPLOSION_DRAW_SIZE,
          EXPLOSION_DRAW_SIZE
        );

        return true;
      });

      const weapon = weaponRef.current;
      const ammo =
        weapon === "rifle"
          ? `${currentAmmoRef.current} / ${reserveAmmoRef.current}`
          : `${handgunAmmoRef.current} / ${handgunReserveRef.current}`;
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "16px monospace";
      ctx.textBaseLine = "top";
      ctx.fillText(`Ammo: ${ammo}`, 10, 30);
      ctx.fillText(`Medkits: ${medkitCountRef.current}`, 10, 50);
      ctx.fillText(`Grenades: ${grenadeCountRef.current}`, 10, 70);

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
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted) {
      stopBackgroundMusic();
    }
  }, [gameStarted]);

  return (
    <div className="game-container">
      {(!gameStarted || gameOver) && (
        <div className="overlay">
          {gameOver ? (
            <div className="game-over-container">
              <h1 className="game-over-title">Game Over</h1>
              <p className="game-over-wave">Wave reached: {waveRef.current}</p>
              <p className="game-over-zombies">
                Zombies killed: {zombiesKilledRef.current}
              </p>
              <p className="game-over-ammo">Ammo used: {ammoUsedRef.current}</p>
              <p className="game-over-accuracy">
                Accuracy:{" "}
                {ammoUsedRef.current > 0
                  ? (
                      (bulletHitsRef.current / ammoUsedRef.current) *
                      100
                    ).toFixed(2)
                  : "0.00"}
                %
              </p>
              <button onClick={restartGame} className="restart-button">
                Restart
              </button>
            </div>
          ) : (
            <button
              onClick={() => setGameStarted(true)}
              className="play-button"
            >
              Start
            </button>
          )}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        tabIndex={0}
        className={`game-canvas ${!gameStarted ? "blurred" : ""}`}
      ></canvas>
      <button
        onClick={() => {
          setSoundEnabled((prev) => !prev);
          canvasRef.current?.focus();
        }}
        className="sound-toggle-button"
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
    </div>
  );
}

export default ZombieArena;
