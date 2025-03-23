import bodyParser from "body-parser";
import env from "dotenv";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
env.config();

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

app.post("/api/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE username = $1",[username]);

        if(checkResult.rows.length > 0){
            res.send("Username taken.");
        } else {
            const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
            console.log(result);
            res.send("Success!");
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});