// const express = require("express");
import express from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const validURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

//todo: post API calling for generate and store short URL
app.post("/URLshortner", (req, res) => {
  const longURL = req.body.url;
  const customURL = req.body.name;
  const urlCode = customURL ? customURL : nanoid(6);
  const valid = validURL(longURL);

  //* store the urlcode and long url in a file
  const fileRes = fs.readFileSync("URLdata.json");
  const fileData = JSON.parse(fileRes.toString());
  fileData[urlCode] = longURL;
  fs.writeFileSync("URLdata.json", JSON.stringify(fileData));
  // if (valid)
  //   return res.status(400).send({ success: false, Error: "Invalid URL!" });

  res.json({
    success: true,
    message: `http://localhost:5000/${urlCode}`,
  });
});

//todo: get API for  redirect to original URL
app.get("/:url_id", (req, res) => {
  const fileRes = fs.readFileSync("URLdata.json");
  const fileData = JSON.parse(fileRes.toString());

  const longURL = fileData[req.params.url_id];
  res.redirect(longURL);

  res.json({
    suc: "true",
  });
});

app.listen(5000, (req, res) => {
  console.log("server is running at port no. 5000");
});
