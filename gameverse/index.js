import bodyParser from "body-parser";
import env from "dotenv";
import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import flash from "connect-flash";


const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    const error = req.flash("error");
    const formData = req.flash("formData")[0] || {};
    res.render("register.ejs", { message: error, formData: formData});
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if(err) {
            return next(err);
        }
        res.redirect("/login");
    });
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("index.ejs");
    } else {
        res.redirect("/login");
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/secrets",
        failureRedirect: "/login",
    })
);

app.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const repeatedPassword = req.body.repeatedPassword;

    if(password !== repeatedPassword) {
        req.flash("error", "Passwords do not match.");
        req.flash("formData", {username, password, repeatedPassword});
        return res.redirect("/register");
    }

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username]);

        if(checkResult.rows.length > 0) {
            req.flash("error", "Username is already taken. Please choose another one.");
            req.flash("formData", {username, password, repeatedPassword});
            res.redirect("/register");
        } else {
            bcrypt.hash(password, saltRounds, async (err,hash) => {
                if(err){
                    console.error("Error hashing password:", err);
                } else {
                    const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username,hash]);
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log("success");
                        res.redirect("/secrets");
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
            const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

            if(result.rows.length > 0){
                const user = result.rows[0];
                const storedHashedPassword = user.password;
                bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                    } else {
                        if(valid) {
                            return cb(null, user);
                        } else {
                            return cb(null, false);
                        }
                    }
                });
            } else {
                cb("User not found");
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