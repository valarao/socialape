const { request, response } = require('express');
const { db } = require('../util/admin');

exports.getAllScreams = async (request, response) => {
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
};

exports.postOneScream = async (request, response) => {
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
};

// Get one scream
exports.getScream = async (request, response) => {
  try {
    const screamDoc = await db.doc(`/screams/${request.params.screamId}`).get();
    if (!screamDoc.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }
    const screamData = screamDoc.data();
    screamData.screamId = screamDoc.id;

    const commentsDocs = await db
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .where('screamId', '==', request.params.screamId)
      .get();
    screamData.comments = [];
    commentsDocs.forEach((commentDoc) => {
      screamData.comments.push(commentDoc.data());
    });
    return response.status(200).json(screamData);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};

// Comment on a scream
exports.commentOnScream = async (request, response) => {
  try {
    if (request.body.body.trim() === '') {
      return response.status(400).json({ error: 'Must not be empty' });
    }

    const newComment = {
      body: request.body.body,
      createdAt: new Date().toISOString(),
      screamId: request.params.screamId,
      userHandle: request.user.handle,
      userImage: request.user.imageUrl,
    };

    const screamsDoc = await db.doc(`/screams/${request.params.screamId}`).get();
    if (!screamsDoc.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }

    await db.collection('comments').add(newComment);
    response.json(newComment);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};
