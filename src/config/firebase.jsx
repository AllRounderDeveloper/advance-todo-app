import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZbRFLvfifSLOwZ2HZMg-tFtajLnAQwbU",
  authDomain: "gmz-redux-todo.firebaseapp.com",
  projectId: "gmz-redux-todo",
  storageBucket: "gmz-redux-todo.firebasestorage.app",
  messagingSenderId: "269484963764",
  appId: "1:269484963764:web:c98edb6f4fa81dbc29a4e1"
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirestoreDB = getFirestore(FirebaseApp);
export const FirebaseAuth = getAuth(FirebaseApp);
