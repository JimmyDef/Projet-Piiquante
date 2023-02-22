const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

app.use(morgan("dev"));

mongoose
  .connect(mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie ! "))
  .catch(() => console.log("Connexion à MongoDb échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/Api/auth", userRoutes);
app.use("/Api/sauces", sauceRoutes);
module.exports = app;
