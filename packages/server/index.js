const express = require("express");
const { Expo } = require("expo-server-sdk");

var app = express();

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
