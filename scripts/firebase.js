// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {getFirestore} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import {getStorage} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2BeGJpEWFkKQ25n_rjzz8GuOUxOWFKEI",
  authDomain: "through-the-lens-f572b.firebaseapp.com",
  projectId: "through-the-lens-f572b",
  storageBucket: "through-the-lens-f572b.appspot.com",
  messagingSenderId: "471908295680",
  appId: "1:471908295680:web:f9ff592fe4ffcee2a224e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
