const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 8080;

const filePath = path.join(__dirname, '..', '..', 'frontend', 'index.html');
const html = fs.readFileSync(filePath, 'utf-8');

const frontend = { root: '../frontend' };
const FUNCTION_BASE_URL = 'https://europe-west1-laggkep.cloudfunctions.net';

app.get('(/|/id/:id)', async (req, res) => {
  if (req.params.id) {
    const someFetchedProfileData = await getProfileData(req.params.id);

    const injectedHtml = html.replace(
      'undefined',
      escapeHTML(JSON.stringify(someFetchedProfileData))
    );
    return res.send(injectedHtml);
  }

  return res.send(html);
});

app.get('/api/profile/:id', async (req, res) => {
  const user = req.params.id;
  const data = await getProfileData(user);

  res.json({ data });
});

app.delete('/api/deleteAlias', async (req, res) => {
  const { alias, id } = req.body;
  const result = await deleteAlias(alias, id);
  res.json(result);
});

app.get('/*.(js|png)', (req, res) => {
  res.sendFile(req.url, frontend);
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

async function getProfileData(user) {
  const gameResults = getResultData(user);
  const alias = getAliasData(user);
  const prefs = getPrefsData(user);

  const results = await Promise.all([gameResults, alias, prefs]);

  return {
    results: results[0],
    aliases: results[1],
    prefs: results[2],
  };
}
async function getResultData(user) {
  const response = await axios.get(`${FUNCTION_BASE_URL}/result?user=${user}`);
  return response.data;
}

async function getAliasData(user) {
  const response = await axios.get(
    `${FUNCTION_BASE_URL}/alias?aliases=${user}&profile=full`
  );
  return response.data;
}
async function getPrefsData(user) {
  const response = await axios.post(`${FUNCTION_BASE_URL}/d2pos`, {
    aliases: [user],
  });
  return response.data;
}

async function deleteAlias(alias, id) {
  console.log('Deleting ', alias, id);
  const res = await axios.delete(`${FUNCTION_BASE_URL}/alias/`, {
    data: {
      aliases: [alias],
      id: id,
    },
  });
  return res.data;
}

const escapeHTML = (str) =>
  str.replace(
    /[&<>]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
      }[tag])
  );
