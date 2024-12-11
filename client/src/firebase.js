// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-88179.firebaseapp.com",
  projectId: "mern-auth-88179",
  storageBucket: "mern-auth-88179.firebasestorage.app",
  messagingSenderId: "721824675181",
  appId: "1:721824675181:web:e9e17fbe082ee47f33d664"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);