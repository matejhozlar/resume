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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.get("/login", (req, res) => {
  const message = req.flash("error") || [];
  res.render("login.ejs", { message: message });
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
