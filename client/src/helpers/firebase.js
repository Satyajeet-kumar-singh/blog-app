// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv6hCXS2QiUVZqnrBmwevmVVsO6kxepBk",
  authDomain: "blog-4028d.firebaseapp.com",
  projectId: "blog-4028d",
  storageBucket: "blog-4028d.firebasestorage.app",
  messagingSenderId: "157712408727",
  appId: "1:157712408727:web:7922a01e498a6e008009d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}