const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 

const postsFile = path.join(__dirname, "posts.json"); 

app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.get("/posts", (req, res) => {
    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading posts file:", err);
            return res.status(500).send("Error loading posts.");
        }

        let posts = [];
        try {
            posts = JSON.parse(data); 
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
        }

        res.render("index", { posts }); s
    });
});

app.use("/", blogRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
