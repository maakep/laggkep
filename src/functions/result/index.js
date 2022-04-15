const { Firestore } = require("@google-cloud/firestore");
const axios = require("axios").default;
const firestore = new Firestore();
const collectionRef = firestore.collection("results");

const ALIAS_URL = process.env._ALIAS_URL;

const ROUTES = {
  DELETE: {
    "/": deleteResult,
  },
  POST: {
    "/": saveResults,
  },
  GET: {
    "/": getResultsForUser,
    "/all": getAllResults,
    "/query": getQuery,
  },
};

function extractData(snapshot) {
  const data = [];
  snapshot.forEach((x) => data.push(x.data()));
  return data;
}

// https://firebase.google.com/docs/firestore/query-data/queries
async function getQuery(req) {
  const { args } = req.body;
  const snapshot = await collectionRef.where(args[0], args[1], args[2]).get();
  return extractData(snapshot);
}

async function getResultsForUser(req) {
  const { user } = req.query;
  const id = (await singleAliasToID(user)) || user;

  const snapshot = await collectionRef.where("username", "==", id).get();
  return extractData(snapshot);
}

async function deleteResult(req) {
  const { id } = req.body;
  const doc = collectionRef.doc(id);
  await doc.delete();

  return { status: 200, message: "Very great" };
}

async function getAllResults(req) {
  const snapshot = await collectionRef.get();
  const data = extractData(snapshot);
  return data;
}

async function saveResults(req) {
  const { teams, winner, game, matchId } = req.body;

  const date = new Date().toISOString();
  const resultBatch = [];
  const snapshot = await collectionRef.orderBy("gameId", "desc").limit(1).get();
  const data = extractData(snapshot);
  const gameId = (data[0]?.gameId || 0) + 1;

  for (const team in teams) {
    for (const p in teams[team]) {
      let player = teams[team][p]?.trim();

      if (!player.startsWith("<@")) {
        const id = await singleAliasToID(player);
        player = id || player;
      }

      const gameResult = {
        id: `${gameId}-${team}-${p}`,
        gameId: gameId,
        username: player,
        timestamp: date,
        win: parseInt(team) == winner,
        game: game?.trim() || "",
        matchId: matchId?.trim() || "",
      };
      resultBatch.push(gameResult);
    }
  }

  const batch = firestore.batch();

  resultBatch.forEach((result) => {
    const docRef = collectionRef.doc(result.id);
    batch.set(docRef, result);
  });

  await batch.commit();

  return gameId;
}

async function singleAliasToID(alias) {
  const res = await axios.get(`${ALIAS_URL}?aliases=${alias.toLowerCase()}`);
  return res.data?.[0];
}

exports.result = async (req, response) => {
  console.log(req.method, req.path);
  const result = await ROUTES[req.method][req.path](req);
  response?.status(200).json(result);
};
