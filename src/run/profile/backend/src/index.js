const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios").default;

const app = express();
const PORT = process.env.PORT || 8080;

const filePath = path.join(__dirname, "..", "..", "frontend", "index.html");
const html = fs.readFileSync(filePath, "utf-8");

const frontend = { root: "../frontend" };
const FUNCTION_BASE_URL = process.env._FUNCTION_BASE_URL;

app.get("(/|/id/:id)", async (req, res) => {
  if (req.params.id) {
    const someFetchedProfileData = await getProfileData(req.params.id);
    const injectedHtml = html.replace(
      "[]",
      JSON.stringify(someFetchedProfileData)
    );
    return res.send(injectedHtml);
  }

  return res.send(html);
});

app.get("/api/profile/:id", async (req, res) => {
  const data = await getProfileData(req.params.id);
  res.json(data);
});

app.get("/*.(js|png)", (req, res) => {
  res.sendFile(req.url, frontend);
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

async function getProfileData(user) {
  const response = await axios.get(`${FUNCTION_BASE_URL}/result?user=${user}`);
  return response.data;
}
