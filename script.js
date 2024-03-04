// const express = require("express");
import express from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";

const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const validURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//todo: post API calling for generate and store short URL
app.post("/URLshortner", (req, res) => {
  const longLink = req.body.longURL;
  const customURL = req.body.customURL;
  const urlCode = customURL ? customURL : nanoid(6);
  const valid = validURL(longLink);

  if (valid) {
    //* store the urlcode and long url in a file
    const fileRes = fs.readFileSync("URLdata.json");
    const fileData = JSON.parse(fileRes.toString());
    fileData[urlCode] = longLink;
    fs.writeFileSync("URLdata.json", JSON.stringify(fileData));
    res.json({
      success: true,
      message: `http://localhost:5000/${urlCode}`,
    });
  } else {
    return res.status(400).send({ success: false, Error: "Invalid URL!" });
  }
});

//todo: get API for  redirect to original URL
app.get("/:url_id", (req, res) => {
  const fileRes = fs.readFileSync("URLdata.json");
  const fileData = JSON.parse(fileRes.toString());

  const longURL = fileData[req.params.url_id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

app.listen(5000, (req, res) => {
  console.log("server is running at port no. 5000");
});
