const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "alwar-billing.appspot.com",
  
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };
