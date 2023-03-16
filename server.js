import express from "express";
import { getMembership, getTokens, refreshTokens } from "./fetchers.js";

const app = express();

app.get("/auth", (req, res) =>
  getTokens(req.query.code)
    .then(({ access_token }) => getMembership(access_token))
    .then((data) => res.json(data))
    .catch((err) => res.send(err))
);

app.get("/tokens", (req, res) => {
  const { code, refresh } = req.query;
  const request = code ? getTokens(code) : refreshTokens(refresh);
  request.then((data) => res.json(data)).catch((err) => res.send(err));
});

app.get("/membership", (req, res) => {
  getMembership(req.query.token)
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
