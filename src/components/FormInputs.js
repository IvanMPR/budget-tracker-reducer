import { useRef, useEffect } from "react";

export default function FormInputs({ dispatch, desc, amount, entries, type }) {
  const descriptionInput = useRef(null);

  useEffect(() => {
    descriptionInput.current.focus();
  }, [type, entries]);

  return (
    <form className="other-inputs">
      <input
        type="text"
        placeholder="Add description"
        className="value-inputs"
        onChange={(e) => dispatch({ type: "desc", payload: e.target.value })}
        value={desc}
        ref={descriptionInput}
      />
      <input
        type="number"
        placeholder="Add amount"
        className="value-inputs"
        onChange={(e) =>
          dispatch({ type: "value", payload: Number(e.target.value) })
        }
        value={amount}
      />
      <button
        type="submit"
        className="btn"
        onClick={(e) => {
          e.preventDefault();
          dispatch({ type: "addEntry" });
        }}
      >
        New entry
      </button>
    </form>
  );
}
