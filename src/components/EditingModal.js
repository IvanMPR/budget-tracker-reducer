import { useState, useEffect, useRef } from "react";

export default function EditingModal({ descToEdit, amountToEdit, dispatch }) {
  const [newDesc, setNewDesc] = useState(descToEdit);
  const [newAmount, setNewAmount] = useState(amountToEdit);
  const modalInput = useRef(null);

  useEffect(() => {
    modalInput.current.focus();
  }, []);

  return (
    <div className="editing-modal">
      <span
        className="close-modal"
        title="Close window"
        onClick={() => dispatch({ type: "closeModal" })}
      >
        X
      </span>
      <h2>Edit entry</h2>
      <form className="editing-form">
        <input
          type="text"
          value={newDesc}
          onChange={(e) => {
            setNewDesc(e.target.value);
          }}
          ref={modalInput}
        />
        <input
          type="number"
          value={newAmount}
          onChange={(e) => {
            setNewAmount(Number(e.target.value));
          }}
        />
        <button
          type="submit"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "edit", payload: { newDesc, newAmount } });
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
