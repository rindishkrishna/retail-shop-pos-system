// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey:"AIzaSyAiE4ItjQ3_QJGx7Ir9vS0ENlvnalBJldE" ,
    authDomain: "pos-billing-568a8.firebaseapp.com" ,
    projectId: "pos-billing-568a8",
    storageBucket:"pos-billing-568a8.appspot.com" ,
    messagingSenderId: "290566780913",
    appId:"1:290566780913:web:e576cecfa781c6f33e7650" ,
    measurementId:"G-N5S35CW0RC"
  }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app)
