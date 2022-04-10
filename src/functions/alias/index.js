const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore();

exports.alias = async (request, response) => {
  const col = firestore.collection("aliases");
  const res = await col.get();

  const docs = res.docs;

  response.status(200).send("Hello World!", docs?.[0]);
};
