require('dotenv').config();
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', async (request, response) => {
  try {
    const docs = await db
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
    return response.status(200).json(screams);
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
    const newDoc = await db.collection('screams').add(newScream);
    return response.status(201).json({
      message: `Document ${newDoc.id} created successfully`,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
});

app.post('/signup', async (request, response) => {
  let token, userId;
  try {
    const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      handle: request.body.handle,
    };

    // Check if handle already is taken
    const user = await db.doc(`/users/${newUser.handle}`).get();
    if (user.exists) {
      return response.status(400).json({
        handle: 'This handle is already taken',
      });
    }

    const createdUserResponse = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    token = await createdUserResponse.user.getIdToken();
    userId = createdUserResponse.user.uid;

    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId,
    };

    db.doc(`/users/${newUser.handle}`).set(userCredentials);
    return response.status(201).json({ token });
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/email-already-in-use') {
      return response.status(400).json({
        error: 'Email is already in use',
      });
    }
    return response.status(500).json({
      error,
    });
  }
});

exports.api = functions.https.onRequest(app);
