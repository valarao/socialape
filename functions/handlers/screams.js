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
