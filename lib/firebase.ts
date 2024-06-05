// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFl1z4b7IriyUZ3pbokdHSiCkSkhC_UaA",
  authDomain: "bookreports.firebaseapp.com",
  databaseURL: "https://bookreports-default-rtdb.firebaseio.com",
  projectId: "bookreports",
  storageBucket: "bookreports.appspot.com",
  messagingSenderId: "629580624729",
  appId: "1:629580624729:web:2e052e491eb8a579f71248",
  measurementId: "G-19CBE0QTSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
const analytics = getAnalytics(app);