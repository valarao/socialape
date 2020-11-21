require('dotenv').config();
const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');
const auth = require('./util/auth');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', auth, postOneScream);

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', auth, uploadImage);

exports.api = functions.https.onRequest(app);
