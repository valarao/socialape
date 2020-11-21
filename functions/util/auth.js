const { admin, db } = require ('./admin');

module.exports = async (request, response, next) => {
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