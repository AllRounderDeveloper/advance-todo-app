//Importing Modules
import React, { useCallback, useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";
import AdminUser from "../Components/AdminUser";

const Admin = (props) => {
  // Variable Declaration
  const firebase = useFirebase();
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [userSelected, setuserSelected] = useState(null);

  //Reading all the user's data
  const ReadingUser = useCallback(() => {
    firebase
      .getDataByCollforUser(`users`)
      .then((snap) => {
        const cleaned = [];
        snap.forEach((doc) => {
          const data = doc.data();
          if (data.uid === "vti9nMR6dmXZHoiIfAQiwurOdiJ3") {
            return;
          }
          if (data.delete) {
            return;
          }
          cleaned.push(data);
        });
        setUserData(cleaned);
        setLoader(false);
      })
      .catch((err) => console.error(err));
  }, [firebase]);

  const ReadingData = useCallback(() => {
    ReadingUser();
  }, [ReadingUser]);

  useEffect(() => {
    ReadingUser();
  }, [ReadingUser]);

  const returningUsers = useCallback(() => {
    userSelected === null && setuserSelected(userData[0]);
  }, [userData, userSelected]);

  return (
    <main className={`admin-main ${props.Theme === "dark" ? "dark" : ""}`}>
      <h1 className="text-center">Hey Admin 👋</h1>
      <hr />
      <div className="admin-page">
        {/* Users List */}
        <div className="admin-panel">
          {userData.length !== 0 ? (
            <>
              {returningUsers()}
              {userSelected &&
                userData.map((eachUser, index) => {
                  return (
                    <div className="admin-users" key={index}>
                      <h6
                        onClick={() => setuserSelected(eachUser)}
                        className={
                          userSelected.uid === eachUser.uid
                            ? "admin-users-active"
                            : ""
                        }
                      >
                        <span>{eachUser.email}</span>
                        {userSelected.uid === eachUser.uid && (
                          <span>
                            <i className="fa-solid fa-caret-down"></i>
                          </span>
                        )}
                      </h6>
                    </div>
                  );
                })}
            </>
          ) : (
            <>
              {!loader ? (
                <div className="container text-white bg-danger noTodos text-center mt-5">
                  <h4>No Users Yet</h4>
                </div>
              ) : (
                <>{loader && <div className="loader"></div>}</>
              )}
            </>
          )}
        </div>
        <div className="todos">
          {!(userData.length === 0) ? (
            <AdminUser
              user={userSelected}
              ReadingData={ReadingData}
              Theme={props.Theme}
              returningUsers={returningUsers}
            />
          ) : (
            <>
              {!loader ? (
                <div className="container text-white bg-danger noTodos text-center mt-5">
                  <h4>No Users Yet</h4>
                </div>
              ) : (
                <>{loader && <div className="loader"></div>}</>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
