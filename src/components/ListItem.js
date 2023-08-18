import { useState } from "react";

export default function ListItem(props) {
  const [showInfo, setShowInfo] = useState(false);

  function handleInfo() {
    if (props.isEditing) return;
    setShowInfo(!showInfo);
  }

  return (
    <li className="li-item">
      {props.entry.desc}
      {showInfo && <span className="created-at">{props.entry.time}</span>}
      <div>
        <span className="item-amount">{props.entry.amount}</span>
      </div>
      <div>
        <span className="btn-info" onClick={handleInfo}>
          <i
            className="fa-solid fa-circle-info"
            title={
              props.isEditing
                ? "Can't open more info while editing"
                : "Click for date/time info"
            }
          ></i>
        </span>
        <span
          className="btn-edit"
          onClick={() => {
            props.dispatch({
              type: "openEditMode",
              payload: {
                id: props.entry.id,
                oldDesc: props.entry.desc,
                oldVal: props.entry.amount,
              },
            });
          }}
        >
          <i
            className="fa-solid fa-pen-to-square"
            title={
              props.isEditing ? "Can't edit while modal is open" : "Edit entry"
            }
          ></i>
        </span>
        <span
          className="btn-delete"
          onClick={() => {
            props.dispatch({ type: "deleteEntry", payload: props.entry.id });
          }}
        >
          <i
            className="fa-solid fa-trash"
            title={
              props.isEditing
                ? "Can't delete entry while modal is open"
                : "Delete entry"
            }
          ></i>
        </span>
      </div>
    </li>
  );
}
