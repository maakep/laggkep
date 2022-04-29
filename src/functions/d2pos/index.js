const { Firestore } = require("@google-cloud/firestore");

const axios = require("axios").default;
const firestore = new Firestore();
const collectionRef = firestore.collection("d2pos");

const ALIAS_URL = process.env._FUNCTION_BASE_URL + "/alias";

const ROUTES = {
  DELETE: {},
  POST: { "/": getPreferences },
  GET: { "/": getAll },
  PUT: { "/": savePreference },
};

async function savePreference(req) {
  const { preference, id } = req.body;

  if (
    preference?.length > 6 ||
    isNaN(id) ||
    !preference.every((x) => ["1", "2", "3", "4", "5", "fill"].includes(x))
  )
    return "bad";

  const doc = collectionRef.doc(id);
  await doc.set({
    id: cleanId(id),
    preference: preference,
  });

  return "ait";
}

async function getPreferences(req) {
  const aliases = req.body.aliases.map((x) => cleanId(x.toLowerCase()));

  const res = await axios.get(
    `${ALIAS_URL}?aliases=${aliases.join(",")}&profile=partial`
  );

  // try use alias if there was no id on the person
  const combined = [...res.data].map((x) => x.id || x.alias);

  const prefsSnapshot = await collectionRef.where("id", "in", combined).get();
  const data = extractData(prefsSnapshot);

  return aliases.map((x) => {
    const id = isDiscordId(x) ? x : res.data.find((z) => z.alias == x)?.id;
    const pref = data.find((y) => y.id == id);

    return {
      id: isDiscordId(x) ? x : id,
      preference: pref?.preference || ["fill"],
      alias: isDiscordId(x) ? `<@${x}>` : x,
    };
  });
}

function isDiscordId(maybeId) {
  return maybeId.startsWith("<@") || (!isNaN(maybeId) && maybeId.length >= 17);
}

function cleanId(id) {
  return id.replace(/<@!?/, "").replace(">", "");
}

async function getAll() {
  const snapshot = await collectionRef.get();
  return extractData(snapshot);
}

function extractData(snapshot) {
  const data = [];
  snapshot.forEach((x) => data.push(x.data()));
  return data;
}

exports.d2pos = async (req, response) => {
  try {
    const result = await ROUTES[req.method][req.path](req);
    response?.status(200).json(result);
  } catch (e) {
    console.error(new Error(e));
    response?.status(500).json(e);
  }
};
