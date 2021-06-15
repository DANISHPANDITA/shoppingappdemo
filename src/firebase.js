import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDhnCXWC4XPJtlbfSbyfDwS8pFVwHTk3e8",
  authDomain: "shoppingapp-96a4d.firebaseapp.com",
  projectId: "shoppingapp-96a4d",
  storageBucket: "shoppingapp-96a4d.appspot.com",
  messagingSenderId: "99487363439",
  appId: "1:99487363439:web:b26ecfa70f206f4a51789a",
  measurementId: "G-4QG9NYLBSF",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const storage = firebaseApp.storage();
export { storage, db, auth, googleAuth };
