import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsersForAdmin } from "../Slice/AdminSlice";
import AdminUser from "../Components/AdminUser";

const Admin = (props) => {
  // Variable Declaration
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [userSelected, setuserSelected] = useState(null);
  const dispatch = useDispatch();

  // Reading all the user's data
  const ReadingUser = useCallback(() => {
    dispatch(getUsersForAdmin({ key: `users` })).then((res) => {
      setUserData(res.payload);
      setLoader(false);
    });
  }, [dispatch, getUsersForAdmin]);

  // Set selected user when userData changes
  useEffect(() => {
    if (userData.length > 0 && !userSelected) {
      setuserSelected(userData[0]);
    }
  }, [userData, userSelected]);

  useEffect(() => {
    ReadingUser();
  }, [ReadingUser]);

  // Only call this when you want to refresh the users list
  // const ReadingData = useCallback(() => {
  //   ReadingUser();
  // }, [ReadingUser]);

  return (
    <main className={`admin-main ${props.Theme === "dark" ? "dark" : ""}`}>
      <h1 className="text-center">Hey Admin 👋</h1>
      <hr />
      <div className="admin-page">
        {/* Users List */}
        {userData?.length !== 0 ? (
          <>
            <div className="admin-panel">
              {userData.map((eachUser, index) => (
                <div key={index}>
                  <div className="admin-users">
                    <h6
                      onClick={() => setuserSelected(eachUser)}
                      className={
                        userSelected && userSelected.uid === eachUser.uid
                          ? "admin-users-active"
                          : ""
                      }
                    >
                      <span>{eachUser.email}</span>
                      {userSelected && userSelected.uid === eachUser.uid && (
                        <span>
                          <i className="fa-solid fa-caret-down"></i>
                        </span>
                      )}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
            <div className="todos">
              <AdminUser
                user={userSelected}
                ReadingData={ReadingUser}
                Theme={props.Theme}
              />
            </div>
          </>
        ) : !loader ? (
          <div className="container text-white bg-danger noTodos text-center mt-5">
            <h4>No Other Users Yet</h4>
          </div>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </main>
  );
};

export default Admin;
