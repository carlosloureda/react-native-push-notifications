const express = require("express");
import { saveToken, sendMessage } from "./expo-server";
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

app.use(cors()); //TODO: for production not the best idea
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// Then use it before your routes are set up:

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/token", (req, res) => {
  saveToken(req.body.token.value);
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
});

app.post("/message", (req, res) => {
  sendMessage(req.body.message);
  console.log(`Received message, ${req.body.message}`);
  res.send(`Received message, ${req.body.message}`);
});
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
