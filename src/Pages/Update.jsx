import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFirebaseUser } from "../config/FirebaseFunc";
import { useDispatch } from "react-redux";
import { fetchTodoByKey, addTodo } from "../Slice/MainSlice";

const Update = (props) => {
  // State and hooks
  const { sno } = useParams();
  const dispatch = useDispatch();
  const [DueDateAdd, setDueDateAdd] = useState(false);
  const [uoItem, setuoItem] = useState(1);
  const [WantLink, setWantLink] = useState(false);
  const [LinkTxt, setLinkTxt] = useState("");
  const [LinkUrl, setLinkUrl] = useState("");
  const navigate = useNavigate();
  const { user } = useFirebaseUser();
  const [loading, setLoading] = useState(true);
  const dueTimecond = DueDateAdd ? "Required" : false;
  const [DueDate, setDueDate] = useState(null);
  const [Desc, setDesc] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // Add link to desc
  const handleAddLink = () => {
    if (LinkUrl) {
      const currentDesc = watch("desc") || "";
      const formattedUrl = LinkUrl.startsWith("http")
        ? LinkUrl
        : `https://${LinkUrl}`;
      const markdownLink = `\${{\u00A0${formattedUrl}|${LinkTxt}\u00A0}}`;
      setValue("desc", `${currentDesc} ${markdownLink}`.trim());
    }
    setWantLink(false);
    setLinkTxt("");
    setLinkUrl("");
    navigate("/update/" + sno);
  };

  // Add heading
  const handleAddHeading = () => {
    const descVal = watch("desc") || "";
    setValue("desc", descVal + "#");
  };

  // Add unordered list item
  const handleOrderList = () => {
    const descVal = watch("desc") || "";
    setValue("desc", descVal + "* ");
  };

  // Add ordered list item
  const handleUnOrderedList = () => {
    const descVal = watch("desc") || "";
    let newVal;
    descVal.split("\n").forEach((line) => {
      if (line === "") {
        newVal = descVal + `${uoItem}. `;
      } else {
        newVal = descVal + `\n${uoItem}. `;
      }
    });
    setValue("desc", newVal);
    setuoItem(uoItem + 1);
  };

  // Encode desc for submit
  const EncodingDesc = (desc) => {
    if (!desc) return desc;
    const lines = desc.split("\n");
    let result = [];
    let listBuffer = [];
    let listType = null;

    const flushList = () => {
      if (listBuffer.length > 0) {
        if (listType === "ul") result.push(`<ul>${listBuffer.join("")}</ul>`);
        else if (listType === "ol")
          result.push(`<ol>${listBuffer.join("")}</ol>`);
        listBuffer = [];
        listType = null;
      }
    };

    lines.forEach((line) => {
      let trimmed = line.trim();
      const orderedMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
      const unorderedMatch = trimmed.match(/^[-*]\s*(.*)/);

      if (orderedMatch) {
        if (listType !== "ol") flushList();
        listType = "ol";
        listBuffer.push(`<li>${parseDescLine(orderedMatch[2])}</li>`);
      } else if (unorderedMatch) {
        if (listType !== "ul") flushList();
        listType = "ul";
        listBuffer.push(`<li>${parseDescLine(unorderedMatch[1])}</li>`);
      } else {
        flushList();
        if (trimmed.length > 0) result.push(parseDescLine(trimmed) + "<br />");
      }
    });

    flushList();
    return result.join("\n");
  };

  // Parse line for links and headings
  const parseDescLine = (line) => {
    let trimmed = line.trim();
    if (trimmed.includes("${{\u00A0") && trimmed.includes("\u00A0}}")) {
      const LinkStart = trimmed.indexOf("${{\u00A0");
      const LinkEnd = trimmed.indexOf("\u00A0}}");
      const codedLink = trimmed.slice(LinkStart, LinkEnd);
      const innerContent = codedLink
        .replace("${{\u00A0", "")
        .replace("\u00A0}}", "")
        .trim();
      const [url, text] = innerContent.split("|").map((s) => s.trim());
      return `<a href="${url}" target="_blank" class="desc-link">${text}</a>`;
    }
    if (trimmed.startsWith("#")) {
      const newResult = trimmed.replace("#", "");
      return `<h3 style="text-align: left; display: inline-block;">${newResult}</h3>`;
    }
    return trimmed;
  };

  // Fetch todo data
  useEffect(() => {
    if (user) {
      dispatch(fetchTodoByKey({ key: `todos/${user.uid}_${sno}` })).then(
        (TodoDate) => {
          console.log(TodoDate);

          reset({
            title: TodoDate.payload.title,
            desc: TodoDate.payload.decodedDesc,
            dueDate: TodoDate.payload.dueDate,
            time: TodoDate.payload.dueTime,
          });
          setDueDate(TodoDate.payload.dueDate);
          setDesc(TodoDate.payload.decodedDesc);
          setLoading(false);
        }
      );
    }
  }, [dispatch, sno, user, reset]);

  // Submit handler
  const submit = (e) => {
    const todo = {
      sno: parseInt(sno),
      title: e.title,
      lowerTitle: e.title.toLowerCase(),
      desc: EncodingDesc(e.desc),
      date: props.date,
      time: props.time,
      done: false,
      dueDate: e.dueDate,
      dueTime: e.time,
      uid: user.uid,
      decodedDesc: e.desc,
    };
    dispatch(addTodo({key: `todos/${user.uid}_${sno}`, data: todo}));
    navigate("/");
  };

  return (
    <main className={`${props.Theme === "dark" ? "dark" : ""}`}>
      {loading || !Desc ? (
        <div className="main">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(submit)} className="form main">
            <h3>Update Todo*</h3>
            {(DueDateAdd || DueDate !== "no") && (
              <>
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    id="Date"
                    placeholder="Enter Due date"
                    autoComplete="off"
                    {...register("dueDate", { required: dueTimecond })}
                  />
                  <label htmlFor="Date" className="text-secondary">
                    Enter Due Date*{" "}
                    {errors.dueDate && (
                      <span className="text-danger">
                        {errors.dueDate.message}
                      </span>
                    )}
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="time"
                    className="form-control"
                    id="Time"
                    placeholder="Enter Due Time"
                    autoComplete="off"
                    {...register("time", { required: dueTimecond })}
                  />
                  <label htmlFor="Time" className="text-secondary">
                    Enter Due Time*{" "}
                    {errors.time && (
                      <span className="text-danger">{errors.time.message}</span>
                    )}
                  </label>
                </div>
              </>
            )}

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="Title"
                placeholder="Title of the Todo"
                autoComplete="off"
                {...register("title", { required: "Required" })}
              />
              <label htmlFor="Title" className="text-secondary">
                Enter Title*{" "}
                {errors.title && (
                  <span className="text-danger">{errors.title.message}</span>
                )}
              </label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                className="form-control desc"
                placeholder="Description of the Todo"
                id="Desc"
                style={{ height: "200px" }}
                {...register("desc", { required: "Required" })}
              ></textarea>
              <label htmlFor="Desc" className="text-secondary">
                Description*{" "}
                {errors.desc && (
                  <span className="text-danger">{errors.desc.message}</span>
                )}
              </label>

              {/* Description Buttons */}
              <div className="desc-bottom">
                <i
                  className="fa-solid fa-link desc-btn"
                  onClick={() => setWantLink(true)}
                  title="Add Link"
                ></i>
                <i
                  className="fa-solid fa-list desc-btn"
                  title="Add UnOrdered List Item"
                  onClick={handleOrderList}
                ></i>
                <i
                  className="fa-solid fa-list-ol desc-btn"
                  title="Add Ordered List Item"
                  onClick={handleUnOrderedList}
                ></i>
                <i
                  className="fa-solid fa-heading desc-btn"
                  title="Add heading"
                  onClick={handleAddHeading}
                ></i>
                {!DueDateAdd ? (
                  <i
                    className="fa-solid fa-calendar desc-btn"
                    onClick={() => setDueDateAdd(true)}
                    title="Add due Date"
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-calendar-xmark desc-btn"
                    onClick={() => setDueDateAdd(false)}
                    title="Remove due Date"
                  ></i>
                )}
              </div>
            </div>

            <div className="form-bottoms">
              <Link to="/" className="link">
                <input
                  className="btn btn-outline-primary"
                  type="reset"
                  value={"Cancel"}
                />
              </Link>
              <input
                className="btn btn-primary"
                type="submit"
                value={"Update"}
              />
            </div>
          </form>

          {/* Link Modal Form */}
          {WantLink && (
            <>
              <div className="blurer" onClick={() => setWantLink(false)}></div>
              <form className="link-model form" onSubmit={handleAddLink}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="linkTxt"
                    placeholder="Link text"
                    autoComplete="off"
                    value={LinkTxt}
                    onChange={(e) => setLinkTxt(e.target.value)}
                  />
                  <label className="text-secondary">Enter Link text</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="url"
                    className="form-control"
                    id="linkUrl"
                    placeholder="Link URL"
                    autoComplete="off"
                    value={
                      LinkUrl.split("").length === 0
                        ? `https://www.${LinkUrl}`
                        : LinkUrl
                    }
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required
                  />
                  <label className="text-secondary">Enter Link URL*</label>
                </div>
                <div className="form-bottoms">
                  <input
                    className="btn btn-outline-primary"
                    type="reset"
                    value={"Cancel"}
                    onClick={() => {
                      setWantLink(false);
                      setLinkTxt("");
                      setLinkUrl("");
                    }}
                  />
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value={"Add Link"}
                    disabled={!LinkUrl || !LinkTxt}
                  />
                </div>
              </form>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Update;
