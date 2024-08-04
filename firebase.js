// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU6F6r_3YLHHa0rysuY0-v-3pTKR-i3JE",
  authDomain: "inventory-management-6ba2a.firebaseapp.com",
  projectId: "inventory-management-6ba2a",
  storageBucket: "inventory-management-6ba2a.appspot.com",
  messagingSenderId: "554740754889",
  appId: "1:554740754889:web:e73307884a02659e85e018",
  measurementId: "G-V8D8HSFVRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export{firestore}