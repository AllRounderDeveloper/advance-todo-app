import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const FiltersPage = (props) => {
  const navigate = useNavigate();
  const { register, watch } = useForm();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("all");
  const searchQuery = watch("SearchBar") || "";

  // Helper to update all filters in URL
  const updateURL = (newFilters = {}) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (status && status !== "all") params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    // Overwrite with any new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    navigate(`/?${params.toString()}`);
  };

  useEffect(() => {
    updateURL();
  }, [from, to, searchQuery, status]);

  // Clear all filters
  const clearFunc = () => {
    setFrom("");
    setTo("");
    setStatus("all");
    navigate("/");
  };

  return (
    <section
      className={props.Theme === "dark" ? "dark-filters" : "filters-section"}
    >
      <form>
        <ul className="filters">
          <li>
            <h3 className="filters-heading">
              Filters <i className="fa-solid fa-filter"></i>
            </h3>
          </li>
          {/* Status Filter */}
          <li>
            <div className="form-floating mb-3">
              <select
                name="done"
                id="doneOrNot"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-control"
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="notDone">Not Done</option>
              </select>
              <label htmlFor="doneOrNot" className="text-secondary">
                Status
              </label>
            </div>
          </li>
          {/* Date Filter */}
          <li>
            Date:&ensp;
            <div className="form-floating mb-3 filter-div">
              <input
                type="date"
                className="form-control filter-input"
                id="from"
                placeholder="From"
                autoComplete="off"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <label htmlFor="from" className="text-secondary">
                From
              </label>
            </div>
            <div className="form-floating mb-3 filter-div">
              <input
                type="date"
                className="form-control filter-input"
                id="to"
                placeholder="To"
                autoComplete="off"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <label htmlFor="to" className="text-secondary">
                To
              </label>
            </div>
          </li>
          {/* Clear Button */}
          <li>
            <button
              className="btn btn-outline-danger clear-btn"
              type="button"
              onClick={clearFunc}
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
            className="form-control"
            type="text"
            placeholder="Search By Title"
            id="SearchBar"
            name="search"
            {...register("SearchBar")}
          />
        </form>
      </div>
    </section>
  );
};

export default FiltersPage;
