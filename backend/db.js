const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/cupid", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongo error", err);
});

module.exports = mongoose;
