const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

exports.getScreams = functions.https.onRequest(async (request, response) => {
  try {
    const docs = await admin.firestore().collection('screams').get();
    const screams = [];
    docs.forEach((doc) => {
      screams.push(doc);
    });
    return response.json(screams);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
});

exports.createScream = functions.https.onRequest(async (request, response) => {
  try {
    if (request.method !== 'POST') {
      return response.status(400).json({
        error: 'Method not allowed.',
      });
    }

    const newScream = {
      body: request.body.body,
      userHandle: request.body.userHandle,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const newDoc = await admin.firestore().collection('screams').add(newScream);
    return response.json({
      message: `Document ${newDoc.id} created successfully`,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
});
