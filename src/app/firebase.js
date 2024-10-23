// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB01N7z8eiLkVl94e8PahqDXELRClTb9-0",
    authDomain: "to-do-5eb3c.firebaseapp.com",
    databaseURL: "https://to-do-5eb3c-default-rtdb.firebaseio.com",
    projectId: "to-do-5eb3c",
    storageBucket: "to-do-5eb3c.appspot.com",
    messagingSenderId: "236641769296",
    appId: "1:236641769296:web:00db36ee662b4a29f53e55",
    measurementId: "G-61JVPKH20P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
