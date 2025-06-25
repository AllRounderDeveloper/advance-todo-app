//Importing modules
import { useCallback, useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const FiltersPage = (props) => {
    // Declaring Variables
    const navigate = useNavigate()
    const firebase = useFirebase();
    const user = firebase.user
    const [nowType, setNowType] = useState("")
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [Status, setStatus] = useState('');
    const [Verify, setVerify] = useState("");
    const [deleted, setDeleted] = useState();
    const { register, watch } = useForm();

    //Handeling submit of search
    const searchQuery = watch("SearchBar") || "";
    useEffect(() => {
        const query = searchQuery.trim();

        if (query === "") {
            navigate("/")
        } else {
            navigate(`/?search=${encodeURIComponent(query)}`);
        }
    }, [searchQuery, props, navigate]);

    //Taking data of user for updating type filter
    useEffect(() => {
        if (user) {
            firebase.getDataByDoc(`users/${user.uid}`)
                .then((snap) => {
                    if (snap) {
                        const data = snap.data()
                        setUserName(data.userName);
                        setEmail(data.email);
                        setVerify(data.verify);
                        setDeleted(data.delete);
                    }
                })
        }
    }, [firebase, user])

    //Changing the type filter
    const handleTypeFunc = useCallback((type) => {
        if (type) {
            setNowType(type)
            props.handleType(type)
            firebase.addData(`users/${user.uid}`, {
              type: type,
              userName: userName,
              email: email,
              uid: user.uid,
              theme: props.Theme,
              verify: Verify,
              delete: deleted,
            });
        }
    }, [props, firebase, user, userName, email, Verify, deleted]);

    //Sending data to parent (status filter)
    const HandleDoneFunc = useCallback((type) => {
        if (type) {
            props.HandleDone_Not(type)
        }
    }, [props])

    useEffect(() => {
        props.HandleDateType(from, to)
    }, [from, to, props])

    //Clearing the filters
    const clearFunc = () => {
        setFrom("");
        setTo("")
        HandleDoneFunc("all")
        setStatus("all")
    }

    return (
        <>
            {
                user
                    ?
                    <>
                        <section className={`${props.Theme === "dark" ? "dark-filters" : "filters-section"}`}>
                            <form>

                                <ul className="filters">
                                    {/* Top level Heading */}
                                    <li>
                                        <h3 className="filters-heading">Filters <i className="fa-solid fa-filter"></i></h3>
                                    </li>

                                    {/* Type filter */}
                                    <li className='types'>
                                        <div className="form-floating mb-3">

                                            <select name="type" id="type" onChange={(e) => handleTypeFunc(e.target.value)} value={nowType || ""} className="form-control">
                                                <option value="section">Section</option>
                                                <option value="table">Table</option>
                                            </select>

                                            <label
                                                htmlFor="to"
                                                className='text-secondary'
                                            >
                                                Type
                                            </label>

                                        </div>
                                    </li>

                                    {/* Status Filter */}
                                    <li className='isDone'>
                                        <div className="form-floating mb-3">

                                            <select
                                                name="done"
                                                id="doneOrNot"
                                                value={Status || "all"}
                                                onChange={(e) => {
                                                    HandleDoneFunc(e.target.value)
                                                    setStatus(e.target.value)
                                                }}
                                                style={({ width: "100px" })}
                                                className="form-control"
                                            >
                                                <option value="all">All</option>
                                                <option value="done">Done</option>
                                                <option value="notDone">Not Done</option>
                                            </select>

                                            <label
                                                htmlFor="to"
                                                className='text-secondary'
                                            >
                                                Status
                                            </label>

                                        </div>
                                    </li>

                                    {/* Date Filter */}
                                    <li className='dates'>
                                        Date:&ensp;
                                        <div className="form-floating mb-3 filter-div">

                                            <input
                                                type="date"
                                                className="form-control filter-input"
                                                id="from"
                                                placeholder="From"
                                                autoComplete='off'
                                                // value={from}
                                                onChange={(e) => setFrom(e.target.value)}
                                                required
                                            />

                                            <label
                                                htmlFor="from"
                                                className='text-secondary'
                                            >
                                                From
                                            </label>

                                        </div>

                                        <div className="form-floating mb-3 filter-div">

                                            <input
                                                type="date"
                                                className="form-control filter-input"
                                                id="to"
                                                placeholder="To"
                                                autoComplete='off'
                                                // value={to}
                                                onChange={(e) => setTo(e.target.value)}
                                                required
                                            />

                                            <label
                                                htmlFor="to"
                                                className='text-secondary'
                                            >
                                                To
                                            </label>

                                        </div>
                                    </li>

                                    {/* Clear Button */}
                                    <li>
                                        <button
                                            className="btn btn-outline-danger clear-btn"
                                            type="reset"
                                            onClick={() => clearFunc()}
                                        >
                                            Clear All
                                        </button>
                                    </li>

                                </ul>
                            </form>

                            {/* Search Bar */}
                            <div className="form-floating mb-3 search-div">
                                <form>
                                    <input
                                        className='form-control'
                                        type="text"
                                        placeholder="Search By Title"
                                        id='SearchBar'
                                        name='search'
                                        {...register("SearchBar")}
                                    />
                                </form>
                            </div>
                        </section>
                    </>
                    :
                    ""
            }
        </>
    )
}

export default FiltersPage;