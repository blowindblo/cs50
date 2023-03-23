const express = require("express");
const router = express.Router();
require("dotenv").config();

const client_id = process.env.client_id;
// const client_secret = process.env.client_secret;
const redirect_uri = "http://localhost:8080/callback/";
const fetch = require("node-fetch");
const queryString = require("querystring");
const crypto = require("crypto");
const { access } = require("fs");

// PKCE implementation
const base64Encode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};
const code_verifier = base64Encode(crypto.randomBytes(32));
const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};
const code_challenge = base64Encode(sha256(code_verifier));

var refresh_token = null;

router.get("/login", (req, res) => {
  var state = crypto.randomBytes(16).toString("hex");
  var scope = [
    "streaming",
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-playback-position",
    "user-top-read",
  ].join(" ");
  req.headers["Access-Control-Allow-Origin"] = "*";
  // req.headers['Access-Control-Allow-Credentials'] = 'true';
  // req.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  // req.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept';

  // Request authorization from user to access data
  // Redirects to "/callback"
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        code_challenge_method: "S256",
        code_challenge: code_challenge,
        client_id: client_id,
        redirect_uri: redirect_uri,
        state: state,
        scope: scope,
      })
  );
  // res.send(code_verifier);
});

router.get("/callback", (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.json({ message: "fail" });

    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    let formData = new URLSearchParams();
    formData.append("code", code);
    formData.append("redirect_uri", redirect_uri);
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", client_id);
    formData.append("code_verifier", code_verifier);
    formData.append("Access-Control-Allow-Origin", "*");
    formData.append("Access-Control-Allow-Credentials", "true");

    // Request access and refresh token
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        access_token = data.access_token;
        refresh_token = data.refresh_token;
        res.cookie("SPOTIFY_ACCESS_TOKEN", data.access_token);
        res.cookie("SPOTIFY_REFRESH_TOKEN", data.refresh_token);
        // res.cookie('SPOTIFY_REFRESH_CODE', code)

        console.log(data);

        // Redirect back to frontend
        // Add tokens in headers so they can be extracted later
        res.redirect(
          "http://localhost:3000/#" +
            queryString.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      })
      .catch((err) => console.log(err));
  }
});

// Request a refreshed Access Token
router.get("/refresh_token", function (req, res) {
  let formData = new URLSearchParams();
  formData.append("grant_type", "refresh_token");
  formData.append("client_id", client_id);
  formData.append("refresh_token", refresh_token);

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: formData.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      access_token = data.access_token;
      refresh_token = data.refresh_token;
      console.log(data.access_token);

      // Redirect back to frontend
      // Add tokens in headers so they can be extracted later
      res.redirect(
        "http://localhost:3000/#" +
          queryString.stringify({
            refresh: "true",
            access_token: access_token,
            refresh_token: refresh_token
          })
      );
    });
});

module.exports = router;
