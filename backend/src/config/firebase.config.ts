import admin from 'firebase-admin';
admin.initializeApp({
    credential: admin.credential.cert('firebase-key.json'),
    databaseURL: 'atomchat-demo.firebaseapp.com'
});
console.log('Firebase Admin initialized');
export const db: FirebaseFirestore.Firestore = admin.firestore();
