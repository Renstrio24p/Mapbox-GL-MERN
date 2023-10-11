const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 8800; // Use PORT from environment or 8800 as default
const userRoute = require("./routes/users");
const pinsRoute = require("./routes/pins");

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB has been connected.");
}).catch((err) => {
  console.error("MongoDB is not successful \n\n" + err);
});

app.use("/api/users", userRoute);
app.use("/api/pins", pinsRoute);

app.listen(port, () => {
  console.log("Server listening on port: " + port);
});
