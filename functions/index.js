require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const { db } = require('./util/admin');

const app = express();

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require('./handlers/screams');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require('./handlers/users');

const auth = require('./util/auth');

app.use(cors({ origin: true }));

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', auth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', auth, commentOnScream);
app.get('/scream/:screamId/like', auth, likeScream);
app.get('/scream/:screamId/unlike', auth, unlikeScream);
app.delete('/scream/:screamId', auth, deleteScream);

// User routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', auth, uploadImage);
app.post('/user', auth, addUserDetails);
app.get('/user', auth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', auth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(async (snapshot) => {
    try {
      const screamDoc = await db
        .doc(`/screams/${snapshot.data().screamId}`)
        .get();

      if (!screamDoc.exists) {
        throw new Error('Scream document not found');
      }

      db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: screamDoc.data().userHandle,
        sender: snapshot.data().userHandle,
        type: 'like',
        read: false,
        screamId: screamDoc.id,
      });
    } catch (error) {
      console.log(error);
    }
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(async (snapshot) => {
    try {
      await db.doc(`/notifications/${snapshot.id}`).delete();
    } catch (error) {
      console.log(error);
    }
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(async (snapshot) => {
    try {
      const screamDoc = await db
        .doc(`/screams/${snapshot.data().screamId}`)
        .get();

      if (!screamDoc.exists) {
        throw new Error('Scream document not found');
      }

      db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        recipient: screamDoc.data().userHandle,
        sender: snapshot.data().userHandle,
        type: 'comment',
        read: false,
        screamId: screamDoc.id,
      });
    } catch (error) {
      console.log(error);
    }
  });
