const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const postsFile = path.join(__dirname, "../posts.json");


router.get("/posts", (req, res) => {
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

        res.render("index", { posts });
    });
});

router.get("/post", (req, res) => {
    const postId = req.query.id;

    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading posts file:", err);
            return res.status(500).send("Error loading posts.");
        }

        let posts = JSON.parse(data);
        let post = posts.find(p => p.id == postId);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.render("post", { post });
    });
});

router.get("/add-post", (req, res) => {
    res.render("add-post");
});

router.post("/add-post", (req, res) => {
    fs.readFile(postsFile, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading posts file:", err);
            return res.status(500).send("Error saving post.");
        }

        let posts = JSON.parse(data || "[]");
        const newPost = {
            id: posts.length + 1,
            title: req.body.title,
            content: req.body.content,
        };

        posts.push(newPost);

        fs.writeFile(postsFile, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error("Error writing posts file:", err);
                return res.status(500).send("Error saving post.");
            }
            res.redirect("/posts"); 
        });
    });
});

module.exports = router;
