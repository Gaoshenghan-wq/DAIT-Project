var express = require('express');
var router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { connectToDB, ObjectId} = require("../utils/db");

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }
    try {
        // 验证token 后续加
        // const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
        const decoded = jwt.decode(token.replace('Bearer ', ''));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

function processImagePath(post) {
    if (post.coverImage && !post.coverImage.startsWith('https')) {
        post.coverImage = `/api/uploads/${post.coverImage}`;
    }
    return post;
} 

/* Display all blog */
router.get('/allPost', async function (req, res) {
    const db = await connectToDB();
    try {
        let results = await db.collection("blogs").find().toArray();
        results = results.map(processImagePath);
        res.status(200).json(results);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

/* Retrieve a single blog */
router.get('/blog/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("blogs").findOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            result = processImagePath(result);
            res.json(result);
        } else {
            res.status(404).json({ message: "post not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

/* delete blog*/
const fs = require('fs');
const path = require('path');

router.delete('/blog/:id', verifyToken, async (req, res) => {
    const db = await connectToDB();
    try {
        const post = await db.collection("blogs").findOne({ 
            _id: new ObjectId(req.params.id),
            "author._id": new ObjectId(req.user._id)
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }
        
        const result = await db.collection("blogs").deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        if (post.coverImage && !post.coverImage.startsWith('http')) {
            const imagePath = path.join(__dirname, '../uploads', post.coverImage);
            
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});

router.get('/myPosts', verifyToken, async (req, res) => {
    const userId = req.user._id;
    const db = await connectToDB();
    try {
        let results = await db.collection("blogs").find({ "author._id": new ObjectId(userId) }).toArray();
        results = results.map(post => {
            if (post.coverImage && !post.coverImage.startsWith('https')) {
                post.coverImage = `/api/uploads/${post.coverImage}`;
            }
            return post;
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } finally {
        await db.client.close();
    }
});


router.post('/newpost', verifyToken, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const user = req.user;
    const image = req.file ? req.file.filename : null;
    console.log(image,user,title,content)
    const db = await connectToDB();
    try {
      const newPost = {
        title,
        content,
        coverImage: image,
        author: {
            _id: new ObjectId(user._id), 
            // _id: user._id,
            username: `${user.first_name} ${user.last_name}`,
            avatar: null,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar
        },
        tags: [],
        viewCount: 0,
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      const result = await db.collection('blogs').insertOne(newPost);
      res.status(201).json({ message: 'Post created successfully'});
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      await db.client.close();
    }
});


module.exports = router;