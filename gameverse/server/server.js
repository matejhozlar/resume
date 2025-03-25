import express from "express";
import env from "dotenv";
import bodyParser from "body-parser";
import pg from "pg";
import flash from "connect-flash";
import session from "express-session";
import { Strategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";

env.config();
const app = express();
const port = process.env.SERVER_PORT;

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());

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

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/gameverse",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

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
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/gameverse");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
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
