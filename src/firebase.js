// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnYw7fqEnpQeMmGEbW2aRSacggDDpLjBM",
  authDomain: "mediconnect-dc8e8.firebaseapp.com",
  projectId: "mediconnect-dc8e8",
  storageBucket: "mediconnect-dc8e8.firebasestorage.app",
  messagingSenderId: "1040551335338",
  appId: "1:1040551335338:web:8364fe78c7563ec1d147d3",
  measurementId: "G-T2CCTT2XMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };