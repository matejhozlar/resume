# 🧟‍♂️ Zombie Arena

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Game Status](https://img.shields.io/badge/status-playable-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![React](https://img.shields.io/badge/built%20with-React-blue)

**Zombie Arena** is a top-down survival shooter built with **React + Canvas**. Survive endless waves of zombies, loot supplies, and unleash grenades in this retro-style pixel apocalypse.

<p align="center">
  <img src="preview.gif" alt="Zombie Arena Preview" width="600"/>
</p>

---

## 🎯 Objective

Stay alive against ever-increasing waves of zombies. Loot, reload, heal, and explode your way to the highest wave possible.

---

## 🎮 Gameplay Features

- 🔫 **Dual Weapons** — Switch between a fast-firing rifle and a powerful handgun.
- 🧟 **Zombie AI** — Uses A* pathfinding to find you... and eat you.
- 💣 **Explosives** — Grenades with AoE damage and a dramatic explosion animation.
- 💊 **Loot System** — Medkits, ammo, armor, and grenades spawn across the map.
- 📊 **Stats Tracking** — Ammo used, accuracy %, zombies killed, and wave reached.
- ⚙️ **Real-time canvas rendering** — Powered by the HTML5 Canvas API.

---

## 🕹️ Controls

| Key / Mouse      | Action                  |
|------------------|-------------------------|
| `W A S D`        | Move                    |
| `Mouse`          | Aim                     |
| `Click` or `Space` | Shoot                |
| `R`              | Reload                  |
| `Q`              | Switch Weapon           |
| `G`              | Throw Grenade           |
| `E`              | Use Medkit              |

---

## 📸 Screenshots


| In-Game | Game Over |
|--------|-----------|
| ![Gameplay](https://via.placeholder.com/400x250?text=Gameplay+Screenshot) | ![Game Over](https://via.placeholder.com/400x250?text=Game+Over+Screen) |

---

🗃️ Project Structure
```bash
Copy
Edit
src/
├── assets/              # Sprites, maps, explosions, UI
├── components/
│   └── ZombieArena.jsx  # Main game logic
├── utils/
│   └── pathfinding.js   # A* pathfinding
└── App.jsx              # Entry point



