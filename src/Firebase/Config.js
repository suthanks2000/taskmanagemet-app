// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvEHg4KPbhXLqAMFkvI-RFaMcCUajYwZE",
  authDomain: "task-management-45b14.firebaseapp.com",
  projectId: "task-management-45b14",
  storageBucket: "task-management-45b14.appspot.com",
  messagingSenderId: "20029324526",
  appId: "1:20029324526:web:5c635114afa2382e1e07ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };