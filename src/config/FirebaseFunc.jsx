import { useEffect, useState } from "react";
import { FirestoreDB, FirebaseAuth } from "./firebase";
import {
  collection,
  query,
  limit,
  startAfter,
  orderBy,
  getDocs,
  where,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// ******** MAIN FUNCTIONS OF FILE ********

// Getting the user
export const useFirebaseUser = () => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = onAuthStateChanged(FirebaseAuth, (userData) => {
      setUser(userData);
      setLoading(false);
    });
    return () => unSub();
  }, []);

  return { user, Loading };
};

//Adding the data to fireStore
export const AddDataToFireStore = async (key, data) => {
  await setDoc(doc(FirestoreDB, key), data);
};

//Get Todo by sno
export const getTodoBySno = async (key) => {
  try {
    const ref = doc(FirestoreDB, key);
    const snap = await getDoc(ref);
    const data = snap.data();
    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

//Signup the user with Email and PAssword
export const SignUpUserWithEmailAndPassword = async (
  userName,
  email,
  password
) => {
  try {
    const cresident = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );

    await updateProfile(cresident.user, {
      displayName: userName,
    });

    await AddDataToFireStore(`users/${cresident.user.uid}`, {
      uid: cresident.user.uid,
      userName: userName,
      email: email,
      password: password,
      Verify: cresident.user.emailVerified,
      theme: "light",
      delete: false,
    });

    await AddDataToFireStore(`blocked/${cresident.user.uid}`, {
      email: email,
      block: false,
    });
    return null;
  } catch (error) {
    return error.message;
  }
};

//Logout To the user
export const LogoutUser = async () => {
  try {
    await signOut(FirebaseAuth);
    return null;
  } catch (error) {
    return error.message;
  }
};

//Login User
export const LoginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(FirebaseAuth, email, password);
    return null;
  } catch (error) {
    return error.message;
  }
};

// Setting the pagination for the todos
export const getPagination = async (
  userId,
  key,
  pageLimit,
  firstDoc,
  search,
  status,
  from,
  to
) => {
  const ref = collection(FirestoreDB, key);

  let qArr = [
    where("uid", "==", userId),
    orderBy("sno", "asc"),
    limit(pageLimit),
  ];

  if (status && status !== "all") {
      qArr.push(where("done", "==", status === "done" ? true : false));
  }
  
  if (from) {
    qArr.push(where("dueDate", ">=", from));
  }

  if (to) {
    qArr.push(where("dueDate", "<=", to));
  }

  if (firstDoc) {
    qArr.push(startAfter(firstDoc));
  }

  let baseQuery = query(ref, ...qArr);

  const snapshot = await getDocs(baseQuery);

  let Todos = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    Todos.push(data);
  });

  if (search) {
    Todos = Todos.filter((todo) =>
      todo.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return Todos;
};

export const HighSno = async (userId) => {
  try {
    const ref = collection(FirestoreDB, "todos");
    const baseQuery = query(
      ref,
      where("uid", "==", userId),
      orderBy("sno", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(baseQuery);
    if (snapshot.empty) {
      return 1;
    }

    let highSno = 1;
    snapshot.forEach((doc) => {
      const data = doc.data();
      highSno = data.sno;
    });
    return highSno + 1;
  } catch (error) {
    console.log(error.message);
  }
};

// Getting the total todos
export const TotalTodosFun = async (uid, key) => {
  try {
    const q = query(collection(FirestoreDB, key), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (e) {
    console.log(e);
  }
};

export const DeleteTodoFunc = async (key) => {
  await deleteDoc(doc(FirestoreDB, key));
};

export const DeleteAccountFunc = async (uid) => {
  try {
    const todosRef = collection(FirestoreDB, "todos");
    const q = query(todosRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => deleteDoc(doc.ref));

    await deleteDoc(doc(FirestoreDB, `blocked/${uid}`));
    await deleteDoc(doc(FirestoreDB, `users/${uid}`));
  } catch (e) {
    console.log(e);
  }
};

export const GetUsersByColl = async (key) => {
  try {
    const q = query(collection(FirestoreDB, key));
    const snapshot = await getDocs(q);
    const data = [];

    snapshot.forEach((doc) => {
      const loopData = doc.data();
      if (loopData.uid === "lNab2SzsY4bw81plNnSnKxrml7o1") return;
      if (loopData.delete) return;

      data.push(loopData);
    });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const blockAndUnBlockUserByAdmin = async (email, action) => {
  try {
    const ref = collection(FirestoreDB, "blocked");
    const q = query(ref, where("email", "==", email));
    const snapshot = await getDocs(q);
    await AddDataToFireStore(`blocked/${snapshot.docs[0].id}`, {
      block: action || false,
      email: email,
    });
  } catch (e) {
    console.log(e);
  }
};

export const checkBlockedUser = async (email) => {
  try {
    const ref = collection(FirestoreDB, "blocked");
    const q = query(ref, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const blockBool = snapshot.docs[0].data().block;
      return blockBool;
    }
  } catch (e) {
    console.log(e);
  }
};

export const DeleteUserByAdminFunc = async (uid) => {
  try {
    console.log(uid);
    const ref = collection(FirestoreDB, "users");
    const q = query(ref, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const data = doc.data();
      AddDataToFireStore(`users/${data.uid}`, { ...data, delete: true });
    });
    return null;
  } catch (e) {
    console.log(e);
  }
};
