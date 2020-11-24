require('dotenv').config();
const functions = require('firebase-functions');
const app = require('express')();

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
} = require('./handlers/screams');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require('./handlers/users');

const auth = require('./util/auth');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', auth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', auth, commentOnScream);

// TODO: Delete scream
// TODO: Like scream
// TODO: Unlike scream

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', auth, uploadImage);
app.post('/user', auth, addUserDetails);
app.get('/user', auth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
