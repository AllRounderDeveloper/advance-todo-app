import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB56eJayarNa56uUMfvUTcgj4t_6IT5GnQ",
  authDomain: "gmz-todolist.firebaseapp.com",
  databaseURL: "https://gmz-todolist-default-rtdb.firebaseio.com",
  projectId: "gmz-todolist",
  storageBucket: "gmz-todolist.firebasestorage.app",
  messagingSenderId: "898527122877",
  appId: "1:898527122877:web:3ffa7b702034baaf852ed4",
  measurementId: "G-KXNZGFQVMR"
};

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const database = getFirestore(FirebaseApp);