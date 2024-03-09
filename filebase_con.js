// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuLT_zo7iywfB6WVIdQLs58BxYDIPoX1o",
  authDomain: "tpms-project-a9677.firebaseapp.com",
  projectId: "tpms-project-a9677",
  storageBucket: "tpms-project-a9677.appspot.com",
  messagingSenderId: "978081755917",
  appId: "1:978081755917:web:943545d4e7ff59276f3644",
  measurementId: "G-DHLZRRH6GC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);