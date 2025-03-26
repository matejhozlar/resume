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

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.redirect("http://localhost:3000");
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const repeatedPassword = req.body.repeatedPassword;

  if (password !== repeatedPassword) {
    req.flash("error", "Passwords do not match.");
    req.flash("formData", { username, password, repeatedPassword });
    return res.redirect("/register");
  }

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (checkResult.rows.length > 0) {
      req.flash(
        "error",
        "Username is already taken. Please choose another one."
      );
      req.flash("formData", { username, password, repeatedPassword });
      res.redirect("/register");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log(
            `New user has registered: username=${username}, hashedPassword=${hash}`
          );
          const result = await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hash]
          );
          const user = result.rows[0];
          console.log("success");
          res.redirect("/login");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authenticated." });
}

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
    console.log("req.body:", req.body);
    const { newUsername } = req.body;
    const user = req.user;

    const trimmed = newUsername?.trim();

    if (!trimmed) {
      return res.json({ error: "Username cannot be empty." });
    }

    const check = await db.query("SELECT * FROM users WHERE username = $1", [
      trimmed,
    ]);

    if (check.rows.length > 0) {
      return res.json({ error: "Username already taken." });
    }

    await db.query("UPDATE users SET username = $1 WHERE id = $2", [
      trimmed,
      user.id,
    ]);

    req.login({ ...user, username: trimmed }, (err) => {
      if (err) console.error("Session update failed:", err);
    });

    return res.json({ success: "Username has been changed." });
  } catch (err) {
    console.error("Error changing username:", err);
    return res.json({ error: "Something went wrong." });
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
