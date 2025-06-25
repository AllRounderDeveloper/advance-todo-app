import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3ShnWj1Qm3I-zwzfs9VDDy_fjORgFgjE",
  authDomain: "todo-gmz-redux.firebaseapp.com",
  projectId: "todo-gmz-redux",
  storageBucket: "todo-gmz-redux.firebasestorage.app",
  messagingSenderId: "454758858449",
  appId: "1:454758858449:web:5070ea11953a4fa8f60ff0",
  measurementId: "G-BKZRMEJH5C",
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirestoreDB = getFirestore(FirebaseApp);
export const FirebaseAuth = getAuth(FirebaseApp);
