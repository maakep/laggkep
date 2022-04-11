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
  },
  GET: {
    "/": getAlias,
    "/query": getQuery,
    "/all": getAliases,
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
  const result = await doc.delete();
  console.log(result);

  return { status: 200, message: "Very great" };
}

async function getAlias(req) {
  const { aliases } = req.body;
  const snapshot = await collectionRef
    .where("aliases", "array-contains-any", aliases)
    .get();
  const data = extractData(snapshot);
  return data;
}

// https://firebase.google.com/docs/firestore/query-data/queries
async function getQuery(req) {
  const { args } = req.body;
  const snapshot = await collectionRef.where(args[0], args[1], args[2]).get();
  const data = extractData(snapshot);
  return data;
}

async function getAliases(req) {
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
  console.log(req.method, req.path);
  const result = await ROUTES[req.method][req.path](req);
  response?.status(200).json(result);
};
