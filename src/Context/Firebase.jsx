//IMPORTATIONS
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {
  setDoc,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  onSnapshot,
} from "firebase/firestore";
import { FirebaseAuth, database } from "../config/Firebase";

// CREATING VARIABLES

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

// MAKING THE PROVIDER

export const FirebaseProvider = (props) => {
  // some useStates
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [TotalTodos, setTotalTodos] = useState(0);
  const [error, seterror] = useState("");
  const [Sno, setSno] = useState(0);

  //Checking if there is the user
  const getAuthStateChange = useCallback(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getAuthStateChange();
  }, [getAuthStateChange]);

  // Getting the data by the document
  const getDataByDoc = async (key) => {
    try {
      const docSnap = await getDoc(doc(database, key));

      if (docSnap.exists()) {
        return docSnap;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  };

  //Getting the data from the collection with query

  const getDataByCollforUser = async (key) => {
    try {
      const colRef = collection(database, key);
      const q = query(colRef, orderBy("uid", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    }
  };
  const getDataByCollforTodo = async (key, uid) => {
    // return await getDocs(collection(database, key))
    try {
      const colRef = collection(database, key);
      const q = query(colRef, where("uid", "==", uid), orderBy("uid", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    }
  };

  // some cruds
  const deleteData = async (key) => {
    return await deleteDoc(doc(database, key));
  };

  const addData = async (key, data) => {
    return setDoc(doc(database, key), data);
  };

  // signups
  const SignUpUserWithEmailAndPassword = async (email, password, userName) => {
    const userCredential = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const nowuser = userCredential.user;

    await addData(`users/${nowuser.uid}`, {
      userName: userName,
      email: email,
      type: "section",
      uid: nowuser.uid,
      verify: nowuser.emailVerified,
      delete: false,
      password: password,
    });

    await addData(`blocked/${nowuser.uid}`, {
      email: email,
      block: false,
    });

    await updateProfile(nowuser, {
      displayName: userName,
    });
  };

  const SignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(FirebaseAuth, provider).then(() => {
        addData(`users/${user.uid}`, {
          userName: user.displayName,
          email: user.email,
          type: "section",
          uid: user.uid,
          verify: user.emailVerified,
          delete: false,
          password: user.password,
        });

        addData(`blocked/${user.uid}`, {
          email: user.email,
          block: false,
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const SignInWithEmailAndPassword = async (email, password) => {
    signInWithEmailAndPassword(FirebaseAuth, email, password)
      .then(() => seterror(""))
      .catch((e) => {
        console.log(e.message);
        seterror(e.message);
      });
  };

  //Adding pagination to the app
  const getPagination = useCallback(
    async (userId, key, pageLimit, fisrtDoc) => {
      try {
        const ref = collection(database, key);
        let baseQuery = query(
          ref,
          where("uid", "==", userId),
          orderBy("sno", "asc"),
          limit(pageLimit),
          startAfter(fisrtDoc)
        );

        const snapshot = await getDocs(baseQuery);

        const Todos = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          Todos.push(data);
        });

        return Todos;
      } catch (e) {
        console.log(e);
      }
    },
    []
  );

  // Getting the total todos
  const TotalTodosFun = useCallback(
    async (uid, key) => {
      if (user) {
        const q = query(collection(database, key), where("uid", "==", uid));

        // let TotalTodos;
        const unSub = onSnapshot(q, (querySnapshot) => {
          const count = querySnapshot.size;
          setTotalTodos(count);
        });

        return () => unSub();
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      TotalTodosFun(user.uid, "todo");
    }
  }, [TotalTodosFun, user]);

  // Getting the highest sno
  const getHighSno = useCallback(
    async (key, uid) => {
      if (user) {
        const ref = collection(database, key);
        const baseQuery = query(
          ref,
          where("uid", "==", uid),
          orderBy("sno", "desc"),
          limit(1)
        );

        let sno;

        const snapshot = await getDocs(baseQuery);

        if (snapshot.empty) {
          sno = 0;
        } else {
          snapshot.forEach((doc) => {
            const data = doc.data();
            sno = data.sno;
          });
        }

        setSno(sno + 1);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      getHighSno("todo", user.uid);
    }
  }, [getHighSno, user]);

  // Handling the search query
  const handleSearch = async (searchQuery, uid, key, lastTodoArr) => {
    try {
      if (searchQuery) {
        if (searchQuery === "nosearch" || !searchQuery) {
          return lastTodoArr;
        }

        const ref = collection(database, key);

        const baseQuery = query(ref, where("uid", "==", uid));

        const titleQuery = query(
          baseQuery,
          where("lowerTitle", ">=", searchQuery.toLowerCase()),
          where("lowerTitle", "<=", searchQuery.toLowerCase() + "\uf8ff")
        );

        const titleSnap = await getDocs(titleQuery);
        const Todos = [];

        titleSnap.forEach((doc) => {
          Todos.push(doc.data());
        });

        return Todos;
      } else {
        return lastTodoArr;
      }
    } catch (e) {
      console.log(e);
      return lastTodoArr;
    }
  };

  //Handling the status filter
  const handleDone = async (uid, key, filterType, lastTodoArr) => {
    try {
      const ref = collection(database, key);
      let baseQuery = query(ref, where("uid", "==", uid));

      if (filterType === "all") {
        return lastTodoArr;
      } else if (filterType === "done") {
        baseQuery = query(baseQuery, where("done", "==", true));
      } else if (filterType === "notDone") {
        baseQuery = query(baseQuery, where("done", "==", false));
      }

      const Todos = [];
      const snap = await getDocs(baseQuery);
      snap.forEach((doc) => {
        Todos.push(doc.data());
      });

      return Todos;
    } catch (e) {
      console.error(e);
      return lastTodoArr;
    }
  };

  //Handling the date filter
  const handleDate = async (uid, key, to, from, lastTodoArr) => {
    try {
      const ref = collection(database, key);

      if (to === "" || from === "") {
        return lastTodoArr;
      }

      const baseQuery = query(
        ref,
        where("uid", "==", uid),
        where("dueDate", ">=", from),
        where("dueDate", "<=", to)
      );

      const snap = await getDocs(baseQuery);
      const Todos = [];
      snap.forEach((doc) => {
        Todos.push(doc.data());
      });
      return Todos;
    } catch (e) {
      console.error(e);
      return lastTodoArr;
    }
  };

  // Deleting the user
  const deleteUserByUid = async (user) => {
    try {
      await deleteUser(user);
      await deleteData(`users/${user.uid}`);
      await deleteData(`blocked/${user.uid}`);

      const ref = collection(database, "todo");

      const todosQuery = query(ref, where("uid", "==", user.uid));

      const todosSnapshot = await getDocs(todosQuery);
      todosSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Blocking user
  const BlockUser = async (email, uid) => {
    try {
      await addData(`blocked/${uid}`, { email: email, block: true });
    } catch (e) {
      console.log(e);
    }
  };

  const UnBlockUser = async (email, uid) => {
    try {
      await addData(`blocked/${uid}`, { email: email, block: false });
    } catch (e) {
      console.log(e);
    }
  };

  const CheckBlocked = async (email) => {
    const ref = collection(database, `blocked`);

    const baseQuery = query(ref, where("email", "==", email));

    const snap = await getDocs(baseQuery);

    return snap;
  };

  //Deleting user by Admin
  const DeleteUserByAdmin = async (uid) => {
    try {
      const colRef = collection(database, "users");
      const baseQuery = query(colRef, where("uid", "==", uid));

      const snap = await getDocs(baseQuery);

      if (snap) {
        snap.forEach(async (doc) => {
          const data = doc.data();
          await addData(`users/${data.uid}`, { ...data, delete: true });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Giving the context
  return (
    <FirebaseContext.Provider
      value={{
        addData,
        getDataByDoc,
        SignUpUserWithEmailAndPassword,
        SignInWithEmailAndPassword,
        SignInWithGoogle,
        deleteData,
        getDataByCollforUser,
        user,
        getAuthStateChange,
        isLoading,
        getPagination,
        getDataByCollforTodo,
        handleSearch,
        handleDone,
        handleDate,
        TotalTodos,
        TotalTodosFun,
        error,
        deleteUserByUid,
        Sno,
        getHighSno,
        BlockUser,
        DeleteUserByAdmin,
        UnBlockUser,
        CheckBlocked,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
