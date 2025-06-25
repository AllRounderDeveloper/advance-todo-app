import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFirebaseUser } from "../config/FirebaseFunc";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../Slice/MainSlice";
import { fetchHighSno } from "../Slice/MainSlice";

const Create = (props) => {
  // State and hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useFirebaseUser();
  const userUID = userData?.user?.uid;
  const [uoItem, setuoItem] = useState(1);
  const [DueDateAdd, setDueDateAdd] = useState(false);
  const [WantLink, setWantLink] = useState(false);
  const [LinkTxt, setLinkTxt] = useState("");
  const [LinkUrl, setLinkUrl] = useState("");
  const [Sno, setSno] = useState();
  const date = props.date;
  const time = props.time;
  const dueTimecond = DueDateAdd ? "Required" : false;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (userUID) {
      dispatch(fetchHighSno({ userId: userUID })).then((res) => {
        setSno(res.payload)
      });
    }
  }, [dispatch, userUID]);

  // Add link to desc
  const handleAddLink = (e) => {
    if (e) e.preventDefault();
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
    navigate("/create");
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

  // Submit handler
  const submit = (e) => {
    const myFunc = EncodingDesc(e.desc);
    const todo = {
      sno: Sno,
      title: e.title,
      desc: myFunc,
      date: date,
      time: time,
      done: false,
      dueDate: e.dueDate || "no",
      dueTime: e.dueTime || "no",
      uid: userUID,
      lowerTitle: e.title.toLowerCase(),
      decodedDesc: e.desc,
    };
    dispatch(addTodo({ key: `todos/${userUID}_${Sno}`, data: todo }));
    navigate("/");
    dispatch(fetchHighSno(userUID));
  };

  return (
    <main className={`${props.Theme === "dark" ? "dark" : ""}`}>
      <form
        onSubmit={handleSubmit(submit)}
        className={`form main ${props.Theme === "dark" ? "dark" : ""}`}
      >
        <h3>Add Todo*</h3>
        {/* Due Date */}
        {DueDateAdd && (
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
                  <span className="error">({errors.dueDate.message})</span>
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
                {...register("dueTime", { required: dueTimecond })}
              />
              <label htmlFor="Time" className="text-secondary">
                Enter Due Date Time*{" "}
                {errors.dueTime && (
                  <span className="error">({errors.dueTime.message})</span>
                )}
              </label>
            </div>
          </>
        )}

        {/* Title */}
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
              <span className="error">({errors.title.message})</span>
            )}
          </label>
        </div>

        {/* Description */}
        <div className="form-floating mb-3">
          <textarea
            className="form-control desc"
            placeholder="Description of the Todo"
            id="Desc"
            style={{ height: "100px" }}
            {...register("desc", { required: "Required" })}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
              e.target.style.overflowY = "hidden";
            }}
          ></textarea>
          <label htmlFor="Desc" className="text-secondary">
            Description*{" "}
            {errors.desc && (
              <span className="error">({errors.desc.message})</span>
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
              className={`fa-solid fa-heading desc-btn`}
              title="Add heading"
              onClick={handleAddHeading}
            ></i>

            {/* date handling */}
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
          {/* Cancel and Submit */}
          <Link to={"/"} className="link">
            <input
              className="btn btn-outline-primary"
              type="reset"
              value={"Cancel"}
            />
          </Link>
          <input className="btn btn-primary" type="submit" value={"Add"} />
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
    </main>
  );
};

export default Create;
