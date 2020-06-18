const { Router } = require("express");
const Admin = require("../models/AdminDATA");
const News = require("../models/News");
const moment = require("moment");
const router = Router();
const SecureRouteAA = require("../middlewares/SecureRouteAA");
const adminMiddleware = require("../middlewares/AdminAuth");
const Cookies = require("cookies");

router.get("/auth", SecureRouteAA, (req, res) => {
  res.render("adminAuth", {
    layout: "empty",
  });
});

router.post("/auth", async (req, res) => {
  const cookie = new Cookies(req, res);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.redirect("/admin/auth");
    }

    const candidate = await Admin.findOne({ username }).select(
      "username password"
    );
    const id = candidate._id;
    if (!candidate) {
      return res.redirect("/admin/auth");
    }
    if (password !== candidate.password) {
      return res.redirect("/admin/auth");
    }

    cookie.set("AdminId", id);

    candidate.isAuth = true;
    await candidate.save();

    res.redirect("/admin");
  } catch (e) {
    console.log(e);
  }
});

router.get("/logout", async (req, res) => {
  const cookie = new Cookies(req, res);
  const id = cookie.get("AdminId");

  const usr = await Admin.findOne({ _id: id });

  cookie.set("AdminId", null);

  usr.isAuth = false;
  await usr.save();

  res.redirect("/");
});

router.get("/", adminMiddleware, async (req, res) => {
  try {
    let news = await News.find();
    news = news.map((i) => {
      i.content = i.content.substring(0, 25) + "...";

      return i;
    });

    res.render("admin", {
      layout: "empty",
      news: news.reverse(),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/deletePost", adminMiddleware, async (req, res) => {
  try {
    const postid = req.query.postid;

    if (postid) {
      await News.deleteOne({ _id: postid });

      res.redirect("/admin");
    } else {
      res.redirect("/admin");
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/editPost", async (req, res) => {
  try {
    const postid = req.query.postid;

    if (!postid) {
      res.redirect("/admin");
    }

    const post = await News.findOne({ _id: postid });

    if (!post) {
      res.redirect("/admin");
    }

    const { title, content, category, comments } = post;

    res.render("AdminEditPost", {
      layout: "empty",
      title,
      content,
      category,
      comments,
      postid,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/editPost/removecomment", async (req, res) => {
  try {
    const postid = req.query.postid;
    const commentId = req.query.commentId;

    if (!postid || !commentId) {
      res.redirect(`/admin/editPost?postid=${postid}`);
    }

    const comments = await News.findOne({ _id: postid }).select("comments");

    if (!comments) {
      res.redirect(`/admin/editPost?postid=${postid}`);
    }
    
    comments.comments = comments.comments.filter(comment => comment._id.toString() !== commentId.toString());
    
    await comments.save();

    res.redirect(`/admin/editPost?postid=${postid}`);
  } catch (e) {
    console.log(e);
  }
});

router.post("/editPost", async (req, res) => {
  try {
    const postid = req.query.postid;

    if (!postid) {
      res.redirect("/admin");
    }

    const post = await News.findOne({ _id: postid });

    if (!post) {
      res.redirect("/admin");
    }

    const { title, category, content } = req.body;

    post.title = title;
    post.category = category;
    post.content = content;
    post.img = req.file
      ? req.file.path.split("\\").reduce((a, b) => a + "/" + b)
      : post.img;
    post.date = moment().format("ll");

    await post.save();
    res.redirect("/admin");
  } catch (e) {
    console.log(e);
  }
});

router.post("/addPost", adminMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title.length) {
      return res.redirect("/admin");
    }

    if (!content.length) {
      return res.redirect("/admin");
    }

    if (!req.file) {
      return res.redirect("/admin");
    }

    const post = new News({
      title,
      content,
      img: req.file
        ? req.file.path.split("\\").reduce((a, b) => a + "/" + b)
        : "",
      comments: [],
      date: moment().format("ll"),
      category,
      views: 0,
    });

    await post.save();
    res.redirect("/admin");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
