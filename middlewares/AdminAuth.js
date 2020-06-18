const Admin = require("../models/AdminDATA");
const Cookies = require("cookies");

module.exports = async (req, res, next) => {
  const cookie = new Cookies(req, res);
  const id = cookie.get("AdminId");

  if (!id) {
    return res.redirect("/admin/auth");
  }

  const cnd = await Admin.findOne({ _id: id })
    .select("isAuth")
    .catch(() => res.redirect("/admin/auth"));

  if (!cnd) {
    return res.redirect("/admin/auth");
  }

  if (!cnd.isAuth) {
    return res.redirect("/admin/auth");
  }

  next();
};
