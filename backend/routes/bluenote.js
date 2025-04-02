var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId} = require("../utils/db");

/* Display all blog */
router.get('/allblog', async function (req, res) {
  const db = await connectToDB();
  try {
      let results = await db.collection("posts").find().toArray();
      res.status(200).json(results); // 添加这行返回JSON数据
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
        let result = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
        if (result) {
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
module.exports = router;
