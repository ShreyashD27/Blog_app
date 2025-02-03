const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Define Mongoose Schema
const PostSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
});

const Post = mongoose.model("Post", PostSchema);

// Multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
app.post("/api/posts", upload.single("image"), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            image: req.file ? `/uploads/${req.file.filename}` : "",
            description: req.body.description,
        });

        await newPost.save();
        res.json({ message: "Post added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update a post
app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
    try {
        const updatedData = {
            title: req.body.title,
            description: req.body.description,
        };
        
        // If a new image is uploaded, update the image field
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post
app.delete("/api/posts/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
