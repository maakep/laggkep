const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();
const collectionRef = firestore.collection("aliases");

const ROUTES = {
  DELETE: {
    "/": deleteAliases,
    "/id": deleteId,
  },
  POST: {
    "/": setAliases,
    "/query": getQuery,
  },
  GET: {
    "/": getAliases,
    "/all": getAllAliases,
  },
};

function extractData(snapshot) {
  const data = [];
  snapshot.forEach((x) => data.push(x.data()));
  return data;
}

async function deleteId(req) {
  const { id } = req.body;
  const doc = collectionRef.doc(id);
  await doc.delete();

  return { status: 200, message: "Very great" };
}

async function getAliases(req) {
  const { aliases, profile } = req.query;
  const aliasArray = aliases.split(",");
  const snapshot = await collectionRef
    .where("aliases", "array-contains-any", aliasArray)
    .get();
  const data = extractData(snapshot);

  if (profile == "full") {
    return data;
  } else if (profile == "partial") {
    return aliasArray.map((x) => ({
      alias: x,
      id: data.find((y) => y.aliases.includes(x))?.id,
    }));
  }

  return aliasArray.map((x) => data.find((y) => y.aliases.includes(x))?.id);
}

// https://firebase.google.com/docs/firestore/query-data/queries
async function getQuery(req) {
  const { args } = req.body;
  let query = collectionRef;

  args.forEach((x) => {
    query = query.where(x[0], x[1], x[2]);
  });

  const snapshot = await query.get();
  return extractData(snapshot);
}

async function getAllAliases(req) {
  const snapshot = await collectionRef.get();
  const data = extractData(snapshot);
  return data;
}

async function setAliases(req) {
  const { id, aliases } = req.body;

  const docRef = collectionRef.doc(id);
  const doc = await docRef.get();

  if (doc.exists) {
    const existingAliases = doc.data().aliases;
    await docRef.update({
      id: id,
      aliases: [...new Set([...existingAliases, ...aliases])],
    });
  } else {
    await docRef.set({
      id: id,
      aliases: aliases,
    });
  }

  return { status: 200, message: "Very great" };
}

async function deleteAliases(req) {
  const { id, aliases } = req.body;
  const docRef = collectionRef.doc(id);
  const doc = await docRef.get();

  if (doc.exists) {
    const existingAliases = doc.data().aliases;
    await docRef.update({
      id: id,
      aliases: [...existingAliases].filter((x) => !aliases.includes(x)),
    });
  }
}

exports.alias = async (req, response) => {
  try {
    const result = await ROUTES[req.method][req.path](req);
    response?.status(200).json(result);
  } catch (e) {
    console.error(new Error(e));
    response?.status(500).json(e);
  }
};
