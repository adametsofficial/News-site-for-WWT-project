const { Schema, model } = require("mongoose");

const Admin = new Schema({
  username: String,
  password: String,
  isAuth: {
    type: Boolean,
    default: false
  }
})


module.exports = model("Admin", Admin);