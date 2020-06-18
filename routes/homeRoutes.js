const { Router } = require("express");
const News = require("../models/News");
const moment = require("moment");
const router = Router();

router.get("/", async (req, res) => {
  try {
    let news = await News.find().select("_id title img comments date category");

    news = news
      .map((i) => {
        const t = i.title;

        if (t.length > 40) {
          i.title = i.title.substring(0, 30) + "...";
          return i;
        }

        return i;
      })
      .reverse();

    res.render("index", {
      title: "News | WWT",
      isHome: true,
      news: [...news],
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

module.exports = router;
