const prod = require("./keys.prod");
const dev = require("./keys.dev");

if (process.env.NODE_ENV === "production") {
  return (module.exports = prod);
} else {
  return (module.exports = dev);
}
