const admin = require('firebase-admin');

const serviceAccount = require('../project-firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// const uid = 'MbBUnUohhrbvCf4SYcjztdmhiCr1'

// to Generate custom token (but not ID Token)
// admin.auth().createCustomToken(uid)
//   .then((customToken) => {
//     console.log('Custom token:', customToken);
//     // Use this custom token for testing your backend authorization
//   })
//   .catch((error) => {
//     console.error('Error creating custom token:', error);
//   });

module.exports = admin;