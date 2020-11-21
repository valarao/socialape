const firebase = require('firebase');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const { admin, db } = require('../util/admin');
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

    const noImg = 'no-img.png';

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
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
    return response.status(500).json({ error: error.code });
  }
};

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
      return response
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    }

    return response.status(500).json({ error: error.code });
  }
};

exports.uploadImage = async (request, response) => {
  try {
    const busboy = new Busboy({ headers: request.headers });

    let imageFilename;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
          throw new Error('Wrong file type submitted');
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFilename = `${Math.round(
          Math.random() * 10000000000000
        )}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
      });

    busboy.on('finish', async () => {
      await admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
            },
          },
        });

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
      await db.doc(`/users/${request.user.handle}`).update({ imageUrl });
    });

    busboy.end(request.rawBody);

    return response
      .status(201)
      .json({ message: 'Image uploaded successfully' });
  } 
  catch (error) {
    console.log(error);
    if (error.message === 'Wrong file type submitted') {
      return response.status(400).json({ error: 'Wrong file type submitted' });
    }

    return response.status(500).json({ error: error.code });
  }
};
