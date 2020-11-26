const { request, response } = require('express');
const { db } = require('../util/admin');

exports.getAllScreams = async (_request, response) => {
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
      userImage: request.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    };

    const newScreamDoc = await db.collection('screams').add(newScream);
    newScream.screamId = newScreamDoc.id;

    return response.status(201).json(newScream);
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
    console.log(`Body: ${request.body}`);
    console.log(`Body body: ${request.body.body}`);
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

    const screamsDoc = await db
      .doc(`/screams/${request.params.screamId}`)
      .get();
    if (!screamsDoc.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }

    await screamsDoc.ref.update({ commentCount: screamsDoc.data().commentCount + 1 });
    await db.collection('comments').add(newComment);

    return response.json(newComment);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};

// Like a scream
exports.likeScream = async (request, response) => {
  try {
    const screamDoc = db.doc(`/screams/${request.params.screamId}`);
    const fetchedScream = await screamDoc.get();

    const likeDoc = await db
      .collection('likes')
      .where('userHandle', '==', request.user.handle)
      .where('screamId', '==', request.params.screamId)
      .limit(1)
      .get();
  
  
    if (!fetchedScream.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }
  
    if (!likeDoc.empty) {
      return response.status(400).json({ error: 'Scream already liked' });
    }
  
    const screamData = fetchedScream.data();
    screamData.screamId = fetchedScream.id;
  
    await db.collection('likes').add({
      screamId: request.params.screamId,
      userHandle: request.user.handle,
    });
  
    screamData.likeCount++;
    await screamDoc.update({ likeCount: screamData.likeCount });
  
    return response.status(200).json(screamData);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};

// Unlike a scream
exports.unlikeScream = async (request, response) => {
  try {
    const screamDoc = db.doc(`/screams/${request.params.screamId}`);
    const fetchedScream = await screamDoc.get();

    const likeDoc = await db
      .collection('likes')
      .where('userHandle', '==', request.user.handle)
      .where('screamId', '==', request.params.screamId)
      .limit(1)
      .get();
  
  
    if (!fetchedScream.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }
  
    if (likeDoc.empty) {
      return response.status(400).json({ error: 'Scream not liked' });
    }
  
    const screamData = fetchedScream.data();
    screamData.screamId = fetchedScream.id;
  
    await db.doc(`/likes/${likeDoc.docs[0].id}`).delete();
  
    screamData.likeCount--;
    await screamDoc.update({ likeCount: screamData.likeCount });
  
    return response.status(200).json(screamData);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};

// Delete a scream
exports.deleteScream = async (request, response) => {
  try {
    const screamDoc = db.doc(`screams/${request.params.screamId}`);
    const fetchedScream = await screamDoc.get();

    if(!fetchedScream.exists) {
      return response.status(404).json({ error: 'Scream not found' });
    }

    if (fetchedScream.data().userHandle !== request.user.handle) {
      return response.status(403).json({ error: 'Unauthorized' });
    }

    await screamDoc.delete()
    return response.status(202).json({ message: 'Scream deleted successfully'});
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error,
    });
  }
};
