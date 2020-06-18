const { Router } = require("express");
const News = require("../models/News");
const moment = require("moment");

const router = Router();

router.get("/", async (req, res) => {
  const { postid } = req.query;

  if (postid) {
    try {
      let post = await News.findById(postid) 
      
      if (post) {
        post.views++
        post.save()
      }

      res.render("post", { id: post._id, title: post.title, content: post.content, comments: post.comments.reverse(), date: post.date, category: post.category, views: post.views });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect("/");
  }
});

router.post("/comments", async (req, res) => {
  const { postid } = req.query;
  if (postid) {
    try {
      const newComment = {
        name: req.body.name,
        message: req.body.message,
        date: moment().format("ll"),
      };

      const post = await News.findById(postid);
      post.comments = [...post.comments, newComment];
      await post.save();

      res.redirect("/news?postid=" + postid);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect("/");
  }
});

module.exports = router;
