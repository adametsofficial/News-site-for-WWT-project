const { Schema, model } = require("mongoose");

const news = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: String,
  img: String,
  comments: [
    {
      name: {
        type: String,
        required: true,
      },
      date: String,
      message: {
        type: String,
        required: true,
      },
    },
  ],
  category: String,
  views: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = model("News", news);
