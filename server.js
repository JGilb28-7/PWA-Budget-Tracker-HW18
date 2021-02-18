require('dotenv').config();

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// had to change the local to 3010 
const PORT = process.env.PORT || 3010;
const DB_URL = process.env.DB || "mongodb://localhost/budget";

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});