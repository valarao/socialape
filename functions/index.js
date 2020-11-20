const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

app.get('/screams', async (request, response) => {
  try {
    const docs = await admin
      .firestore()
      .collection('screams')
      .orderBy('createdAt', 'desc')
      .get();

    const screams = [];
    docs.forEach((doc) => {
      screams.push({
        screamId: doc.id,
        body: doc.data().body,
        userHandle: doc.data().body,
        createdAt: doc.data().createdAt,
      });
    });
    return response.json(screams);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
});

app.post('/scream', async (request, response) => {
  try {
    const newScream = {
      body: request.body.body,
      userHandle: request.body.userHandle,
      createdAt: new Date().toISOString(),
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

exports.api = functions.https.onRequest(app);
