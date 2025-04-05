import express from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import pg from "pg";
import flash from "connect-flash";
import session from "express-session";
import { Strategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

env.config();
const app = express();
const port = process.env.SERVER_PORT;
const saltRounds = 10;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/avatars", express.static("public/avatars"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/login", (req, res) => {
  const message = req.flash("error") || [];
  res.render("login.ejs", { message: message });
});

app.get("/register", (req, res) => {
  const error = req.flash("error");
  const formData = req.flash("formData")[0] || {};
  res.render("register.ejs", { message: error, formData: formData });
});

app.get("/ZombieArenaLeaderboard", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const leaderboardQuery = `
      SELECT 
        u.username,
        t.name AS title,
        z.wave, 
        z.zombies_killed, 
        z.ammo_used, 
        z.accuracy, 
        z.updated_at
      FROM zombie_arena z
      JOIN users u ON z.user_id = u.id
      LEFT JOIN user_titles ut ON ut.user_id = u.id AND ut.equipped = true
      LEFT JOIN titles t ON ut.title_id = t.id
      ORDER BY z.zombies_killed DESC, z.wave DESC
      LIMIT $1
    `;

    const result = await db.query(leaderboardQuery, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
});

app.post("/register", async (req, res, next) => {
  const { username, password, repeatedPassword } = req.body;

  if (password !== repeatedPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hash]
    );

    const userId = result.rows[0].id;

    await db.query(`INSERT INTO user_profiles (user_id) VALUES ($1)`, [userId]);

    const titleInsert = await db.query(
      `INSERT INTO titles (name, description, unlock_type, unlock_value)
       VALUES ('Newbie', 'Default starter title', 'level', 0)
       ON CONFLICT (name) DO NOTHING`
    );

    const titleRes = await db.query(
      `SELECT id FROM titles WHERE name = 'Newbie'`
    );
    const titleId = titleRes.rows[0].id;

    await db.query(
      `INSERT INTO user_titles (user_id, title_id, equipped)
       VALUES ($1, $2, true)
       ON CONFLICT DO NOTHING`,
      [userId, titleId]
    );

    req.logIn(result.rows[0], (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        user: { id: userId, username: result.rows[0].username },
      });
    });
  } catch (err) {
    console.error("Registration error:", err.stack || err);
    return res.status(500).json({ error: "Server error." });
  }
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authenticated." });
}

app.post("/gameverse/delete-account", ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    await db.query("DELETE FROM zombie_arena WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    req.logout(() => {
      req.session.destroy();
      return res.json({ success: "Account deleted successfully." });
    });
  } catch (err) {
    console.error("Error deleting account:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/gameverse/verify-password", ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error verifying password:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/gameverse/change-password", ensureLoggedIn, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.json({ error: "Passwords do not match." });
    }

    const user = req.user;
    const storedHashedPassword = user.password;

    const isValid = await bcrypt.compare(oldPassword, storedHashedPassword);
    if (!isValid) {
      return res.json({ error: "Your old password is incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      newHashedPassword,
      user.id,
    ]);

    return res.json({ success: "Password has been changed." });
  } catch (err) {
    console.error("Error changing password:", err.stack || err);
    console.log("req.user:", req.user);
    return res.json({ error: "Something went wrong." });
  }
});

app.post("/gameverse/change-username", ensureLoggedIn, async (req, res) => {
  try {
    const { newUsername } = req.body;
    const userId = req.user.id;

    if (!newUsername || newUsername.trim() === "") {
      return res.json({ error: "Username cannot be empty." });
    }

    const existingUser = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [newUsername]
    );
    if (existingUser.rows.length > 0) {
      return res.json({ error: "This username is already taken." });
    }

    const result = await db.query(
      "SELECT last_username_change FROM users WHERE id = $1",
      [userId]
    );
    const lastChange = result.rows[0].last_username_change;

    if (lastChange) {
      const now = new Date();
      const diffMs = now - new Date(lastChange);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < 7) {
        const daysLeft = Math.ceil(7 - diffDays);
        return res.json({
          error: `You can change your username again in ${daysLeft} day(s).`,
        });
      }
    }

    await db.query(
      "UPDATE users SET username = $1, last_username_change = NOW() WHERE id = $2",
      [newUsername, userId]
    );

    req.user.username = newUsername;
    console.log("Username succesfully changed for user:", req.user);
    return res.json({ success: "Username updated successfully." });
  } catch (err) {
    console.error("Error changing username:", err);
    return res.json({ error: "Something went wrong." });
  }
});

// ZombieArena Best Score
app.post("/ZombieArenaScore", ensureLoggedIn, async (req, res) => {
  try {
    const { wave, zombiesKilled, ammoUsed, accuracy } = req.body;
    const userId = req.user.id;

    const query = `INSERT INTO zombie_arena (user_id, wave, zombies_killed, ammo_used, accuracy) 
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id)
    DO UPDATE
      SET wave = EXCLUDED.wave,
      zombies_killed = EXCLUDED.zombies_killed,
      ammo_used = EXCLUDED.ammo_used,
      accuracy = EXCLUDED.accuracy,
      updated_at = NOW()
      WHERE zombie_arena.zombies_killed < EXCLUDED.zombies_killed`;
    const values = [userId, wave, zombiesKilled, ammoUsed, accuracy];

    await db.query(query, values);

    return res.json({
      success: true,
      message: "Best score updated if higher.",
    });
  } catch (error) {
    console.error("Error updating best score:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//save character image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/avatars";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}.png`);
  },
});

const upload = multer({ storage });

app.post(
  "/save-character-image",
  ensureLoggedIn,
  upload.single("avatar"),
  (req, res) => {
    res.json({ success: true, message: "Image uploaded!" });
  }
);

app.post(
  "/save-character-image",
  ensureLoggedIn,
  upload.single("avatar"),
  (req, res) => {
    res.json({ success: true, message: "Image uploaded!" });
  }
);
//player profile
app.get("/api/user-profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const profileQuery = `
      SELECT 
        u.username, 
        up.level, 
        up.xp, 
        up.bio,
        up.selected_title,
        (
          SELECT json_agg(t.name)
          FROM user_titles ut
          JOIN titles t ON t.id = ut.title_id
          WHERE ut.user_id = $1
        ) AS titles_unlocked
      FROM users u
      JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `;

    const result = await db.query(profileQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const row = result.rows[0];

    return res.json({
      username: row.username,
      level: row.level,
      xp: row.xp,
      bio: row.bio,
      title: row.selected_title || "Newbie",
      titlesUnlocked: row.titles_unlocked || [],
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

app.post("/add-xp", ensureLoggedIn, async (req, res) => {
  const { xp } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT xp, level FROM user_profiles WHERE user_id = $1",
      [userId]
    );
    let { xp: currentXp, level } = result.rows[0];

    function xpForNextLevel(level) {
      const base = 1000;
      const linearGrowth = 200 * level;
      const scaling = Math.floor(1000 * Math.pow(1.05, level));
      return base + linearGrowth + scaling;
    }

    currentXp += xp;

    let xpNeeded = xpForNextLevel(level);

    while (currentXp >= xpNeeded) {
      currentXp -= xpNeeded;
      level += 1;
      xpNeeded = xpForNextLevel(level);
    }

    await db.query(
      "UPDATE user_profiles SET xp = $1, level = $2, updated_at = NOW() WHERE user_id = $3",
      [currentXp, level, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding XP:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//setting up bio
app.put("/api/user-profile/bio", ensureLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { bio } = req.body;

  if (!bio || bio.length > 1000) {
    return res
      .status(400)
      .json({ error: "Bio must be 1000 characters or less." });
  }

  try {
    await db.query(
      "UPDATE user_profiles SET bio = $1, updated_at = NOW() WHERE user_id = $2",
      [bio, userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update bio." });
  }
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              console.log(
                `User logged in: username=${username}, hashedPassword=${user.password}`
              );
              return cb(null, user);
            } else {
              return cb(null, false, {
                message:
                  "Your username and password combination is incorrect. Please try again.",
              });
            }
          }
        });
      } else {
        return cb(null, false, {
          message:
            "Your username and password combination is incorrect. Please try again.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
