import firebase from 'firebase'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZzny7Iwqp2SFSYVP6CEmomsrp1Q4m1iE",
    authDomain: "interviewme-296210.firebaseapp.com",
    projectId: "interviewme-296210",
    storageBucket: "interviewme-296210.appspot.com",
    messagingSenderId: "280703812387",
    appId: "1:280703812387:web:7246b3fea4f0cb96ca4296",
    measurementId: "G-WCRM8HGMJT"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export default db;