const firebase = require('firebase');
const { db } = require('../util/admin');
const config = require('../util/config');
const { validateSignupData, validateLoginData } = require('../util/validators');

firebase.initializeApp(config);

exports.signup = async (request, response) => {
  let token, userId;
  try {
    const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      handle: request.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) {
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
}

exports.login = async (request, response) => {
  try {
    const user = {
      email: request.body.email,
      password: request.body.password,
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) {
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
}
