import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const DOMAIN = "https://patreon.com";
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = process.env;

function tokenRequest(body) {
  return fetch(`${DOMAIN}/api/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      ...body,
    }).toString(),
  });
}

export async function getMembership(token) {
  const url = `${DOMAIN}/api/oauth2/v2/identity?include=memberships&fields[member]=patron_status`;
  const response = await fetch(encodeURI(url), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function getTokens(code) {
  const response = await tokenRequest({
    code: code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URL,
  });
  return response.json();
}

export async function refreshTokens(refreshToken) {
  const response = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return response.json();
}
