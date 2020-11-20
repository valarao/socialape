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

// Retrieve screams
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

const firebaseAuth = async (request, response, next) => {
  try {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
      return response.status(403).json({ error: 'Unauthorized' });
    }
  
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    request.user = decodedToken;
    
    const firebaseUserData = await db.collection('users')
      .where('userId', '==', request.user.uid)
      .limit(1)
      .get();
    
    request.user.handle = firebaseUserData.docs[0].data().handle;
    return next();
  } catch (error) {
      console.error('Error while verifying token ', error);
      return response.status(403).json(error);
  }
}

// Post one scream
app.post('/scream', firebaseAuth, async (request, response) => {
  try {
    const newScream = {
      body: request.body.body,
      userHandle: request.user.handle,
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

const isEmpty = (string) => {
  return string.trim() === '';
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx);
};

// Signup route
app.post('/signup', async (request, response) => {
  let token, userId;
  try {
    const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      handle: request.body.handle,
    };

    const errors = {};

    if (isEmpty(newUser.email)) {
      errors.email = 'Must not be empty';
    } else if (!isEmail(newUser.email)) {
      errors.email = 'Must be a valid email address';
    }

    if (isEmpty(newUser.password)) {
      errors.password = 'Must not be empty';
    }

    if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }

    if (isEmpty(newUser.handle)) {
      errors.handle = 'Must not be empty';
    }

    if (Object.keys(errors).length > 0) {
      return response.status(400).json(errors);
    }

    // Check if handle already is taken
    const user = await db.doc(`/users/${newUser.handle}`).get();
    if (user.exists) {
      return response.status(400).json({
        handle: 'This handle is already taken',
      });
    }

    const firebaseSignupResponse = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    token = await firebaseSignupResponse.user.getIdToken();
    userId = firebaseSignupResponse.user.uid;

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
    return response.status(500).json({error: error.code});
  }
});

app.post('/login', async (request, response) => {
  try {
    const user = {
      email: request.body.email,
      password: request.body.password,
    };

    let errors = {};

    if (isEmpty(user.email)) {
      errors.email = 'Must not be empty';
    }

    if (isEmpty(user.password)) {
      errors.password = 'Must not be empty';
    }

    if (Object.keys(errors).length > 0) {
      return response.status(400).json(errors);
    }

    const firebaseSigninResponse = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);

    const token = await firebaseSigninResponse.user.getIdToken();
    return response.status(201).json({ token });
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/wrong-password') {
      return response.status(403).json({general: 'Wrong credentials, please try again'});
    }
    
    return response.status(500).json({error: error.code});
  }
});

exports.api = functions.https.onRequest(app);
